import { registerAs } from '@nestjs/config';
import { z } from 'zod';
import { ENV_KEYS, ENV_VALUES } from '@/shared/constants/environment';

// Schema de validación para variables de entorno
const envSchema = z.object({
  // Server Configuration
  NODE_ENV: z
    .enum(ENV_VALUES.NODE_ENV)
    .default(ENV_VALUES.NODE_ENV.DEVELOPMENT),
  PORT: z
    .string()
    .transform(val => parseInt(val, 10))
    .default(4000),
  HOST: z.string().default('localhost'),

  // Database Configuration
  DATABASE_URL: z.url(),
  DATABASE_ORM: z
    .nativeEnum(ENV_VALUES.DATABASE_ORM)
    .default(ENV_VALUES.DATABASE_ORM.DRIZZLE),

  // Seed Configuration
  SEED_ENABLED: z
    .string()
    .default('false')
    .transform(val => val === 'true'),
  SEED_DATA_PATH: z.string().default('./data/seed.json'),
  // Security Configuration
  JWT_SECRET: z.string().min(32),
  COOKIE_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('1d'),

  // Rate Limiting
  THROTTLE_TTL: z
    .string()
    .transform(val => parseInt(val, 10))
    .default(60),
  THROTTLE_LIMIT: z
    .string()
    .transform(val => parseInt(val, 10))
    .default(100),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  // Logging
  LOG_LEVEL: z.string().default('info'),
});

// Función para validar y obtener variables de entorno
export const validateEnv = () => {
  try {
    // Usar process.env que incluye las variables de cross-env
    const env = envSchema.parse(process.env);

    // Log de configuración del entorno
    console.log(`🚀 ========================================`);
    console.log(`🌍 Environment: ${env.NODE_ENV.toUpperCase()}`);
    console.log(`🔧 Port: ${env.PORT}`);
    console.log(`🏠 Host: ${env.HOST}`);
    console.log(`📅 Started at: ${new Date().toISOString()}`);
    console.log(`========================================`);

    return env;
  } catch (error) {
    console.error('❌ Error de validación de variables de entorno:', error);
    process.exit(1);
  }
};

// Configuración del módulo de entorno
export const envConfig = registerAs('env', () => {
  const env = validateEnv();

  return {
    // Server
    [ENV_KEYS.NODE_ENV]: env.NODE_ENV,
    [ENV_KEYS.PORT]: env.PORT,
    [ENV_KEYS.HOST]: env.HOST,

    // Database
    [ENV_KEYS.DATABASE_URL]: env.DATABASE_URL,
    [ENV_KEYS.DATABASE_ORM]: env.DATABASE_ORM,

    // Security
    [ENV_KEYS.JWT_SECRET]: env.JWT_SECRET,
    [ENV_KEYS.COOKIE_SECRET]: env.COOKIE_SECRET,
    [ENV_KEYS.JWT_EXPIRES_IN]: env.JWT_EXPIRES_IN,

    // Rate Limiting
    [ENV_KEYS.THROTTLE_TTL]: env.THROTTLE_TTL,
    [ENV_KEYS.THROTTLE_LIMIT]: env.THROTTLE_LIMIT,

    // CORS
    [ENV_KEYS.CORS_ORIGIN]: env.CORS_ORIGIN,

    // Logging
    [ENV_KEYS.LOG_LEVEL]: env.LOG_LEVEL,
  };
});
