import { registerAs } from '@nestjs/config';
import { ENV_KEYS, ENV_VALUES } from '@/shared/constants/environment';

/**
 * Environment configuration
 * Provides typed environment variables with validation
 */
export const envConfig = registerAs('env', () => ({
  nodeEnv: process.env[ENV_KEYS.NODE_ENV] ?? ENV_VALUES.NODE_ENV.DEVELOPMENT,
  port: parseInt(process.env[ENV_KEYS.PORT] ?? '4000', 10) || 4000,
  host: process.env[ENV_KEYS.HOST] ?? 'localhost',
  databaseUrl: process.env[ENV_KEYS.DATABASE_URL],
  databaseOrm:
    process.env[ENV_KEYS.DATABASE_ORM] ?? ENV_VALUES.DATABASE_ORM.PRISMA,
  jwtSecret: process.env[ENV_KEYS.JWT_SECRET],
  jwtExpiresIn: process.env[ENV_KEYS.JWT_EXPIRES_IN] ?? '86400',
  cookieSecret: process.env[ENV_KEYS.COOKIE_SECRET],
  throttleTtl: parseInt(process.env[ENV_KEYS.THROTTLE_TTL] ?? '60', 10) || 60,
  throttleLimit:
    parseInt(process.env[ENV_KEYS.THROTTLE_LIMIT] ?? '100', 10) || 100,
  corsOrigin: process.env[ENV_KEYS.CORS_ORIGIN] ?? 'http://localhost:3000',
  logLevel: process.env[ENV_KEYS.LOG_LEVEL] ?? ENV_VALUES.LOG_LEVEL.INFO,
}));
