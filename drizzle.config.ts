import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// Load environment variables
config();

export default defineConfig({
  schema: './src/infrastructure/database/schemas/*.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
  // Customize migration naming
  migrations: {
    table: 'drizzle_migrations',
    schema: 'public',
  },
});
