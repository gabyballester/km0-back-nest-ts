#!/usr/bin/env node

/**
 * Utilidades para deployment de producción
 * Extraídas de production-deploy.js para modularización
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { ENVIRONMENTS, ENV_KEYS, MESSAGES } = require('./constants');

// Función helper para obtener variables de entorno de forma segura
function getEnvVar(key, defaultValue = '') {
  return process.env[key] || defaultValue;
}

// Función helper para verificar el entorno
function getEnvironment() {
  return getEnvVar(ENV_KEYS.NODE_ENV, ENVIRONMENTS.DEVELOPMENT);
}

// Función para ejecutar comandos de forma segura
function safeExec(command, description) {
  try {
    console.log(`🔄 ${description}...`);
    execSync(command, {
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: '1' },
    });
    console.log(`✅ ${description} completado`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} falló: ${error.message}`);
    return false;
  }
}

// Función para verificar si la base de datos existe y tiene tablas
function checkDatabaseExists() {
  try {
    console.log('🔍 Verificando estado de la base de datos...');
    const result = execSync(
      'npx prisma db execute --stdin --url "$DATABASE_URL"',
      {
        input:
          "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';",
        encoding: 'utf8',
      },
    );

    const tableCount = parseInt(result.match(/\d+/)?.[0] ?? '0');
    console.log(`📊 Tablas encontradas en la base de datos: ${tableCount}`);

    return tableCount > 0;
  } catch (error) {
    console.log('⚠️  No se pudo verificar el estado de la base de datos');
    return false;
  }
}

// Función para verificar si hay migraciones en el proyecto
function hasMigrations() {
  try {
    const migrationsPath = path.join(process.cwd(), 'prisma', 'migrations');
    return (
      fs.existsSync(migrationsPath) &&
      fs
        .readdirSync(migrationsPath)
        .filter(dir =>
          fs.statSync(path.join(migrationsPath, dir)).isDirectory(),
        ).length > 0
    );
  } catch (error) {
    console.warn('⚠️  Error verificando migraciones:', error.message);
    return false;
  }
}

// Función para validar entorno de producción
function validateProductionEnvironment() {
  const nodeEnv = getEnvironment();
  const safeDeploymentMode = getEnvVar(ENV_KEYS.SAFE_DEPLOYMENT_MODE);

  if (nodeEnv === ENVIRONMENTS.PRODUCTION) {
    console.log(MESSAGES.PRODUCTION_WARNING);
    console.log(MESSAGES.SAFETY_CHECK);

    // Verificar que la operación sea solo de lectura
    if (!safeDeploymentMode) {
      console.error(MESSAGES.UNSAFE_DEPLOYMENT);
      console.error(MESSAGES.SAFE_DEPLOYMENT_MODE_REQUIRED);
      console.error(MESSAGES.SAFE_DEPLOYMENT_COMMAND);
      throw new Error(MESSAGES.DEPLOYMENT_ERROR);
    }
  }

  return true;
}

module.exports = {
  getEnvVar,
  getEnvironment,
  safeExec,
  checkDatabaseExists,
  hasMigrations,
  validateProductionEnvironment,
};
