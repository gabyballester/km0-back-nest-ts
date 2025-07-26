#!/usr/bin/env node

/**
 * Database Manager Script
 * Automatically detects and uses the configured ORM (Prisma or Drizzle)
 * Supports all database operations across different environments
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  console.error(`${colors.red}❌ ${message}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

/**
 * Get environment variables
 */
function getEnvVars() {
  // In production (Render), always use process.env directly
  if (process.env.NODE_ENV === 'production') {
    return process.env;
  }

  const envFile =
    process.env.NODE_ENV === 'test' ? '.env.test' : '.env.development';

  const envPath = path.join(process.cwd(), envFile);

  if (!fs.existsSync(envPath)) {
    logWarning(`Environment file ${envFile} not found, using process.env`);
    return process.env;
  }

  // Load environment variables from file
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};

  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });

  return { ...process.env, ...envVars };
}

/**
 * Get configured ORM type
 */
function getOrmType() {
  const envVars = getEnvVars();
  const ormType = envVars.DATABASE_ORM || 'prisma';

  if (!['prisma', 'drizzle'].includes(ormType)) {
    logError(`Invalid DATABASE_ORM: ${ormType}. Must be 'prisma' or 'drizzle'`);
    process.exit(1);
  }

  return ormType;
}

/**
 * Execute command with proper environment
 */
function executeCommand(command, description) {
  try {
    logInfo(`Executing: ${description}`);
    log(`Command: ${command}`, 'cyan');

    const envVars = getEnvVars();
    const result = execSync(command, {
      stdio: 'inherit',
      env: { ...process.env, ...envVars },
    });

    logSuccess(`${description} completed successfully`);
    return result;
  } catch (error) {
    logError(`${description} failed: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Database operations for Prisma
 */
const prismaOperations = {
  generate: () =>
    executeCommand('npx prisma generate', 'Generate Prisma client'),

  push: (env = '') => {
    const envFlag = env ? `-e .env.${env}` : '';
    const command = envFlag
      ? `dotenv ${envFlag} -- npx prisma db push --accept-data-loss`
      : 'npx prisma db push --accept-data-loss';
    return executeCommand(
      command,
      `Push Prisma schema to database (${env || 'current'})`,
    );
  },

  migrate: (env = '') => {
    const envFlag = env ? `-e .env.${env}` : '';
    const command = envFlag
      ? `dotenv ${envFlag} -- npx prisma migrate dev`
      : 'npx prisma migrate dev';
    return executeCommand(
      command,
      `Run Prisma migrations (${env || 'current'})`,
    );
  },

  migrateDeploy: (env = '') => {
    // In production, use process.env directly (no dotenv needed)
    const command = 'npx prisma migrate deploy';
    return executeCommand(
      command,
      `Deploy Prisma migrations (${env || 'current'})`,
    );
  },

  reset: (env = '') => {
    const envFlag = env ? `-e .env.${env}` : '';
    const command = envFlag
      ? `dotenv ${envFlag} -- npx prisma migrate reset --force`
      : 'npx prisma migrate reset --force';
    return executeCommand(
      command,
      `Reset Prisma database (${env || 'current'})`,
    );
  },

  studio: (env = '') => {
    const envFlag = env ? `-e .env.${env}` : '';
    const command = envFlag
      ? `dotenv ${envFlag} -- npx prisma studio`
      : 'npx prisma studio';
    return executeCommand(command, `Open Prisma Studio (${env || 'current'})`);
  },

  seed: (env = '') => {
    const envFlag = env ? `-e .env.${env}` : '';
    const command = envFlag
      ? `dotenv ${envFlag} -- npx prisma db seed`
      : 'npx prisma db seed';
    return executeCommand(command, `Run Prisma seeders (${env || 'current'})`);
  },
};

/**
 * Database operations for Drizzle
 */
const drizzleOperations = {
  generate: () =>
    executeCommand('npx drizzle-kit generate', 'Generate Drizzle migrations'),

  push: (env = '') => {
    const envFlag = env ? `-e .env.${env}` : '';
    const command = envFlag
      ? `dotenv ${envFlag} -- npx drizzle-kit push`
      : 'npx drizzle-kit push';
    return executeCommand(
      command,
      `Push Drizzle schema to database (${env || 'current'})`,
    );
  },

  migrate: (env = '') => {
    const envFlag = env ? `-e .env.${env}` : '';
    const command = envFlag
      ? `dotenv ${envFlag} -- npx drizzle-kit migrate`
      : 'npx drizzle-kit migrate';
    return executeCommand(
      command,
      `Run Drizzle migrations (${env || 'current'})`,
    );
  },

  migrateDeploy: (env = '') => {
    // In production, use process.env directly (no dotenv needed)
    const command = 'npx drizzle-kit migrate';
    return executeCommand(
      command,
      `Deploy Drizzle migrations (${env || 'current'})`,
    );
  },

  reset: (env = '') => {
    logWarning('Drizzle reset: This will drop and recreate the database');
    const envFlag = env ? `-e .env.${env}` : '';
    const command = envFlag
      ? `dotenv ${envFlag} -- npx drizzle-kit drop && dotenv ${envFlag} -- npx drizzle-kit push`
      : 'npx drizzle-kit drop && npx drizzle-kit push';
    return executeCommand(
      command,
      `Reset Drizzle database (${env || 'current'})`,
    );
  },

  studio: (env = '') => {
    const envFlag = env ? `-e .env.${env}` : '';
    const command = envFlag
      ? `dotenv ${envFlag} -- npx drizzle-kit studio`
      : 'npx drizzle-kit studio';
    return executeCommand(command, `Open Drizzle Studio (${env || 'current'})`);
  },

  seed: (env = '') => {
    logWarning('Drizzle seed: You need to implement custom seeders');
    logInfo('Create a seed script in scripts/seed.js and run it manually');
    return executeCommand(
      'node scripts/seed.js',
      `Run Drizzle seeders (${env || 'current'})`,
    );
  },
};

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const operation = args[0];
  const environment = args[1] || '';

  if (!operation) {
    logError('Usage: node scripts/db-manager.js <operation> [environment]');
    logInfo(
      'Operations: generate, push, migrate, migrate:deploy, reset, studio, seed',
    );
    logInfo('Environments: dev, test, prod (optional)');
    process.exit(1);
  }

  const ormType = getOrmType();
  logInfo(`Using ORM: ${ormType.toUpperCase()}`);
  logInfo(`Environment: ${environment || 'current'}`);
  logInfo(`Operation: ${operation}`);

  const operations =
    ormType === 'prisma' ? prismaOperations : drizzleOperations;

  switch (operation) {
    case 'generate':
      operations.generate();
      break;

    case 'push':
      operations.push(environment);
      break;

    case 'migrate':
      operations.migrate(environment);
      break;

    case 'migrate:deploy':
      operations.migrateDeploy(environment);
      break;

    case 'reset':
      operations.reset(environment);
      break;

    case 'studio':
      operations.studio(environment);
      break;

    case 'seed':
      operations.seed(environment);
      break;

    default:
      logError(`Unknown operation: ${operation}`);
      logInfo(
        'Available operations: generate, push, migrate, migrate:deploy, reset, studio, seed',
      );
      process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { getOrmType, getEnvVars };
