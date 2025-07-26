#!/usr/bin/env node

/**
 * Database Validation Script
 * Validates database connection, schema, and migrations for both ORMs
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Import the database manager utilities
const { getOrmType, getEnvVars } = require('./db-manager.js');

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
 * Validate Prisma database
 */
async function validatePrisma() {
  logInfo('Validating Prisma database...');

  try {
    // Check if schema exists
    const schemaFile = path.join(process.cwd(), 'prisma', 'schema.prisma');
    if (!fs.existsSync(schemaFile)) {
      logError('Prisma schema not found at prisma/schema.prisma');
      return false;
    }
    logSuccess('Prisma schema found');

    // Check if client is generated
    const clientDir = path.join(process.cwd(), 'node_modules', '.prisma');
    if (!fs.existsSync(clientDir)) {
      logWarning('Prisma client not generated, generating...');
      execSync('npx prisma generate', { stdio: 'inherit' });
    }
    logSuccess('Prisma client ready');

    // Validate database connection
    logInfo('Testing database connection...');
    execSync('npx prisma db execute --stdin --url "$DATABASE_URL"', {
      input: 'SELECT 1 as test;',
      stdio: 'pipe'
    });
    logSuccess('Database connection successful');

    // Check migrations
    logInfo('Checking migrations...');
    const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations');
    if (fs.existsSync(migrationsDir)) {
      const migrations = fs.readdirSync(migrationsDir).filter(dir =>
        fs.statSync(path.join(migrationsDir, dir)).isDirectory()
      );
      logSuccess(`Found ${migrations.length} migrations`);
    } else {
      logWarning('No migrations directory found');
    }

    return true;
  } catch (error) {
    logError(`Prisma validation failed: ${error.message}`);
    return false;
  }
}

/**
 * Validate Drizzle database
 */
async function validateDrizzle() {
  logInfo('Validating Drizzle database...');

  try {
    // Check if config exists
    const configFile = path.join(process.cwd(), 'drizzle.config.ts');
    if (!fs.existsSync(configFile)) {
      logError('Drizzle config not found at drizzle.config.ts');
      return false;
    }
    logSuccess('Drizzle config found');

    // Check if schemas exist
    const schemasDir = path.join(process.cwd(), 'src', 'infrastructure', 'database', 'schemas');
    if (!fs.existsSync(schemasDir)) {
      logError('Drizzle schemas not found');
      return false;
    }

    const schemaFiles = fs.readdirSync(schemasDir).filter(file => file.endsWith('.ts'));
    if (schemaFiles.length === 0) {
      logError('No schema files found in schemas directory');
      return false;
    }
    logSuccess(`Found ${schemaFiles.length} schema files`);

    // Check if migrations directory exists
    const migrationsDir = path.join(process.cwd(), 'drizzle');
    if (!fs.existsSync(migrationsDir)) {
      logWarning('No migrations directory found, creating...');
      fs.mkdirSync(migrationsDir, { recursive: true });
    }

    // Validate database connection
    logInfo('Testing database connection...');
    const envVars = getEnvVars();
    const connectionString = envVars.DATABASE_URL;

    if (!connectionString) {
      logError('DATABASE_URL not found in environment');
      return false;
    }

    // Test connection with a simple query
    const testQuery = `
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');

async function testConnection() {
  const client = postgres('${connectionString}');
  const db = drizzle(client);

  try {
    const result = await db.execute(sql\`SELECT 1 as test\`);
    console.log('Connection successful:', result);
  } finally {
    await client.end();
  }
}

testConnection().catch(console.error);
`;

    const testFile = path.join(process.cwd(), 'temp-connection-test.js');
    fs.writeFileSync(testFile, testQuery);

    try {
      execSync(`node ${testFile}`, { stdio: 'pipe' });
      logSuccess('Database connection successful');
    } finally {
      fs.unlinkSync(testFile);
    }

    return true;
  } catch (error) {
    logError(`Drizzle validation failed: ${error.message}`);
    return false;
  }
}

/**
 * Check environment configuration
 */
function validateEnvironment() {
  logInfo('Validating environment configuration...');

  const envVars = getEnvVars();
  const ormType = getOrmType();

  logInfo(`Configured ORM: ${ormType}`);

  // Check required environment variables
  const requiredVars = ['DATABASE_URL'];
  const missingVars = requiredVars.filter(varName => !envVars[varName]);

  if (missingVars.length > 0) {
    logError(`Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }

  logSuccess('Environment configuration valid');
  return true;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const environment = args[0] || '';

  logInfo('🔍 Database Validator');
  logInfo(`Environment: ${environment || 'current'}`);

  // Set environment if specified
  if (environment) {
    process.env.NODE_ENV = environment;
  }

  let allValid = true;

  // Validate environment
  if (!validateEnvironment()) {
    allValid = false;
  }

  // Validate ORM-specific configuration
  const ormType = getOrmType();
  if (ormType === 'prisma') {
    if (!(await validatePrisma())) {
      allValid = false;
    }
  } else {
    if (!(await validateDrizzle())) {
      allValid = false;
    }
  }

  if (allValid) {
    logSuccess('🎉 All validations passed!');
    process.exit(0);
  } else {
    logError('❌ Some validations failed');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validatePrisma, validateDrizzle, validateEnvironment };
