import { registerAs } from '@nestjs/config';
import { envSchema, type EnvConfig } from './env.schema';

/**
 * Environment configuration for NestJS
 * Uses Zod validation to ensure type safety and validation
 */
export const envConfig = registerAs('env', (): EnvConfig => {
  // In development and tests, allow process.env access
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Environment validation failed:');
    console.error(result.error.format());
    process.exit(1);
  }

  return result.data;
});

/**
 * Helper functions to get environment values with type safety
 */
export const getEnv = (): EnvConfig => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(`Environment validation failed: ${result.error.message}`);
  }
  return result.data;
};
