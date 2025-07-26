import { registerAs } from '@nestjs/config';
import { z } from 'zod';
import { ENV_KEYS, ENV_VALUES, isTest } from '../shared/constants/environment';

// Schema de validación para variables de entorno
const envSchema = z.object({
  [ENV_KEYS.NODE_ENV]: z
    .enum([
      ENV_VALUES.NODE_ENV.DEVELOPMENT,
      ENV_VALUES.NODE_ENV.PRODUCTION,
      ENV_VALUES.NODE_ENV.TEST,
    ])
    .default(ENV_VALUES.NODE_ENV.DEVELOPMENT),
  [ENV_KEYS.PORT]: z.string().transform(Number).default(3000),
  [ENV_KEYS.DATABASE_URL]: z.string(),
  [ENV_KEYS.JWT_SECRET]: z.string(),
});

// Función para validar y obtener variables de entorno
export const validateEnv = () => {
  try {
    const env = envSchema.parse(process.env);

    // Mostrar información del entorno por consola (solo en desarrollo y producción)
    if (!isTest(env[ENV_KEYS.NODE_ENV])) {
      console.log('🚀 ========================================');
      console.log(`🌍 Environment: ${env[ENV_KEYS.NODE_ENV].toUpperCase()}`);
      console.log(`🔧 Port: ${env[ENV_KEYS.PORT]}`);
      console.log(`📅 Started at: ${new Date().toISOString()}`);
      console.log('========================================');
    }

    return env;
  } catch (error) {
    console.error('❌ Environment validation failed:', error);

    // En tests, lanzar excepción en lugar de process.exit
    if (
      isTest(process.env[ENV_KEYS.NODE_ENV] ?? ENV_VALUES.NODE_ENV.DEVELOPMENT)
    ) {
      throw new Error(`Environment validation failed: ${String(error)}`);
    }

    // En desarrollo y producción, salir del proceso
    process.exit(1);
  }
};

// Configuración para NestJS ConfigModule
export const envConfig = registerAs('env', () => {
  const env = validateEnv();

  return {
    nodeEnv: env[ENV_KEYS.NODE_ENV],
    port: env[ENV_KEYS.PORT],
    databaseUrl: env[ENV_KEYS.DATABASE_URL],
    jwtSecret: env[ENV_KEYS.JWT_SECRET],
    isDevelopment: env[ENV_KEYS.NODE_ENV] === ENV_VALUES.NODE_ENV.DEVELOPMENT,
    isProduction: env[ENV_KEYS.NODE_ENV] === ENV_VALUES.NODE_ENV.PRODUCTION,
    isTest: env[ENV_KEYS.NODE_ENV] === ENV_VALUES.NODE_ENV.TEST,
  };
});

// Función helper para obtener el entorno actual
export const getCurrentEnvironment = (): string => {
  return process.env[ENV_KEYS.NODE_ENV] ?? ENV_VALUES.NODE_ENV.DEVELOPMENT;
};
