#!/usr/bin/env node

/**
 * Database Seeder Script
 * Works with both Prisma and Drizzle ORMs
 * Automatically detects the configured ORM and seeds accordingly
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
 * Seed data for Prisma
 */
async function seedPrisma() {
  logInfo('Seeding database with Prisma...');

  try {
    // Check if prisma/seed.js exists
    const seedFile = path.join(process.cwd(), 'prisma', 'seed.js');
    if (fs.existsSync(seedFile)) {
      logInfo('Found prisma/seed.js, executing...');
      execSync('npx prisma db seed', { stdio: 'inherit' });
    } else {
      logWarning('No prisma/seed.js found. Creating sample seed data...');

      // Create sample seed data
      const sampleSeed = `
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample user
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: 'hashed_password_here', // In production, use proper hashing
    },
  });

  console.log('✅ Sample user created:', user.email);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;

      // Write sample seed file
      fs.writeFileSync(seedFile, sampleSeed);
      logSuccess('Created sample prisma/seed.js');

      // Execute the seed
      execSync('npx prisma db seed', { stdio: 'inherit' });
    }

    logSuccess('Prisma seeding completed successfully');
  } catch (error) {
    logError(`Prisma seeding failed: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Seed data for Drizzle
 */
async function seedDrizzle() {
  logInfo('Seeding database with Drizzle...');

  try {
    // Check if drizzle/seed.js exists
    const seedFile = path.join(process.cwd(), 'drizzle', 'seed.js');
    if (fs.existsSync(seedFile)) {
      logInfo('Found drizzle/seed.js, executing...');
      execSync('node drizzle/seed.js', { stdio: 'inherit' });
    } else {
      logWarning('No drizzle/seed.js found. Creating sample seed data...');

      // Create drizzle directory if it doesn't exist
      const drizzleDir = path.join(process.cwd(), 'drizzle');
      if (!fs.existsSync(drizzleDir)) {
        fs.mkdirSync(drizzleDir, { recursive: true });
      }

      // Create sample seed data for Drizzle
      const sampleSeed = `
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { users } = require('../src/infrastructure/database/schemas/user.schema');
const { ENV_KEYS } = require('../src/shared/constants/environment');

// Load environment variables
require('dotenv').config();

async function main() {
  console.log('🌱 Seeding database with Drizzle...');

  const connectionString = process.env[ENV_KEYS.DATABASE_URL];
  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }

  const client = postgres(connectionString);
  const db = drizzle(client);

  try {
    // Create sample user
    const newUser = {
      email: 'admin@example.com',
      password: 'hashed_password_here', // In production, use proper hashing
    };

    const [user] = await db.insert(users).values(newUser).returning();

    console.log('✅ Sample user created:', user.email);
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      console.log('ℹ️  User already exists, skipping...');
    } else {
      throw error;
    }
  } finally {
    await client.end();
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  });
`;

      // Write sample seed file
      fs.writeFileSync(seedFile, sampleSeed);
      logSuccess('Created sample drizzle/seed.js');

      // Execute the seed
      execSync('node drizzle/seed.js', { stdio: 'inherit' });
    }

    logSuccess('Drizzle seeding completed successfully');
  } catch (error) {
    logError(`Drizzle seeding failed: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const environment = args[0] || '';

  logInfo('🌱 Database Seeder');
  logInfo(`Environment: ${environment || 'current'}`);

  const ormType = getOrmType();
  logInfo(`Using ORM: ${ormType.toUpperCase()}`);

  // Set environment if specified
  if (environment) {
    process.env.NODE_ENV = environment;
  }

  try {
    if (ormType === 'prisma') {
      await seedPrisma();
    } else {
      await seedDrizzle();
    }

    logSuccess('🎉 Seeding completed successfully!');
  } catch (error) {
    logError(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { seedPrisma, seedDrizzle };
