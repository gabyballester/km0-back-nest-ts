import { z } from 'zod';

// ========================================
// 🗄️ CONFIGURACIÓN DE BASE DE DATOS
// ========================================

export const ENV_KEYS = {
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  HOST: 'HOST',
  DATABASE_URL: 'DATABASE_URL',
  DATABASE_ORM: 'DATABASE_ORM',
  JWT_SECRET: 'JWT_SECRET',
  JWT_EXPIRES_IN: 'JWT_EXPIRES_IN',
  COOKIE_SECRET: 'COOKIE_SECRET',
  RATE_LIMIT_TTL: 'RATE_LIMIT_TTL',
  RATE_LIMIT_LIMIT: 'RATE_LIMIT_LIMIT',
  THROTTLE_TTL: 'THROTTLE_TTL',
  THROTTLE_LIMIT: 'THROTTLE_LIMIT',
  CORS_ORIGIN: 'CORS_ORIGIN',
  LOG_LEVEL: 'LOG_LEVEL',
  SEED_ENABLED: 'SEED_ENABLED',
  SEED_DATA_PATH: 'SEED_DATA_PATH',
} as const;

export const ENV_VALUES = {
  NODE_ENV: {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test',
  },
  DATABASE_ORM: {
    PRISMA: 'prisma',
  },
  DATABASE_SAFETY_LEVEL: {
    PARANOID: 'paranoid',
    STRICT: 'strict',
    RELAXED: 'relaxed',
    DISABLED: 'disabled',
  },
} as const;

/**
 * Esquema de validación de variables de entorno
 */
export const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),

    PORT: z
      .string()
      .transform(val => parseInt(val, 10))
      .pipe(z.number().min(1).max(65535))
      .default(4000),

    HOST: z.string().default('localhost'),

    DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL').optional(),

    DATABASE_ORM: z.enum(['prisma']).default('prisma'),

    JWT_SECRET: z
      .string()
      .min(32, 'JWT_SECRET must be at least 32 characters long')
      .default('your-super-secret-jwt-key-change-in-production'),

    JWT_EXPIRES_IN: z
      .string()
      .transform(val => parseInt(val, 10))
      .pipe(z.number().min(60).max(86400))
      .default(86400),

    COOKIE_SECRET: z
      .string()
      .min(32, 'COOKIE_SECRET must be at least 32 characters long')
      .default('your-super-secret-cookie-key-change-in-production'),

    RATE_LIMIT_TTL: z
      .string()
      .transform(val => parseInt(val, 10))
      .pipe(z.number().min(1).max(3600))
      .default(60),

    RATE_LIMIT_LIMIT: z
      .string()
      .transform(val => parseInt(val, 10))
      .pipe(z.number().min(1).max(10000))
      .default(100),

    THROTTLE_TTL: z
      .string()
      .transform(val => parseInt(val, 10))
      .pipe(z.number().min(1).max(3600))
      .default(60),

    THROTTLE_LIMIT: z
      .string()
      .transform(val => parseInt(val, 10))
      .pipe(z.number().min(1).max(10000))
      .default(100),

    CORS_ORIGIN: z
      .string()
      .url('CORS_ORIGIN must be a valid URL')
      .default('http://localhost:3000'),

    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

    SEED_ENABLED: z
      .string()
      .transform(val => val === 'true')
      .pipe(z.boolean())
      .default(false),

    SEED_DATA_PATH: z.string().default('./data/seed-dev.json'),
  })
  .partial()
  .passthrough();

/**
 * Tipo de configuración de entorno validada
 */
export type EnvConfig = z.infer<typeof envSchema>;
