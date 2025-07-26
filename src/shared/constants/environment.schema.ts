import { z } from 'zod';

// Definir las constantes directamente aquí para evitar dependencia circular
const ENV_KEYS = {
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  HOST: 'HOST',
  JWT_SECRET: 'JWT_SECRET',
  JWT_EXPIRES_IN: 'JWT_EXPIRES_IN',
  COOKIE_SECRET: 'COOKIE_SECRET',
  DATABASE_URL: 'DATABASE_URL',
  THROTTLE_TTL: 'THROTTLE_TTL',
  THROTTLE_LIMIT: 'THROTTLE_LIMIT',
  CORS_ORIGIN: 'CORS_ORIGIN',
  LOG_LEVEL: 'LOG_LEVEL',
} as const;

const ENV_VALUES = {
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

const CONFIG_KEYS = {
  ENV_NODE_ENV: 'env.nodeEnv',
  ENV_PORT: 'env.port',
  ENV_HOST: 'env.host',
  DATABASE_URL: 'database.url',
  JWT_SECRET: 'jwt.secret',
  JWT_EXPIRES_IN: 'jwt.expiresIn',
  THROTTLE_TTL: 'throttle.ttl',
  THROTTLE_LIMIT: 'throttle.limit',
  CORS_ORIGIN: 'cors.origin',
  LOG_LEVEL: 'log.level',
} as const;

/**
 * Schema for environment variable keys validation
 * Ensures all environment keys are valid strings
 */
export const envKeysSchema = z
  .object({
    // Server Configuration
    NODE_ENV: z.literal(ENV_KEYS.NODE_ENV),
    PORT: z.literal(ENV_KEYS.PORT),
    HOST: z.literal(ENV_KEYS.HOST),

    // Security
    JWT_SECRET: z.literal(ENV_KEYS.JWT_SECRET),
    JWT_EXPIRES_IN: z.literal(ENV_KEYS.JWT_EXPIRES_IN),
    COOKIE_SECRET: z.literal(ENV_KEYS.COOKIE_SECRET),

    // Database
    DATABASE_URL: z.literal(ENV_KEYS.DATABASE_URL),

    // Rate Limiting
    THROTTLE_TTL: z.literal(ENV_KEYS.THROTTLE_TTL),
    THROTTLE_LIMIT: z.literal(ENV_KEYS.THROTTLE_LIMIT),

    // CORS
    CORS_ORIGIN: z.literal(ENV_KEYS.CORS_ORIGIN),

    // Logging
    LOG_LEVEL: z.literal(ENV_KEYS.LOG_LEVEL),
  })
  .strict(); // Reject unknown properties

/**
 * Schema for environment values validation
 * Ensures all environment values are valid
 */
export const envValuesSchema = z
  .object({
    NODE_ENV: z.object({
      DEVELOPMENT: z.literal(ENV_VALUES.NODE_ENV.DEVELOPMENT),
      PRODUCTION: z.literal(ENV_VALUES.NODE_ENV.PRODUCTION),
      TEST: z.literal(ENV_VALUES.NODE_ENV.TEST),
    }),
    LOG_LEVEL: z.object({
      ERROR: z.literal(ENV_VALUES.LOG_LEVEL.ERROR),
      WARN: z.literal(ENV_VALUES.LOG_LEVEL.WARN),
      INFO: z.literal(ENV_VALUES.LOG_LEVEL.INFO),
      DEBUG: z.literal(ENV_VALUES.LOG_LEVEL.DEBUG),
    }),
  })
  .strict(); // Reject unknown properties

/**
 * Schema for configuration keys validation
 * Ensures all ConfigService keys are valid
 */
export const configKeysSchema = z
  .object({
    // Environment configuration
    ENV_NODE_ENV: z.literal(CONFIG_KEYS.ENV_NODE_ENV),
    ENV_PORT: z.literal(CONFIG_KEYS.ENV_PORT),
    ENV_HOST: z.literal(CONFIG_KEYS.ENV_HOST),

    // Database configuration
    DATABASE_URL: z.literal(CONFIG_KEYS.DATABASE_URL),

    // Security configuration
    JWT_SECRET: z.literal(CONFIG_KEYS.JWT_SECRET),
    JWT_EXPIRES_IN: z.literal(CONFIG_KEYS.JWT_EXPIRES_IN),

    // Rate limiting configuration
    THROTTLE_TTL: z.literal(CONFIG_KEYS.THROTTLE_TTL),
    THROTTLE_LIMIT: z.literal(CONFIG_KEYS.THROTTLE_LIMIT),

    // CORS configuration
    CORS_ORIGIN: z.literal(CONFIG_KEYS.CORS_ORIGIN),

    // Logging configuration
    LOG_LEVEL: z.literal(CONFIG_KEYS.LOG_LEVEL),
  })
  .strict(); // Reject unknown properties

/**
 * Schema for Node.js environment validation
 * Validates environment strings at runtime
 */
export const nodeEnvSchema = z.enum([
  ENV_VALUES.NODE_ENV.DEVELOPMENT,
  ENV_VALUES.NODE_ENV.PRODUCTION,
  ENV_VALUES.NODE_ENV.TEST,
]);

/**
 * Schema for log level validation
 * Validates log level strings at runtime
 */
export const logLevelSchema = z.enum([
  ENV_VALUES.LOG_LEVEL.ERROR,
  ENV_VALUES.LOG_LEVEL.WARN,
  ENV_VALUES.LOG_LEVEL.INFO,
  ENV_VALUES.LOG_LEVEL.DEBUG,
]);

/**
 * Schema for dangerous commands validation
 * Ensures dangerous commands are properly identified
 */
export const dangerousCommandsSchema = z.array(z.string()).refine(
  commands => {
    const requiredCommands = [
      'prisma migrate dev',
      'prisma migrate reset',
      'prisma db push --force-reset',
      'prisma db push --accept-data-loss',
    ];
    return requiredCommands.every(cmd => commands.includes(cmd));
  },
  {
    message: 'All required dangerous commands must be included',
  },
);

/**
 * Validation functions for runtime checks
 */
export const validateEnvironment = {
  /**
   * Validate environment variable key
   */
  envKey: (key: string): key is keyof typeof ENV_KEYS => {
    return Object.values(ENV_KEYS).includes(key as keyof typeof ENV_KEYS);
  },

  /**
   * Validate environment value
   */
  envValue: (
    value: string,
  ): value is (typeof ENV_VALUES.NODE_ENV)[keyof typeof ENV_VALUES.NODE_ENV] => {
    return Object.values(ENV_VALUES.NODE_ENV).includes(
      value as (typeof ENV_VALUES.NODE_ENV)[keyof typeof ENV_VALUES.NODE_ENV],
    );
  },

  /**
   * Validate configuration key
   */
  configKey: (key: string): key is keyof typeof CONFIG_KEYS => {
    return Object.values(CONFIG_KEYS).includes(
      key as (typeof CONFIG_KEYS)[keyof typeof CONFIG_KEYS],
    );
  },

  /**
   * Validate Node.js environment
   */
  nodeEnv: (
    env: string,
  ): env is (typeof ENV_VALUES.NODE_ENV)[keyof typeof ENV_VALUES.NODE_ENV] => {
    return nodeEnvSchema.safeParse(env).success;
  },

  /**
   * Validate log level
   */
  logLevel: (
    level: string,
  ): level is (typeof ENV_VALUES.LOG_LEVEL)[keyof typeof ENV_VALUES.LOG_LEVEL] => {
    return logLevelSchema.safeParse(level).success;
  },
};

/**
 * Type exports for use in other modules
 */
export type ValidatedEnvKeys = z.infer<typeof envKeysSchema>;
export type ValidatedEnvValues = z.infer<typeof envValuesSchema>;
export type ValidatedConfigKeys = z.infer<typeof configKeysSchema>;
export type ValidatedNodeEnv = z.infer<typeof nodeEnvSchema>;
export type ValidatedLogLevel = z.infer<typeof logLevelSchema>;
