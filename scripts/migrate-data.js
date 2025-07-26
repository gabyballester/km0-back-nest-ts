#!/usr/bin/env node

/**
 * Data Migration Script
 * Migrates data between Prisma and Drizzle ORMs
 * Useful for switching between ORMs or backing up data
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
 * Export data from Prisma
 */
async function exportFromPrisma(outputFile) {
  logInfo('Exporting data from Prisma...');

  try {
    // Create export script
    const exportScript = `
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function exportData() {
  try {
    console.log('📤 Exporting data from Prisma...');

    // Export users
    const users = await prisma.user.findMany();
    console.log(\`Found \${users.length} users\`);

    // Create export object
    const exportData = {
      timestamp: new Date().toISOString(),
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    };

    // Write to file
    fs.writeFileSync('${outputFile}', JSON.stringify(exportData, null, 2));
    console.log('✅ Data exported successfully');

  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
`;

    // Write and execute export script
    const scriptFile = path.join(process.cwd(), 'temp-export.js');
    fs.writeFileSync(scriptFile, exportScript);

    execSync(`node ${scriptFile}`, { stdio: 'inherit' });

    // Clean up
    fs.unlinkSync(scriptFile);

    logSuccess('Data exported from Prisma successfully');
    return true;
  } catch (error) {
    logError(`Prisma export failed: ${error.message}`);
    return false;
  }
}

/**
 * Import data to Drizzle
 */
async function importToDrizzle(inputFile) {
  logInfo('Importing data to Drizzle...');

  try {
    // Read exported data
    const exportData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    // Create import script
    const importScript = `
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { users } = require('../src/infrastructure/database/schemas/user.schema');

// Load environment variables
require('dotenv').config();

async function importData() {
  console.log('📥 Importing data to Drizzle...');

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }

  const client = postgres(connectionString);
  const db = drizzle(client);

  try {
    const exportData = ${JSON.stringify(exportData)};

    // Import users
    if (exportData.users && exportData.users.length > 0) {
      console.log(\`Importing \${exportData.users.length} users...\`);

      for (const userData of exportData.users) {
        try {
          await db.insert(users).values(userData);
          console.log(\`✅ Imported user: \${userData.email}\`);
        } catch (error) {
          if (error.code === '23505') { // Unique constraint violation
            console.log(\`⚠️  User already exists: \${userData.email}\`);
          } else {
            console.error(\`❌ Failed to import user \${userData.email}:\`, error.message);
          }
        }
      }
    }

    console.log('✅ Data import completed');

  } finally {
    await client.end();
  }
}

importData().catch(console.error);
`;

    // Write and execute import script
    const scriptFile = path.join(process.cwd(), 'temp-import.js');
    fs.writeFileSync(scriptFile, importScript);

    execSync(`node ${scriptFile}`, { stdio: 'inherit' });

    // Clean up
    fs.unlinkSync(scriptFile);

    logSuccess('Data imported to Drizzle successfully');
    return true;
  } catch (error) {
    logError(`Drizzle import failed: ${error.message}`);
    return false;
  }
}

/**
 * Backup current data
 */
async function backupData(backupFile) {
  logInfo('Creating data backup...');

  const ormType = getOrmType();

  if (ormType === 'prisma') {
    return await exportFromPrisma(backupFile);
  } else {
    logWarning('Backup from Drizzle not implemented yet');
    logInfo('Please use the database export tools directly');
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const operation = args[0];
  const sourceFile = args[1];
  const targetFile = args[2];

  if (!operation) {
    logError(
      'Usage: node scripts/migrate-data.js <operation> [source] [target]',
    );
    logInfo('Operations:');
    logInfo('  export-prisma <output-file>     - Export data from Prisma');
    logInfo('  import-drizzle <input-file>     - Import data to Drizzle');
    logInfo(
      '  migrate-prisma-to-drizzle       - Full migration from Prisma to Drizzle',
    );
    logInfo('  backup <backup-file>            - Backup current data');
    process.exit(1);
  }

  try {
    switch (operation) {
      case 'export-prisma':
        if (!sourceFile) {
          logError('Output file required for export');
          process.exit(1);
        }
        await exportFromPrisma(sourceFile);
        break;

      case 'import-drizzle':
        if (!sourceFile) {
          logError('Input file required for import');
          process.exit(1);
        }
        await importToDrizzle(sourceFile);
        break;

      case 'migrate-prisma-to-drizzle':
        logInfo('🔄 Starting migration from Prisma to Drizzle...');

        // Set temporary environment to use Prisma for export
        const originalOrm = process.env.DATABASE_ORM;
        process.env.DATABASE_ORM = 'prisma';

        const tempFile = path.join(process.cwd(), 'temp-migration.json');

        try {
          // Export from Prisma
          if (await exportFromPrisma(tempFile)) {
            // Restore original ORM setting
            process.env.DATABASE_ORM = originalOrm;

            // Import to Drizzle
            if (await importToDrizzle(tempFile)) {
              logSuccess('🎉 Migration completed successfully!');
            } else {
              logError('Migration failed during import to Drizzle');
            }
          } else {
            logError('Migration failed during export from Prisma');
          }
        } finally {
          // Clean up temp file
          if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
          }
        }
        break;

      case 'backup':
        if (!sourceFile) {
          logError('Backup file required');
          process.exit(1);
        }
        await backupData(sourceFile);
        break;

      default:
        logError(`Unknown operation: ${operation}`);
        process.exit(1);
    }
  } catch (error) {
    logError(`Migration failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { exportFromPrisma, importToDrizzle, backupData };
