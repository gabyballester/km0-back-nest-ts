#!/usr/bin/env node

/**
 * Database Setup Script
 * Automatically detects and configures database environment
 * Creates necessary files and validates setup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Import environment constants
const { ENV_KEYS } = require('../src/shared/constants/environment');

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
 * Check if file exists
 */
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Create directory if it doesn't exist
 */
function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    logSuccess(`Created directory: ${dirPath}`);
  }
}

/**
 * Setup Drizzle configuration
 */
function setupDrizzle() {
  logInfo('Setting up Drizzle configuration...');

  // Create drizzle directory
  ensureDirectory('drizzle');

  // Check if drizzle.config.ts exists
  if (!fileExists('drizzle.config.ts')) {
    logWarning('drizzle.config.ts not found, creating...');

    const configContent = `import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// Load environment variables
config();

export default defineConfig({
  schema: './src/infrastructure/database/schemas/*.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env[ENV_KEYS.DATABASE_URL] || '',
  },
  verbose: true,
  strict: true,
  driver: 'pg',
  migrations: {
    table: 'drizzle_migrations',
    schema: 'public',
  },
});
`;

    fs.writeFileSync('drizzle.config.ts', configContent);
    logSuccess('Created drizzle.config.ts');
  }

  // Check if schemas directory exists
  const schemasDir = 'src/infrastructure/database/schemas';
  ensureDirectory(schemasDir);

  // Check if user schema exists
  const userSchemaPath = path.join(schemasDir, 'user.schema.ts');
  if (!fileExists(userSchemaPath)) {
    logWarning('user.schema.ts not found, creating...');

    const userSchemaContent = `import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
`;

    fs.writeFileSync(userSchemaPath, userSchemaContent);
    logSuccess('Created user.schema.ts');
  }
}

/**
 * Setup Prisma configuration
 */
function setupPrisma() {
  logInfo('Setting up Prisma configuration...');

  // Create prisma directory
  ensureDirectory('prisma');

  // Check if schema.prisma exists
  if (!fileExists('prisma/schema.prisma')) {
    logWarning('prisma/schema.prisma not found, creating...');

    const schemaContent = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}
`;

    fs.writeFileSync('prisma/schema.prisma', schemaContent);
    logSuccess('Created prisma/schema.prisma');
  }

  // Create migrations directory
  ensureDirectory('prisma/migrations');
}

/**
 * Setup environment files
 */
function setupEnvironment() {
  logInfo('Setting up environment files...');

  const envFiles = [
    { name: '.env.development', example: 'env.development.example' },
    { name: '.env.test', example: 'env.test.example' },
    { name: '.env', example: 'env.example' },
  ];

  envFiles.forEach(({ name, example }) => {
    if (!fileExists(name) && fileExists(example)) {
      logWarning(`${name} not found, copying from ${example}...`);
      fs.copyFileSync(example, name);
      logSuccess(`Created ${name}`);
    } else if (!fileExists(name) && !fileExists(example)) {
      logWarning(`${name} and ${example} not found, creating basic ${name}...`);

      const basicEnvContent = `# ${name.toUpperCase()} Configuration
NODE_ENV=${name.includes('test') ? 'test' : name.includes('development') ? 'development' : 'production'}
PORT=${name.includes('test') ? '4001' : '4000'}
HOST=localhost

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/km0_${name.includes('test') ? 'test' : name.includes('development') ? 'dev' : 'prod'}
DATABASE_ORM=drizzle

# Security (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
COOKIE_SECRET=your-super-secret-cookie-key-at-least-32-characters-long
JWT_EXPIRES_IN=${name.includes('test') ? '1h' : name.includes('development') ? '7d' : '1d'}

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=${name.includes('test') ? '10000' : '100'}

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=${name.includes('test') ? 'error' : name.includes('development') ? 'debug' : 'info'}

# Development specific
SEED_ENABLED=true
SEED_DATA_PATH=./data/seed-${name.includes('test') ? 'test' : name.includes('development') ? 'dev' : 'prod'}.json
`;

      fs.writeFileSync(name, basicEnvContent);
      logSuccess(`Created ${name}`);
    }
  });
}

/**
 * Setup data directory and seed files
 */
function setupData() {
  logInfo('Setting up data directory and seed files...');

  // Create data directory
  ensureDirectory('data');

  // Create seed files if they don't exist
  const seedFiles = [
    {
      name: 'data/seed-dev.json',
      content: {
        users: [
          {
            email: 'admin@km0.dev',
            password: 'hashed_admin_password_dev',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
          {
            email: 'user@km0.dev',
            password: 'hashed_user_password_dev',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      },
    },
    {
      name: 'data/seed-test.json',
      content: {
        users: [
          {
            email: 'test@km0.test',
            password: 'hashed_test_password',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      },
    },
  ];

  seedFiles.forEach(({ name, content }) => {
    if (!fileExists(name)) {
      logWarning(`${name} not found, creating...`);
      fs.writeFileSync(name, JSON.stringify(content, null, 2));
      logSuccess(`Created ${name}`);
    }
  });
}

/**
 * Validate setup
 */
function validateSetup() {
  logInfo('Validating setup...');

  const requiredFiles = [
    'drizzle.config.ts',
    'src/infrastructure/database/schemas/user.schema.ts',
    'prisma/schema.prisma',
    '.env.development',
    '.env.test',
    'data/seed-dev.json',
    'data/seed-test.json',
  ];

  let allValid = true;

  requiredFiles.forEach(file => {
    if (fileExists(file)) {
      logSuccess(`✓ ${file}`);
    } else {
      logError(`✗ ${file} - Missing`);
      allValid = false;
    }
  });

  return allValid;
}

/**
 * Generate initial migration
 */
function generateInitialMigration() {
  logInfo('Generating initial migration...');

  try {
    // Try Drizzle first
    execSync('npx drizzle-kit generate', { stdio: 'pipe' });
    logSuccess('Generated Drizzle migration');
  } catch (error) {
    logWarning('Drizzle migration failed, trying Prisma...');
    try {
      execSync('npx prisma migrate dev --name init', { stdio: 'pipe' });
      logSuccess('Generated Prisma migration');
    } catch (prismaError) {
      logWarning(
        'Both migrations failed, you may need to configure DATABASE_URL',
      );
    }
  }
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const skipValidation = args.includes('--skip-validation');
  const skipMigration = args.includes('--skip-migration');

  log('🚀 Database Setup Script', 'bright');
  log('========================', 'bright');

  try {
    // Setup configurations
    setupDrizzle();
    setupPrisma();
    setupEnvironment();
    setupData();

    // Validate setup
    if (!skipValidation) {
      if (validateSetup()) {
        logSuccess('🎉 Setup validation passed!');
      } else {
        logError('❌ Setup validation failed!');
        process.exit(1);
      }
    }

    // Generate initial migration
    if (!skipMigration) {
      generateInitialMigration();
    }

    logSuccess('🎉 Database setup completed successfully!');
    logInfo('Next steps:');
    logInfo('1. Update your .env files with correct DATABASE_URL');
    logInfo('2. Run: npm run db:validate:dev');
    logInfo('3. Run: npm run db:dev');
    logInfo('4. Run: npm run db:seed:dev');
  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  setupDrizzle,
  setupPrisma,
  setupEnvironment,
  setupData,
  validateSetup,
};
