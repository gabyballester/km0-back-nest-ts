#!/usr/bin/env node

/**
 * Database Backup and Restore Script
 * Creates and restores database backups for both ORMs
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
 * Parse database URL to extract connection details
 */
function parseDatabaseUrl(url) {
  try {
    const urlObj = new URL(url);
    return {
      host: urlObj.hostname,
      port: urlObj.port || '5432',
      database: urlObj.pathname.slice(1),
      username: urlObj.username,
      password: urlObj.password,
    };
  } catch (error) {
    throw new Error('Invalid DATABASE_URL format');
  }
}

/**
 * Create backup directory
 */
function ensureBackupDirectory() {
  const backupDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    logSuccess('Created backups directory');
  }
  return backupDir;
}

/**
 * Generate backup filename
 */
function generateBackupFilename(prefix = 'backup') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `${prefix}-${timestamp}.sql`;
}

/**
 * Create PostgreSQL backup
 */
function createPostgresBackup(backupFile, dbConfig) {
  logInfo('Creating PostgreSQL backup...');

  const pgDumpCmd = `pg_dump -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.username} -d ${dbConfig.database} -f ${backupFile}`;

  try {
    // Set PGPASSWORD environment variable
    const env = { ...process.env, PGPASSWORD: dbConfig.password };
    execSync(pgDumpCmd, { env, stdio: 'inherit' });
    logSuccess('PostgreSQL backup created successfully');
    return true;
  } catch (error) {
    logError(`PostgreSQL backup failed: ${error.message}`);
    return false;
  }
}

/**
 * Restore PostgreSQL backup
 */
function restorePostgresBackup(backupFile, dbConfig) {
  logInfo('Restoring PostgreSQL backup...');

  const psqlCmd = `psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.username} -d ${dbConfig.database} -f ${backupFile}`;

  try {
    // Set PGPASSWORD environment variable
    const env = { ...process.env, PGPASSWORD: dbConfig.password };
    execSync(psqlCmd, { env, stdio: 'inherit' });
    logSuccess('PostgreSQL backup restored successfully');
    return true;
  } catch (error) {
    logError(`PostgreSQL restore failed: ${error.message}`);
    return false;
  }
}

/**
 * Create data-only backup (JSON format)
 */
function createDataBackup(backupFile) {
  logInfo('Creating data-only backup...');

  const ormType = getOrmType();

  try {
    if (ormType === 'drizzle') {
      // Export data using Drizzle
      const exportScript = `
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const fs = require('fs');
const { users } = require('../src/infrastructure/database/schemas/user.schema');

async function exportData() {
  const client = postgres('${getEnvVars().DATABASE_URL}');
  const db = drizzle(client);

  try {
    const userData = await db.select().from(users);

    const backup = {
      timestamp: new Date().toISOString(),
      orm: 'drizzle',
      tables: {
        users: userData
      }
    };

    fs.writeFileSync('${backupFile}', JSON.stringify(backup, null, 2));
    console.log('Data backup created successfully');
  } finally {
    await client.end();
  }
}

exportData().catch(console.error);
`;

      const scriptFile = path.join(process.cwd(), 'temp-export.js');
      fs.writeFileSync(scriptFile, exportScript);

      try {
        execSync(`node ${scriptFile}`, { stdio: 'inherit' });
        logSuccess('Data backup created successfully');
        return true;
      } finally {
        fs.unlinkSync(scriptFile);
      }
    } else {
      // Export data using Prisma
      const exportScript = `
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function exportData() {
  try {
    const userData = await prisma.user.findMany();

    const backup = {
      timestamp: new Date().toISOString(),
      orm: 'prisma',
      tables: {
        users: userData
      }
    };

    fs.writeFileSync('${backupFile}', JSON.stringify(backup, null, 2));
    console.log('Data backup created successfully');
  } finally {
    await prisma.$disconnect();
  }
}

exportData().catch(console.error);
`;

      const scriptFile = path.join(process.cwd(), 'temp-export.js');
      fs.writeFileSync(scriptFile, exportScript);

      try {
        execSync(`node ${scriptFile}`, { stdio: 'inherit' });
        logSuccess('Data backup created successfully');
        return true;
      } finally {
        fs.unlinkSync(scriptFile);
      }
    }
  } catch (error) {
    logError(`Data backup failed: ${error.message}`);
    return false;
  }
}

/**
 * Restore data-only backup
 */
function restoreDataBackup(backupFile) {
  logInfo('Restoring data-only backup...');

  try {
    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    const ormType = getOrmType();

    if (backupData.orm !== ormType) {
      logWarning(
        `Backup was created with ${backupData.orm}, but current ORM is ${ormType}`,
      );
    }

    if (ormType === 'drizzle') {
      // Restore data using Drizzle
      const restoreScript = `
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { users } = require('../src/infrastructure/database/schemas/user.schema');

async function restoreData() {
  const client = postgres('${getEnvVars().DATABASE_URL}');
  const db = drizzle(client);

  try {
    const backupData = ${JSON.stringify(backupData)};

    if (backupData.tables.users) {
      // Clear existing data
      await db.delete(users);

      // Insert backup data
      for (const user of backupData.tables.users) {
        await db.insert(users).values(user);
      }

      console.log(\`Restored \${backupData.tables.users.length} users\`);
    }
  } finally {
    await client.end();
  }
}

restoreData().catch(console.error);
`;

      const scriptFile = path.join(process.cwd(), 'temp-restore.js');
      fs.writeFileSync(scriptFile, restoreScript);

      try {
        execSync(`node ${scriptFile}`, { stdio: 'inherit' });
        logSuccess('Data backup restored successfully');
        return true;
      } finally {
        fs.unlinkSync(scriptFile);
      }
    } else {
      // Restore data using Prisma
      const restoreScript = `
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function restoreData() {
  try {
    const backupData = ${JSON.stringify(backupData)};

    if (backupData.tables.users) {
      // Clear existing data
      await prisma.user.deleteMany();

      // Insert backup data
      for (const user of backupData.tables.users) {
        await prisma.user.create({ data: user });
      }

      console.log(\`Restored \${backupData.tables.users.length} users\`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

restoreData().catch(console.error);
`;

      const scriptFile = path.join(process.cwd(), 'temp-restore.js');
      fs.writeFileSync(scriptFile, restoreScript);

      try {
        execSync(`node ${scriptFile}`, { stdio: 'inherit' });
        logSuccess('Data backup restored successfully');
        return true;
      } finally {
        fs.unlinkSync(scriptFile);
      }
    }
  } catch (error) {
    logError(`Data restore failed: ${error.message}`);
    return false;
  }
}

/**
 * List available backups
 */
function listBackups() {
  const backupDir = path.join(process.cwd(), 'backups');

  if (!fs.existsSync(backupDir)) {
    logWarning('No backups directory found');
    return;
  }

  const files = fs
    .readdirSync(backupDir)
    .filter(file => file.endsWith('.sql') || file.endsWith('.json'))
    .sort()
    .reverse();

  if (files.length === 0) {
    logWarning('No backup files found');
    return;
  }

  logInfo('Available backups:');
  files.forEach(file => {
    const filePath = path.join(backupDir, file);
    const stats = fs.statSync(filePath);
    const size = (stats.size / 1024).toFixed(2);
    const date = stats.mtime.toISOString().slice(0, 19);
    log(`  ${file} (${size} KB, ${date})`);
  });
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const operation = args[0];
  const backupFile = args[1];
  const backupType = args[2] || 'full'; // 'full' or 'data'

  if (!operation) {
    logError(
      'Usage: node scripts/db-backup.js <operation> [backup-file] [type]',
    );
    logInfo('Operations:');
    logInfo('  create [filename] [type]  - Create backup (full or data)');
    logInfo('  restore <filename>        - Restore backup');
    logInfo('  list                      - List available backups');
    logInfo('Types:');
    logInfo('  full                      - Full database backup (SQL)');
    logInfo('  data                      - Data-only backup (JSON)');
    process.exit(1);
  }

  try {
    switch (operation) {
      case 'create':
        const backupDir = ensureBackupDirectory();
        const filename = backupFile || generateBackupFilename(backupType);
        const fullPath = path.join(backupDir, filename);

        if (backupType === 'full') {
          const envVars = getEnvVars();
          const dbConfig = parseDatabaseUrl(envVars.DATABASE_URL);
          createPostgresBackup(fullPath, dbConfig);
        } else if (backupType === 'data') {
          createDataBackup(fullPath);
        } else {
          logError(`Unknown backup type: ${backupType}`);
          process.exit(1);
        }
        break;

      case 'restore':
        if (!backupFile) {
          logError('Backup file required for restore');
          process.exit(1);
        }

        const restorePath = path.join(process.cwd(), 'backups', backupFile);
        if (!fs.existsSync(restorePath)) {
          logError(`Backup file not found: ${backupFile}`);
          process.exit(1);
        }

        if (backupFile.endsWith('.sql')) {
          const envVars = getEnvVars();
          const dbConfig = parseDatabaseUrl(envVars.DATABASE_URL);
          restorePostgresBackup(restorePath, dbConfig);
        } else if (backupFile.endsWith('.json')) {
          restoreDataBackup(restorePath);
        } else {
          logError('Unknown backup file format');
          process.exit(1);
        }
        break;

      case 'list':
        listBackups();
        break;

      default:
        logError(`Unknown operation: ${operation}`);
        process.exit(1);
    }
  } catch (error) {
    logError(`Backup operation failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  createPostgresBackup,
  restorePostgresBackup,
  createDataBackup,
  restoreDataBackup,
  listBackups,
};
