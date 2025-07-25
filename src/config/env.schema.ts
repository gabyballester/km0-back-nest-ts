import { z } from 'zod';
import { ENV_KEYS, ENV_VALUES } from '../shared/constants/environment';

/**
 * Environment variables validation schema using Zod
 * Ensures type safety and validation for all environment variables
 */
export const envSchema = z.object({
  // Server Configuration
  [ENV_KEYS.NODE_ENV]: z
    .enum([
      ENV_VALUES.NODE_ENV.DEVELOPMENT,
      ENV_VALUES.NODE_ENV.PRODUCTION,
      ENV_VALUES.NODE_ENV.TEST,
    ])
    .default(ENV_VALUES.NODE_ENV.DEVELOPMENT),
  [ENV_KEYS.PORT]: z
    .string()
    .transform(val => parseInt(val, 10))
    .pipe(z.number().min(1).max(65535))
    .default(4000),
  [ENV_KEYS.HOST]: z.string().default('localhost'),

  // Security
  [ENV_KEYS.JWT_SECRET]: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters'),
  [ENV_KEYS.JWT_EXPIRES_IN]: z.string().default('1d'),
  [ENV_KEYS.COOKIE_SECRET]: z
    .string()
    .min(32, 'COOKIE_SECRET must be at least 32 characters'),

  // Database
  [ENV_KEYS.DATABASE_URL]: z
    .string()
    .url('DATABASE_URL must be a valid URL')
    .optional(),

  // Rate Limiting
  [ENV_KEYS.THROTTLE_TTL]: z
    .string()
    .transform(val => parseInt(val, 10))
    .pipe(z.number().min(1).max(3600))
    .default(60),
  [ENV_KEYS.THROTTLE_LIMIT]: z
    .string()
    .transform(val => parseInt(val, 10))
    .pipe(z.number().min(1).max(10000))
    .default(100),

  // CORS
  [ENV_KEYS.CORS_ORIGIN]: z.string().url().default('http://localhost:3000'),

  // Logging
  [ENV_KEYS.LOG_LEVEL]: z
    .enum([
      ENV_VALUES.LOG_LEVEL.ERROR,
      ENV_VALUES.LOG_LEVEL.WARN,
      ENV_VALUES.LOG_LEVEL.INFO,
      ENV_VALUES.LOG_LEVEL.DEBUG,
    ])
    .default(ENV_VALUES.LOG_LEVEL.INFO),
});

/**
 * Type for validated environment variables
 */
export type EnvConfig = z.infer<typeof envSchema>;
