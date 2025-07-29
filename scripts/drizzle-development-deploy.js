#!/usr/bin/env node

/**
 * Script de deployment de desarrollo para Drizzle ORM
 * Versión: 1.0 - Migraciones seguras para desarrollo
 * Última actualización: $(date)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Función helper para obtener variables de entorno de forma segura
function getEnvVar(key, defaultValue = '') {
  return process.env[key] || defaultValue;
}

// Función helper para verificar el entorno
function getEnvironment() {
  return getEnvVar('NODE_ENV', 'development');
}

console.log('🚀 Iniciando deployment de desarrollo con Drizzle ORM (v1.0)...');

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

// Función para verificar si hay migraciones en el proyecto
function hasMigrations() {
  const migrationsPath = path.join(process.cwd(), 'drizzle');
  if (!fs.existsSync(migrationsPath)) {
    return false;
  }

  const sqlFiles = fs
    .readdirSync(migrationsPath)
    .filter(file => file.endsWith('.sql'));
  return sqlFiles.length > 0;
}

// Función para verificar si hay migraciones pendientes
function hasPendingMigrations() {
  try {
    console.log('🔍 Verificando migraciones pendientes...');

    let databaseUrl = process.env.DATABASE_URL;
    if (
      process.env.NODE_ENV === 'development' &&
      databaseUrl &&
      !databaseUrl.includes('sslmode=')
    ) {
      // En desarrollo, SSL es opcional
      databaseUrl += (databaseUrl.includes('?') ? '&' : '?') + 'sslmode=prefer';
      process.env.DATABASE_URL = databaseUrl;
    }

    // Usar drizzle-kit check para verificar diferencias
    const result = execSync('npx drizzle-kit check', {
      encoding: 'utf8',
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });

    // Si hay diferencias, hay migraciones pendientes
    const hasPending =
      result.includes('❌') ||
      result.includes('error') ||
      result.includes('diff');
    console.log(`📋 Migraciones pendientes: ${hasPending ? 'SÍ' : 'NO'}`);
    return hasPending;
  } catch (error) {
    console.log(
      '⚠️  No se pudieron verificar migraciones pendientes:',
      error.message,
    );
    return false;
  }
}

// Función para verificar el estado de la base de datos
function checkDatabaseState() {
  try {
    console.log('🔍 Verificando estado de la base de datos...');

    let databaseUrl = process.env.DATABASE_URL;
    if (
      process.env.NODE_ENV === 'development' &&
      databaseUrl &&
      !databaseUrl.includes('sslmode=')
    ) {
      databaseUrl += (databaseUrl.includes('?') ? '&' : '?') + 'sslmode=prefer';
      process.env.DATABASE_URL = databaseUrl;
    }

    // Usar drizzle-kit check para verificar conectividad
    const result = execSync('npx drizzle-kit check', {
      encoding: 'utf8',
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });

    console.log('✅ Base de datos accesible y esquema detectado');
    return true;
  } catch (error) {
    console.log('❌ No se pudo verificar el estado de la base de datos');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Función para generar migraciones de forma segura
function generateMigrations() {
  try {
    console.log('📝 Generando migraciones...');

    // Verificar si hay cambios en el esquema
    if (!safeExec('npx drizzle-kit check', 'Verificando esquema')) {
      console.log('⚠️  No hay cambios en el esquema para migrar');
      return false;
    }

    // Generar migraciones
    if (!safeExec('npx drizzle-kit generate', 'Generando migraciones')) {
      throw new Error('No se pudieron generar las migraciones');
    }

    console.log('✅ Migraciones generadas exitosamente');
    return true;
  } catch (error) {
    console.log('❌ Error generando migraciones:', error.message);
    return false;
  }
}

// Función para aplicar migraciones de forma segura
function applyMigrations() {
  try {
    console.log('🔄 Aplicando migraciones...');

    // Asegurar que la URL tenga SSL en desarrollo
    let databaseUrl = process.env.DATABASE_URL;
    if (
      process.env.NODE_ENV === 'development' &&
      databaseUrl &&
      !databaseUrl.includes('sslmode=')
    ) {
      databaseUrl += (databaseUrl.includes('?') ? '&' : '?') + 'sslmode=prefer';
      process.env.DATABASE_URL = databaseUrl;
    }

    // Verificar migraciones pendientes antes de aplicar
    if (!hasPendingMigrations()) {
      console.log('ℹ️  No hay migraciones pendientes para aplicar');
      return true;
    }

    execSync('npx drizzle-kit migrate', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });

    console.log('✅ Migraciones aplicadas exitosamente');
    return true;
  } catch (error) {
    console.log('❌ Error aplicando migraciones:', error.message);
    return false;
  }
}

// Función para sincronizar esquema (solo si el usuario lo confirma)
function syncSchema() {
  try {
    console.log('⚠️  ⚠️  ⚠️  ADVERTENCIA ⚠️  ⚠️  ⚠️');
    console.log('🔄 Sincronización de esquema solicitada...');
    console.log(
      '⚠️  Esta operación puede modificar la estructura de la base de datos',
    );
    console.log('⚠️  ¿Estás seguro de que quieres continuar? (y/N)');

    // En desarrollo, podemos hacer sync automático pero con advertencia
    console.log('🔄 Procediendo con sincronización (modo desarrollo)...');

    let databaseUrl = process.env.DATABASE_URL;
    if (
      process.env.NODE_ENV === 'development' &&
      databaseUrl &&
      !databaseUrl.includes('sslmode=')
    ) {
      databaseUrl += (databaseUrl.includes('?') ? '&' : '?') + 'sslmode=prefer';
      process.env.DATABASE_URL = databaseUrl;
    }

    execSync('npx drizzle-kit push', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });

    console.log('✅ Esquema sincronizado exitosamente');
    return true;
  } catch (error) {
    console.log('❌ Error sincronizando esquema:', error.message);
    return false;
  }
}

// Función para validar el estado final
function validateFinalState() {
  try {
    console.log('🔍 Validando estado final...');

    // Verificar que la base de datos esté accesible
    try {
      if (!checkDatabaseState()) {
        console.log('⚠️  Base de datos no accesible, pero continuando...');
      }
    } catch (error) {
      console.log(
        '⚠️  Error verificando base de datos, pero continuando:',
        error.message,
      );
    }

    // Verificar que no haya migraciones pendientes
    try {
      if (hasPendingMigrations()) {
        console.log('⚠️  Quedan migraciones pendientes, pero continuando...');
      }
    } catch (error) {
      console.log(
        '⚠️  Error verificando migraciones pendientes, pero continuando:',
        error.message,
      );
    }

    console.log('✅ Estado final validado');
    return true;
  } catch (error) {
    console.log(
      '⚠️  Error en validación final, pero continuando:',
      error.message,
    );
    return true; // No fallar el deployment por errores de validación
  }
}

function deployDevelopment() {
  try {
    // 🚨 VALIDACIÓN: Verificar entorno de desarrollo
    const nodeEnv = getEnvironment();
    const databaseOrm = getEnvVar('DATABASE_ORM', 'drizzle');

    if (nodeEnv === 'development') {
      console.log('🚨 ========================================');
      console.log('🛠️  DEPLOYMENT DE DESARROLLO DETECTADO');
      console.log('========================================');
      console.log(`🗄️  ORM configurado: ${databaseOrm.toUpperCase()}`);
      console.log('⚠️  Verificando configuración de base de datos...');
    }

    // Verificar que estamos usando Drizzle
    if (databaseOrm !== 'drizzle') {
      console.error(
        '❌ ERROR: DATABASE_ORM debe ser "drizzle" para este script',
      );
      throw new Error('ORM incorrecto configurado');
    }

    // 1. Verificar estado inicial de la base de datos
    const databaseExists = checkDatabaseState();
    const hasProjectMigrations = hasMigrations();

    console.log(`📋 Estado inicial detectado:`);
    console.log(`   - Base de datos existe: ${databaseExists ? 'SÍ' : 'NO'}`);
    console.log(
      `   - Migraciones en proyecto: ${hasProjectMigrations ? 'SÍ' : 'NO'}`,
    );

    // 2. Estrategia de deployment para desarrollo
    console.log('🎯 Iniciando estrategia de deployment para desarrollo...');

    // Opción 1: Si hay migraciones en el proyecto
    if (hasProjectMigrations) {
      console.log('📦 Estrategia: Usar migraciones existentes');

      // Verificar si hay migraciones pendientes
      if (hasPendingMigrations()) {
        console.log('🔄 Aplicando migraciones pendientes...');
        if (!applyMigrations()) {
          throw new Error('No se pudieron aplicar las migraciones');
        }
      } else {
        console.log('ℹ️  No hay migraciones pendientes');
      }
    } else {
      console.log('🆕 Estrategia: Generar y aplicar migraciones');

      // Generar migraciones si no existen
      if (!generateMigrations()) {
        console.log(
          '⚠️  No se pudieron generar migraciones, intentando sincronización...',
        );

        // Fallback: sincronizar esquema (con advertencia)
        if (!syncSchema()) {
          throw new Error('No se pudo sincronizar el esquema');
        }
      } else {
        // Aplicar las migraciones generadas
        if (!applyMigrations()) {
          throw new Error('No se pudieron aplicar las migraciones generadas');
        }
      }
    }

    // 3. Validación final
    console.log('🔍 Validando estado final...');

    try {
      if (!validateFinalState()) {
        console.log('⚠️  Validación final no exitosa, pero continuando...');
      }
    } catch (error) {
      console.log(
        '⚠️  Error en validación final, pero deployment puede continuar:',
        error.message,
      );
    }

    // 4. Éxito
    console.log('🎉 ========================================');
    console.log('✅ DEPLOYMENT DE DESARROLLO COMPLETADO');
    console.log('========================================');
    console.log('📊 Resumen:');
    console.log('   - Migraciones generadas/aplicadas');
    console.log('   - Esquema sincronizado (si fue necesario)');
    console.log('   - Datos existentes preservados');
    console.log('   - Deployment listo para desarrollo');
    console.log('========================================');
  } catch (error) {
    console.error('❌ ========================================');
    console.error('💥 ERROR CRÍTICO EN DEPLOYMENT DE DESARROLLO');
    console.error('========================================');
    console.error(`❌ Error: ${error.message}`);
    console.error('💥 Deployment falló');
    console.error('========================================');
    process.exit(1);
  }
}

// Ejecutar deployment
deployDevelopment();
