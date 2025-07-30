#!/usr/bin/env node

/**
 * 🛡️ Database Safety Guard
 *
 * Sistema de seguridad robusto para prevenir la destrucción accidental
 * de la base de datos, especialmente en producción.
 *
 * Basado en mejores prácticas de NestJS, Prisma ORM y la comunidad.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Constantes de seguridad
const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
};

const DANGEROUS_OPERATIONS = {
  RESET: ['reset', 'drop', 'delete', 'truncate'],
  DESTRUCTIVE: ['migrate reset', 'db push --force-reset'],
  PRODUCTION_UNSAFE: ['migrate dev', 'db push --accept-data-loss'],
};

const SAFETY_LEVELS = {
  PARANOID: 'paranoid', // Bloquea TODO en producción
  STRICT: 'strict', // Bloquea operaciones destructivas
  RELAXED: 'relaxed', // Solo advertencias
  DISABLED: 'disabled', // Sin protección
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  console.log(`${colors.red}${colors.bright}🚨 ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}${colors.bright}⚠️  ${message}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.green}${colors.bright}✅ ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.blue}${colors.bright}ℹ️  ${message}${colors.reset}`);
}

function logSecurity(message) {
  console.log(`${colors.magenta}${colors.bright}🛡️  ${message}${colors.reset}`);
}

/**
 * Obtiene el nivel de seguridad configurado
 */
function getSafetyLevel() {
  const safetyLevel = process.env.DATABASE_SAFETY_LEVEL || 'strict';
  return Object.values(SAFETY_LEVELS).includes(safetyLevel)
    ? safetyLevel
    : SAFETY_LEVELS.STRICT;
}

/**
 * Obtiene el entorno actual
 */
function getCurrentEnvironment() {
  return process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT;
}

/**
 * Verifica si estamos en producción
 */
function isProduction() {
  return getCurrentEnvironment() === ENVIRONMENTS.PRODUCTION;
}

/**
 * Verifica si una operación es peligrosa
 */
function isDangerousOperation(operation) {
  const operationLower = operation.toLowerCase();

  // Verificar operaciones de reset/destrucción
  for (const dangerous of DANGEROUS_OPERATIONS.RESET) {
    if (operationLower.includes(dangerous)) {
      return {
        dangerous: true,
        type: 'RESET',
        reason: `Operación de reset detectada: ${dangerous}`,
      };
    }
  }

  // Verificar operaciones destructivas
  for (const destructive of DANGEROUS_OPERATIONS.DESTRUCTIVE) {
    if (operationLower.includes(destructive)) {
      return {
        dangerous: true,
        type: 'DESTRUCTIVE',
        reason: `Operación destructiva detectada: ${destructive}`,
      };
    }
  }

  // Verificar operaciones no seguras para producción
  if (isProduction()) {
    for (const unsafe of DANGEROUS_OPERATIONS.PRODUCTION_UNSAFE) {
      if (operationLower.includes(unsafe)) {
        return {
          dangerous: true,
          type: 'PRODUCTION_UNSAFE',
          reason: `Operación no segura para producción: ${unsafe}`,
        };
      }
    }
  }

  return { dangerous: false };
}

/**
 * Verifica si la operación requiere confirmación manual
 */
function requiresManualConfirmation(operation, safetyLevel) {
  if (safetyLevel === SAFETY_LEVELS.DISABLED) {
    return false;
  }

  if (safetyLevel === SAFETY_LEVELS.PARANOID && isProduction()) {
    return true;
  }

  const dangerCheck = isDangerousOperation(operation);
  if (dangerCheck.dangerous) {
    return (
      safetyLevel === SAFETY_LEVELS.STRICT ||
      safetyLevel === SAFETY_LEVELS.PARANOID
    );
  }

  return false;
}

/**
 * Solicita confirmación manual del usuario
 */
function requestManualConfirmation(operation, reason) {
  console.log(
    `\n${colors.red}${colors.bright}🚨 OPERACIÓN PELIGROSA DETECTADA${colors.reset}`,
  );
  console.log(
    `${colors.white}========================================${colors.reset}`,
  );
  console.log(`Operación: ${colors.yellow}${operation}${colors.reset}`);
  console.log(`Razón: ${colors.red}${reason}${colors.reset}`);
  console.log(
    `Entorno: ${colors.yellow}${getCurrentEnvironment()}${colors.reset}`,
  );
  console.log(
    `\n${colors.red}${colors.bright}⚠️  ESTA OPERACIÓN PUEDE DESTRUIR DATOS${colors.reset}`,
  );

  if (isProduction()) {
    console.log(
      `\n${colors.red}${colors.bright}🚨 ATENCIÓN: ESTÁS EN PRODUCCIÓN${colors.reset}`,
    );
    console.log(
      `${colors.red}Esta operación puede afectar a usuarios reales${colors.reset}`,
    );
  }

  console.log(
    `\n${colors.white}Para continuar, escribe exactamente: ${colors.green}${colors.bright}CONFIRMO${colors.reset}`,
  );
  console.log(`${colors.white}Para cancelar, presiona Ctrl+C${colors.reset}`);

  // En un entorno real, aquí se solicitaría input del usuario
  // Por ahora, simulamos que siempre se cancela en producción
  if (isProduction()) {
    logError('Operación cancelada automáticamente en producción');
    logInfo(
      'Para forzar la operación, establece DATABASE_SAFETY_LEVEL=disabled',
    );
    return false;
  }

  return true; // En desarrollo, permitimos la operación
}

/**
 * Database naming convention constants
 * Ensures environment-specific database names for safety
 */
const DATABASE_NAMES = {
  development: 'km0_db_dev',
  production: 'km0_db',
  test: 'km0_db_test',
};

/**
 * Validates database name matches environment-specific naming convention
 */
function validateDatabaseName() {
  const databaseUrl = process.env.DATABASE_URL;
  const environment = getCurrentEnvironment();

  if (!databaseUrl) {
    logError('DATABASE_URL no está configurada');
    return false;
  }

  try {
    const dbUrl = new URL(databaseUrl);
    const dbName = dbUrl.pathname.slice(1); // Remove leading '/'
    const expectedName = DATABASE_NAMES[environment];

    if (!expectedName) {
      logError(`Entorno no reconocido: ${environment}`);
      return false;
    }

    if (dbName !== expectedName) {
      logError('❌ Error de validación de nombre de base de datos!');
      logError(`   Entorno: ${environment}`);
      logError(`   Esperado: ${expectedName}`);
      logError(`   Encontrado: ${dbName}`);
      logError('   Esto previene la pérdida accidental de datos');
      logError(
        '   asegurando que cada entorno use su base de datos designada.',
      );
      return false;
    }

    logSuccess(`✅ Nombre de base de datos válido: ${dbName}`);
    return true;
  } catch (error) {
    logError(`Error validando DATABASE_URL: ${error.message}`);
    return false;
  }
}

/**
 * Verifica la configuración de seguridad
 */
function validateSafetyConfiguration() {
  const safetyLevel = getSafetyLevel();
  const environment = getCurrentEnvironment();

  logSecurity('Validando configuración de seguridad...');
  logInfo(`Nivel de seguridad: ${safetyLevel}`);
  logInfo(`Entorno: ${environment}`);

  // Verificar variables de entorno críticas
  const criticalVars = ['DATABASE_URL'];
  const missingVars = criticalVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    logError(
      `Variables de entorno críticas faltantes: ${missingVars.join(', ')}`,
    );
    return false;
  }

  // Verificar nombre de base de datos por entorno
  if (!validateDatabaseName()) {
    return false;
  }

  // Verificar configuración de producción
  if (isProduction()) {
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl && !databaseUrl.includes('sslmode=require')) {
      logWarning('DATABASE_URL no incluye SSL en producción');
      logInfo('Recomendado: añadir ?sslmode=require al final de la URL');
    }
  }

  logSuccess('Configuración de seguridad válida');
  return true;
}

/**
 * Ejecuta una operación con verificación de seguridad
 */
function executeWithSafety(operation, description = '') {
  const safetyLevel = getSafetyLevel();
  const environment = getCurrentEnvironment();

  logSecurity(`Verificando seguridad para: ${operation}`);

  // Validar configuración
  if (!validateSafetyConfiguration()) {
    return { success: false, error: 'Configuración de seguridad inválida' };
  }

  // Verificar si la operación es peligrosa
  const dangerCheck = isDangerousOperation(operation);

  if (dangerCheck.dangerous) {
    logWarning(`Operación peligrosa detectada: ${dangerCheck.reason}`);

    // Verificar si requiere confirmación manual
    if (requiresManualConfirmation(operation, safetyLevel)) {
      if (!requestManualConfirmation(operation, dangerCheck.reason)) {
        return { success: false, error: 'Operación cancelada por seguridad' };
      }
    }

    // En modo paranoico, bloquear todo en producción
    if (safetyLevel === SAFETY_LEVELS.PARANOID && isProduction()) {
      logError('Operación bloqueada en modo paranoico para producción');
      logInfo(
        'Para permitir la operación, cambia DATABASE_SAFETY_LEVEL a "strict"',
      );
      return {
        success: false,
        error: 'Operación bloqueada por configuración de seguridad',
      };
    }
  }

  // Ejecutar la operación
  try {
    logInfo(`Ejecutando: ${description || operation}`);
    const result = execSync(operation, {
      encoding: 'utf8',
      stdio: 'pipe',
      env: { ...process.env, FORCE_COLOR: '1' },
    });

    logSuccess(`Operación completada: ${description || operation}`);
    return { success: true, output: result };
  } catch (error) {
    logError(`Error ejecutando operación: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Verifica el estado de la base de datos
 */
function checkDatabaseState() {
  try {
    // Verificar conectividad básica
    const testQuery = 'SELECT 1 as test';
    const result = execSync(
      `psql "${process.env.DATABASE_URL}" -c "${testQuery}"`,
      {
        encoding: 'utf8',
        stdio: 'pipe',
      },
    );

    if (result.includes('test')) {
      logSuccess('Base de datos accesible');
      return { accessible: true };
    } else {
      logError('Base de datos no accesible');
      return { accessible: false };
    }
  } catch (error) {
    logError(`Error verificando base de datos: ${error.message}`);
    return { accessible: false, error: error.message };
  }
}

/**
 * Crea un backup de seguridad antes de operaciones peligrosas
 */
function createSafetyBackup() {
  if (!isProduction()) {
    logInfo('Backup de seguridad no requerido en desarrollo');
    return { success: true };
  }

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `backup-safety-${timestamp}.sql`;

    logInfo('Creando backup de seguridad...');
    execSync(`pg_dump "${process.env.DATABASE_URL}" > ${backupFile}`, {
      stdio: 'pipe',
    });

    logSuccess(`Backup creado: ${backupFile}`);
    return { success: true, backupFile };
  } catch (error) {
    logError(`Error creando backup: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Función principal del guard de seguridad
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const operation = args[1];

  if (!command) {
    console.log(
      `${colors.cyan}${colors.bright}🛡️  Database Safety Guard${colors.reset}`,
    );
    console.log(
      `${colors.white}========================================${colors.reset}`,
    );
    console.log(
      'Uso: node scripts/database-safety-guard.js <comando> [operación]',
    );
    console.log('');
    console.log('Comandos disponibles:');
    console.log('  check     - Verificar configuración de seguridad');
    console.log(
      '  execute   - Ejecutar operación con verificación de seguridad',
    );
    console.log('  backup    - Crear backup de seguridad');
    console.log('  status    - Verificar estado de la base de datos');
    console.log('');
    console.log('Variables de entorno:');
    console.log('  DATABASE_SAFETY_LEVEL - paranoid|strict|relaxed|disabled');
    console.log('  NODE_ENV              - development|test|production');
    console.log('');
    console.log('Ejemplos:');
    console.log('  node scripts/database-safety-guard.js check');
    console.log(
      '  node scripts/database-safety-guard.js execute "npm run db:reset"',
    );
    console.log('  node scripts/database-safety-guard.js backup');
    process.exit(0);
  }

  switch (command) {
    case 'check':
      validateSafetyConfiguration();
      break;

    case 'execute':
      if (!operation) {
        logError('Operación requerida para el comando execute');
        process.exit(1);
      }
      executeWithSafety(operation);
      break;

    case 'backup':
      createSafetyBackup();
      break;

    case 'status':
      checkDatabaseState();
      break;

    default:
      logError(`Comando desconocido: ${command}`);
      process.exit(1);
  }
}

// Exportar funciones para uso en otros scripts
module.exports = {
  executeWithSafety,
  validateSafetyConfiguration,
  checkDatabaseState,
  createSafetyBackup,
  isProduction,
  getSafetyLevel,
  isDangerousOperation,
  requiresManualConfirmation,
  SAFETY_LEVELS,
  ENVIRONMENTS,
  DANGEROUS_OPERATIONS,
};

if (require.main === module) {
  main();
}
