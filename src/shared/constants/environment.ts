/**
 * Environment-related constants
 * Centralized constants for environment variables and values
 */

/**
 * Environment variable keys
 * Centralized keys for environment variables to avoid typos and ensure consistency
 */
export const ENV_KEYS = {
  // Server Configuration
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  HOST: 'HOST',

  // Security
  JWT_SECRET: 'JWT_SECRET',
  JWT_EXPIRES_IN: 'JWT_EXPIRES_IN',
  COOKIE_SECRET: 'COOKIE_SECRET',

  // Database
  DATABASE_URL: 'DATABASE_URL',

  // Rate Limiting
  THROTTLE_TTL: 'THROTTLE_TTL',
  THROTTLE_LIMIT: 'THROTTLE_LIMIT',

  // CORS
  CORS_ORIGIN: 'CORS_ORIGIN',

  // Logging
  LOG_LEVEL: 'LOG_LEVEL',
} as const;

/**
 * Environment values constants
 * Typed constants for environment values to ensure consistency
 */
export const ENV_VALUES = {
  NODE_ENV: {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test',
  },
  LOG_LEVEL: {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
  },
} as const;

/**
 * Type definitions for environment values
 */
export type NodeEnv =
  (typeof ENV_VALUES.NODE_ENV)[keyof typeof ENV_VALUES.NODE_ENV];
export type LogLevel =
  (typeof ENV_VALUES.LOG_LEVEL)[keyof typeof ENV_VALUES.LOG_LEVEL];

/**
 * Default values for environment variables
 */
export const ENV_DEFAULTS = {
  [ENV_KEYS.NODE_ENV]: ENV_VALUES.NODE_ENV.DEVELOPMENT,
  [ENV_KEYS.PORT]: '4000',
  [ENV_KEYS.HOST]: 'localhost',
  [ENV_KEYS.JWT_EXPIRES_IN]: '1d',
  [ENV_KEYS.THROTTLE_TTL]: '60',
  [ENV_KEYS.THROTTLE_LIMIT]: '100',
  [ENV_KEYS.CORS_ORIGIN]: 'http://localhost:3000',
  [ENV_KEYS.LOG_LEVEL]: ENV_VALUES.LOG_LEVEL.INFO,
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

export const isValidNodeEnv = (env: string): env is NodeEnv => {
  return Object.values(ENV_VALUES.NODE_ENV).includes(env as NodeEnv);
};
