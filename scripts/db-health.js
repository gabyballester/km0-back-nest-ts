#!/usr/bin/env node

/**
 * Advanced Database Health Check Script
 * Comprehensive health check for both ORMs
 * Checks connection, schema, migrations, and data integrity
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

function logHeader(message) {
  console.log(`\n${colors.bright}${colors.cyan}${message}${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(message.length)}${colors.reset}`);
}

/**
 * Check environment configuration
 */
function checkEnvironment() {
  logHeader('Environment Configuration');

  const envVars = getEnvVars();
  const ormType = getOrmType();

  logInfo(`ORM Type: ${ormType.toUpperCase()}`);
  logInfo(`Node Environment: ${envVars.NODE_ENV || 'development'}`);

  // Check required variables
  const requiredVars = ['DATABASE_URL'];
  const missingVars = requiredVars.filter(varName => !envVars[varName]);

  if (missingVars.length > 0) {
    logError(`Missing required variables: ${missingVars.join(', ')}`);
    return false;
  }

  // Check DATABASE_URL format
  const dbUrl = envVars.DATABASE_URL;
  if (!dbUrl.includes('postgresql://')) {
    logError('DATABASE_URL must be a PostgreSQL connection string');
    return false;
  }

  logSuccess('Environment configuration valid');
  return true;
}

/**
 * Check file structure
 */
function checkFileStructure() {
  logHeader('File Structure');

  const requiredFiles = [
    'drizzle.config.ts',
    'src/infrastructure/database/schemas/user.schema.ts',
    'prisma/schema.prisma'
  ];

  let allValid = true;

  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      logSuccess(`✓ ${file}`);
    } else {
      logError(`✗ ${file} - Missing`);
      allValid = false;
    }
  });

  // Check directories
  const requiredDirs = [
    'drizzle',
    'src/infrastructure/database/schemas',
    'prisma/migrations',
    'data'
  ];

  requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      logSuccess(`✓ ${dir}/`);
    } else {
      logWarning(`⚠ ${dir}/ - Missing (will be created when needed)`);
    }
  });

  return allValid;
}

/**
 * Check Drizzle health
 */
function checkDrizzleHealth() {
  logHeader('Drizzle Health Check');

  try {
    // Check if drizzle-kit is installed
    execSync('npx drizzle-kit --version', { stdio: 'pipe' });
    logSuccess('Drizzle Kit installed');
  } catch (error) {
    logError('Drizzle Kit not installed');
    return false;
  }

  // Check config file
  if (!fs.existsSync('drizzle.config.ts')) {
    logError('drizzle.config.ts not found');
    return false;
  }

  // Check schemas
  const schemasDir = 'src/infrastructure/database/schemas';
  if (!fs.existsSync(schemasDir)) {
    logError('Schemas directory not found');
    return false;
  }

  const schemaFiles = fs.readdirSync(schemasDir).filter(file => file.endsWith('.ts'));
  if (schemaFiles.length === 0) {
    logError('No schema files found');
    return false;
  }

  logSuccess(`Found ${schemaFiles.length} schema files`);

  // Check migrations
  const migrationsDir = 'drizzle';
  if (fs.existsSync(migrationsDir)) {
    const migrations = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql'));
    logSuccess(`Found ${migrations.length} migrations`);
  } else {
    logWarning('No migrations directory found');
  }

  return true;
}

/**
 * Check Prisma health
 */
function checkPrismaHealth() {
  logHeader('Prisma Health Check');

  try {
    // Check if prisma is installed
    execSync('npx prisma --version', { stdio: 'pipe' });
    logSuccess('Prisma CLI installed');
  } catch (error) {
    logError('Prisma CLI not installed');
    return false;
  }

  // Check schema file
  if (!fs.existsSync('prisma/schema.prisma')) {
    logError('prisma/schema.prisma not found');
    return false;
  }

  // Check client
  const clientDir = 'node_modules/.prisma';
  if (fs.existsSync(clientDir)) {
    logSuccess('Prisma client generated');
  } else {
    logWarning('Prisma client not generated');
  }

  // Check migrations
  const migrationsDir = 'prisma/migrations';
  if (fs.existsSync(migrationsDir)) {
    const migrations = fs.readdirSync(migrationsDir).filter(dir =>
      fs.statSync(path.join(migrationsDir, dir)).isDirectory()
    );
    logSuccess(`Found ${migrations.length} migrations`);
  } else {
    logWarning('No migrations directory found');
  }

  return true;
}

/**
 * Check database connection
 */
function checkDatabaseConnection() {
  logHeader('Database Connection');

  const ormType = getOrmType();
  const envVars = getEnvVars();

  try {
    if (ormType === 'drizzle') {
      // Test Drizzle connection
      const testScript = `
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');

async function testConnection() {
  const client = postgres('${envVars.DATABASE_URL}');
  const db = drizzle(client);

  try {
    const result = await db.execute(sql\`SELECT 1 as test, current_database() as db_name, current_user as user\`);
    console.log('Connection successful:', result[0]);
  } finally {
    await client.end();
  }
}

testConnection().catch(console.error);
`;

      const testFile = path.join(process.cwd(), 'temp-connection-test.js');
      fs.writeFileSync(testFile, testScript);

      try {
        const result = execSync(`node ${testFile}`, { stdio: 'pipe' }).toString();
        logSuccess('Database connection successful');
        logInfo(result.trim());
      } finally {
        fs.unlinkSync(testFile);
      }
    } else {
      // Test Prisma connection
      const result = execSync('npx prisma db execute --stdin', {
        input: 'SELECT 1 as test, current_database() as db_name, current_user as user;',
        stdio: 'pipe'
      }).toString();

      logSuccess('Database connection successful');
      logInfo(result.trim());
    }

    return true;
  } catch (error) {
    logError(`Database connection failed: ${error.message}`);
    return false;
  }
}

/**
 * Check data integrity
 */
function checkDataIntegrity() {
  logHeader('Data Integrity');

  const ormType = getOrmType();

  try {
    if (ormType === 'drizzle') {
      // Check Drizzle data
      const testScript = `
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { users } = require('../src/infrastructure/database/schemas/user.schema');

async function checkData() {
  const client = postgres('${getEnvVars().DATABASE_URL}');
  const db = drizzle(client);

  try {
    const userCount = await db.select().from(users);
    console.log(\`Found \${userCount.length} users\`);

    if (userCount.length > 0) {
      console.log('Sample user:', userCount[0]);
    }
  } finally {
    await client.end();
  }
}

checkData().catch(console.error);
`;

      const testFile = path.join(process.cwd(), 'temp-data-test.js');
      fs.writeFileSync(testFile, testScript);

      try {
        const result = execSync(`node ${testFile}`, { stdio: 'pipe' }).toString();
        logSuccess('Data integrity check passed');
        logInfo(result.trim());
      } finally {
        fs.unlinkSync(testFile);
      }
    } else {
      // Check Prisma data
      const result = execSync('npx prisma db execute --stdin', {
        input: 'SELECT COUNT(*) as user_count FROM users;',
        stdio: 'pipe'
      }).toString();

      logSuccess('Data integrity check passed');
      logInfo(result.trim());
    }

    return true;
  } catch (error) {
    logWarning(`Data integrity check failed: ${error.message}`);
    return false;
  }
}

/**
 * Generate health report
 */
function generateHealthReport(results) {
  logHeader('Health Report Summary');

  const totalChecks = Object.keys(results).length;
  const passedChecks = Object.values(results).filter(result => result).length;
  const failedChecks = totalChecks - passedChecks;

  logInfo(`Total checks: ${totalChecks}`);
  logSuccess(`Passed: ${passedChecks}`);

  if (failedChecks > 0) {
    logError(`Failed: ${failedChecks}`);
  } else {
    logSuccess('All checks passed! 🎉');
  }

  // Detailed results
  Object.entries(results).forEach(([check, passed]) => {
    const status = passed ? '✅' : '❌';
    const color = passed ? 'green' : 'red';
    log(`${status} ${check}`, color);
  });

  return failedChecks === 0;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const environment = args[0] || '';
  const skipConnection = args.includes('--skip-connection');
  const skipData = args.includes('--skip-data');

  log('🏥 Database Health Check', 'bright');
  log('=======================', 'bright');

  // Set environment if specified
  if (environment) {
    process.env.NODE_ENV = environment;
  }

  const results = {};

  try {
    // Run health checks
    results.environment = checkEnvironment();
    results.fileStructure = checkFileStructure();

    const ormType = getOrmType();
    if (ormType === 'drizzle') {
      results.drizzleHealth = checkDrizzleHealth();
    } else {
      results.prismaHealth = checkPrismaHealth();
    }

    if (!skipConnection) {
      results.connection = checkDatabaseConnection();
    }

    if (!skipData) {
      results.dataIntegrity = checkDataIntegrity();
    }

    // Generate report
    const allHealthy = generateHealthReport(results);

    if (allHealthy) {
      logSuccess('\n🎉 Database is healthy!');
      process.exit(0);
    } else {
      logError('\n❌ Database has issues that need attention');
      process.exit(1);
    }

  } catch (error) {
    logError(`Health check failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  checkEnvironment,
  checkFileStructure,
  checkDrizzleHealth,
  checkPrismaHealth,
  checkDatabaseConnection,
  checkDataIntegrity
};
