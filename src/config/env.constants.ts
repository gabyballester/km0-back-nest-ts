/**
 * Environment variable constants
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
 * Default values for environment variables
 */
export const ENV_DEFAULTS = {
  [ENV_KEYS.NODE_ENV]: 'development',
  [ENV_KEYS.PORT]: '4000',
  [ENV_KEYS.HOST]: 'localhost',
  [ENV_KEYS.JWT_EXPIRES_IN]: '1d',
  [ENV_KEYS.THROTTLE_TTL]: '60',
  [ENV_KEYS.THROTTLE_LIMIT]: '100',
  [ENV_KEYS.CORS_ORIGIN]: 'http://localhost:3000',
  [ENV_KEYS.LOG_LEVEL]: 'info',
} as const;

/**
 * Environment types
 */
export type EnvKey = keyof typeof ENV_KEYS;
export type EnvValue = string | number | boolean;
