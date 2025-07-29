#!/usr/bin/env node

/**
 * Workflow Automatizado de Migraciones
 *
 * Este script automatiza el proceso completo de migraciones:
 * 1. Generar migración Drizzle
 * 2. Aplicar migración
 * 3. Sincronizar schema Prisma
 * 4. Generar cliente Prisma
 * 5. Verificar estado final
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const {
  executeWithSafety,
  validateSafetyConfiguration,
  createSafetyBackup,
} = require('./database-safety-guard');

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

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, description) {
  console.log(`\n${colors.cyan}${colors.bright}🔧 ${step}${colors.reset}`);
  console.log(`${colors.white}${description}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

function executeCommand(command, description) {
  try {
    logStep('Ejecutando', description);
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: process.cwd(),
    });
    logSuccess(`${description} completado exitosamente`);
    return { success: true, output: result };
  } catch (error) {
    logError(`${description} falló: ${error.message}`);
    return { success: false, error: error.message };
  }
}

function checkMigrationFiles() {
  const drizzleDir = path.join(process.cwd(), 'drizzle');
  if (!fs.existsSync(drizzleDir)) {
    logError('No se encontró el directorio drizzle/');
    return false;
  }

  const files = fs
    .readdirSync(drizzleDir)
    .filter(file => file.endsWith('.sql'));
  if (files.length === 0) {
    logWarning('No se encontraron archivos de migración en drizzle/');
    return false;
  }

  logInfo(`Encontrados ${files.length} archivos de migración`);
  return true;
}

function getLatestMigration() {
  const drizzleDir = path.join(process.cwd(), 'drizzle');
  const files = fs
    .readdirSync(drizzleDir)
    .filter(file => file.endsWith('.sql'))
    .sort()
    .reverse();

  return files[0] || null;
}

function main() {
  console.log(
    `${colors.magenta}${colors.bright}🚀 WORKFLOW AUTOMATIZADO DE MIGRACIONES${colors.reset}`,
  );
  console.log(
    `${colors.white}========================================${colors.reset}`,
  );

  // Verificar configuración de seguridad
  logStep('Verificando', 'Configuración de seguridad');
  if (!validateSafetyConfiguration()) {
    logError('Configuración de seguridad inválida. Abortando workflow.');
    process.exit(1);
  }

  // Verificar estado inicial
  logStep('Verificando', 'Estado inicial del proyecto');

  if (!checkMigrationFiles()) {
    logError('No se pueden continuar las migraciones');
    process.exit(1);
  }

  const latestMigration = getLatestMigration();
  logInfo(`Última migración: ${latestMigration}`);

  // Paso 1: Generar migración
  const generateResult = executeCommand(
    'npm run migration:generate',
    'Generar migración Drizzle',
  );

  if (!generateResult.success) {
    logError(
      'No se pudo generar la migración. Verifica los cambios en el schema.',
    );
    process.exit(1);
  }

  // Paso 2: Verificar nueva migración
  const newLatestMigration = getLatestMigration();
  if (newLatestMigration === latestMigration) {
    logWarning(
      'No se generó una nueva migración. No hay cambios en el schema.',
    );
    logInfo('Continuando con verificación de estado...');
  } else {
    logSuccess(`Nueva migración generada: ${newLatestMigration}`);
  }

  // Paso 3: Crear backup de seguridad (si es necesario)
  const backupResult = createSafetyBackup();
  if (!backupResult.success) {
    logWarning('No se pudo crear backup de seguridad, pero continuando...');
  }

  // Paso 4: Aplicar migración con verificación de seguridad
  const applyResult = executeWithSafety(
    'npm run migration:apply',
    'Aplicar migración a la base de datos',
  );

  if (!applyResult.success) {
    logError('No se pudo aplicar la migración');
    process.exit(1);
  }

  // Paso 4: Sincronizar Prisma
  const syncResult = executeCommand(
    'npm run db:dev',
    'Sincronizar schema Prisma con la base de datos',
  );

  if (!syncResult.success) {
    logWarning('No se pudo sincronizar Prisma. Verifica manualmente.');
  }

  // Paso 5: Generar cliente Prisma
  const generateClientResult = executeCommand(
    'npm run db:generate',
    'Generar cliente Prisma',
  );

  if (!generateClientResult.success) {
    logError('No se pudo generar el cliente Prisma');
    process.exit(1);
  }

  // Paso 6: Verificar estado final
  logStep('Verificando', 'Estado final de las migraciones');

  const statusResult = executeCommand(
    'npm run migration:status',
    'Verificar estado de migraciones',
  );

  if (!statusResult.success) {
    logWarning('No se pudo verificar el estado final');
  }

  // Paso 7: Verificar y limpiar carpetas dist innecesarias
  const distCheckResult = executeCommand(
    'npm run check:dist',
    'Verificar carpetas dist',
  );

  if (!distCheckResult.success) {
    logWarning('Se encontraron carpetas dist innecesarias');
    const cleanResult = executeCommand(
      'npm run clean:unnecessary-dist',
      'Limpiar carpetas dist innecesarias',
    );

    if (cleanResult.success) {
      logSuccess('Carpetas dist innecesarias eliminadas');
    } else {
      logError('No se pudieron eliminar las carpetas dist innecesarias');
    }
  }

  // Resumen final
  console.log(
    `\n${colors.magenta}${colors.bright}📋 RESUMEN DEL WORKFLOW${colors.reset}`,
  );
  console.log(
    `${colors.white}========================================${colors.reset}`,
  );

  if (newLatestMigration !== latestMigration) {
    logSuccess(`✅ Nueva migración creada: ${newLatestMigration}`);
  } else {
    logInfo('ℹ️  No se requirieron nuevas migraciones');
  }

  logSuccess('✅ Migración aplicada a la base de datos');
  logSuccess('✅ Cliente Prisma generado');
  logSuccess('✅ Workflow completado exitosamente');

  console.log(
    `\n${colors.cyan}${colors.bright}🎉 ¡WORKFLOW COMPLETADO!${colors.reset}`,
  );
  console.log(
    `${colors.white}El sistema de migraciones está listo para desarrollo y producción.${colors.reset}`,
  );
}

// Manejo de errores no capturados
process.on('uncaughtException', error => {
  logError(`Error no capturado: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logError(`Promesa rechazada no manejada: ${reason}`);
  process.exit(1);
});

if (require.main === module) {
  main();
}

module.exports = {
  main,
  executeCommand,
  checkMigrationFiles,
  getLatestMigration,
};
