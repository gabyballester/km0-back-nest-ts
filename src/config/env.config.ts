import { registerAs } from '@nestjs/config';
import { z } from 'zod';

// Schema de validación para variables de entorno
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().transform(Number).default(3000),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
});

// Función para validar y obtener variables de entorno
export const validateEnv = () => {
  try {
    // todo: revisar si podemos prescindir de process.env y usar config service de nestjs
    const env = envSchema.parse(process.env);

    // Mostrar información del entorno por consola (solo en desarrollo y producción)
    if (env.NODE_ENV !== 'test') {
      console.log('🚀 ========================================');
      console.log(`🌍 Environment: ${env.NODE_ENV.toUpperCase()}`);
      console.log(`🔧 Port: ${env.PORT}`);
      console.log(`📅 Started at: ${new Date().toISOString()}`);
      console.log('========================================');
    }

    return env;
  } catch (error) {
    console.error('❌ Environment validation failed:', error);

    // En tests, lanzar excepción en lugar de process.exit
    if (process.env.NODE_ENV === 'test') {
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
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    databaseUrl: env.DATABASE_URL,
    jwtSecret: env.JWT_SECRET,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
  };
});

// Función helper para obtener el entorno actual
export const getCurrentEnvironment = (): string => {
  return process.env.NODE_ENV || 'development';
};

// Función helper para verificar si estamos en un entorno específico
export const isEnvironment = (
  env: 'development' | 'production' | 'test',
): boolean => {
  return getCurrentEnvironment() === env;
};
