/**
 * Environment constants for the application
 * Centralized configuration values
 */

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
  LOG_LEVEL: {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
  },
} as const;

/**
 * Database naming convention constants
 * Ensures environment-specific database names for safety
 */
export const DATABASE_NAMES = {
  [ENV_VALUES.NODE_ENV.PRODUCTION]: 'km0_db',
  [ENV_VALUES.NODE_ENV.DEVELOPMENT]: 'km0_db_dev',
  [ENV_VALUES.NODE_ENV.TEST]: 'km0_db_test',
} as const;

/**
 * Default environment values
 */
export const DEFAULT_ENV_VALUES = {
  [ENV_KEYS.NODE_ENV]: ENV_VALUES.NODE_ENV.DEVELOPMENT,
  [ENV_KEYS.PORT]: 4000,
  [ENV_KEYS.HOST]: 'localhost',
  [ENV_KEYS.DATABASE_ORM]: ENV_VALUES.DATABASE_ORM.PRISMA,
  [ENV_KEYS.JWT_EXPIRES_IN]: 86400,
  [ENV_KEYS.RATE_LIMIT_TTL]: 60,
  [ENV_KEYS.RATE_LIMIT_LIMIT]: 100,
  [ENV_KEYS.THROTTLE_TTL]: 60,
  [ENV_KEYS.THROTTLE_LIMIT]: 100,
  [ENV_KEYS.CORS_ORIGIN]: 'http://localhost:3000',
  [ENV_KEYS.LOG_LEVEL]: ENV_VALUES.LOG_LEVEL.INFO,
  [ENV_KEYS.SEED_ENABLED]: false,
  [ENV_KEYS.SEED_DATA_PATH]: './data/seed-dev.json',
} as const;

/**
 * Helper functions for environment validation
 */
export const isDevelopment = (
  env: string,
): env is typeof ENV_VALUES.NODE_ENV.DEVELOPMENT => {
  return env === ENV_VALUES.NODE_ENV.DEVELOPMENT;
};

export const isProduction = (
  env: string,
): env is typeof ENV_VALUES.NODE_ENV.PRODUCTION => {
  return env === ENV_VALUES.NODE_ENV.PRODUCTION;
};

export const isTest = (env: string): env is typeof ENV_VALUES.NODE_ENV.TEST => {
  return env === ENV_VALUES.NODE_ENV.TEST;
};

/**
 * Checks if the provided environment is a valid NODE_ENV value.
 * @param env - The environment string to validate.
 * @returns true if env is a valid NODE_ENV, false otherwise.
 */
export const isValidNodeEnv = (
  env: unknown,
): env is (typeof ENV_VALUES.NODE_ENV)[keyof typeof ENV_VALUES.NODE_ENV] => {
  return (
    typeof env === 'string' &&
    (env === ENV_VALUES.NODE_ENV.DEVELOPMENT ||
      env === ENV_VALUES.NODE_ENV.PRODUCTION ||
      env === ENV_VALUES.NODE_ENV.TEST)
  );
};

// Los schemas se importan directamente desde environment.schema.ts
// para evitar dependencias circulares
