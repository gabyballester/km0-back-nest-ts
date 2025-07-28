#!/usr/bin/env node

/**
 * Script de deployment de producción para Drizzle ORM
 * Versión: 3.0 - Workflow robusto de migraciones
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

console.log('🚀 Iniciando deployment de producción con Drizzle ORM (v3.0)...');

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

    // Asegurar SSL en producción
    let databaseUrl = process.env.DATABASE_URL;
    if (
      process.env.NODE_ENV === 'production' &&
      databaseUrl &&
      !databaseUrl.includes('sslmode=')
    ) {
      databaseUrl +=
        (databaseUrl.includes('?') ? '&' : '?') + 'sslmode=require';
      process.env.DATABASE_URL = databaseUrl;
    }

    const result = execSync('npx drizzle-kit migrate --dry-run', {
      encoding: 'utf8',
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });

    // Si hay migraciones pendientes, el comando mostrará información sobre ellas
    const hasPending =
      result.includes('pending') || result.includes('migration');
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
      process.env.NODE_ENV === 'production' &&
      databaseUrl &&
      !databaseUrl.includes('sslmode=')
    ) {
      databaseUrl +=
        (databaseUrl.includes('?') ? '&' : '?') + 'sslmode=require';
      process.env.DATABASE_URL = databaseUrl;
    }

    const result = execSync(
      'npx drizzle-kit introspect --url "$DATABASE_URL"',
      {
        encoding: 'utf8',
        env: { ...process.env, DATABASE_URL: databaseUrl },
      },
    );

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

    // Asegurar que la URL tenga SSL en producción
    let databaseUrl = process.env.DATABASE_URL;
    if (
      process.env.NODE_ENV === 'production' &&
      databaseUrl &&
      !databaseUrl.includes('sslmode=')
    ) {
      databaseUrl +=
        (databaseUrl.includes('?') ? '&' : '?') + 'sslmode=require';
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

// Función para sincronizar esquema (solo como último recurso)
function syncSchema() {
  try {
    console.log('🔄 Sincronizando esquema (último recurso)...');

    let databaseUrl = process.env.DATABASE_URL;
    if (
      process.env.NODE_ENV === 'production' &&
      databaseUrl &&
      !databaseUrl.includes('sslmode=')
    ) {
      databaseUrl +=
        (databaseUrl.includes('?') ? '&' : '?') + 'sslmode=require';
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
    if (!checkDatabaseState()) {
      throw new Error('Base de datos no accesible después del deployment');
    }

    // Verificar que no haya migraciones pendientes
    if (hasPendingMigrations()) {
      throw new Error('Quedan migraciones pendientes después del deployment');
    }

    console.log('✅ Estado final validado correctamente');
    return true;
  } catch (error) {
    console.log('❌ Error en validación final:', error.message);
    return false;
  }
}

function deployProduction() {
  try {
    // 🚨 VALIDACIÓN CRÍTICA: Verificar entorno de producción
    const nodeEnv = getEnvironment();
    const databaseOrm = getEnvVar('DATABASE_ORM', 'drizzle');

    if (nodeEnv === 'production') {
      console.log('🚨 ========================================');
      console.log('🛡️  DEPLOYMENT DE PRODUCCIÓN DETECTADO');
      console.log('========================================');
      console.log(`🗄️  ORM configurado: ${databaseOrm.toUpperCase()}`);
      console.log('⚠️  Verificando seguridad de base de datos...');
    }

    // Verificar que estamos usando Drizzle
    if (databaseOrm !== 'drizzle') {
      console.error(
        '❌ ERROR: DATABASE_ORM debe ser "drizzle" para este script',
      );
      throw new Error('ORM incorrecto configurado');
    }

    // 1. Verificar configuración SSL
    console.log('🔒 Verificando configuración SSL...');
    try {
      require('./check-ssl-config.js');
    } catch (error) {
      console.warn(
        '⚠️  No se pudo verificar la configuración SSL:',
        error.message,
      );
    }

    // 2. Verificar estado inicial de la base de datos
    const databaseExists = checkDatabaseState();
    const hasProjectMigrations = hasMigrations();

    console.log(`📋 Estado inicial detectado:`);
    console.log(`   - Base de datos existe: ${databaseExists ? 'SÍ' : 'NO'}`);
    console.log(
      `   - Migraciones en proyecto: ${hasProjectMigrations ? 'SÍ' : 'NO'}`,
    );

    // 3. Estrategia robusta de deployment
    console.log('🎯 Iniciando estrategia robusta de deployment...');

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

        // Fallback: sincronizar esquema
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

    // 4. Validación final
    if (!validateFinalState()) {
      throw new Error('Validación final falló');
    }

    // 5. Éxito
    console.log('🎉 ========================================');
    console.log('✅ DEPLOYMENT COMPLETADO EXITOSAMENTE');
    console.log('========================================');
    console.log('📊 Resumen:');
    console.log('   - Base de datos sincronizada');
    console.log('   - Migraciones aplicadas');
    console.log('   - Estado validado');
    console.log('========================================');
  } catch (error) {
    console.error('❌ ========================================');
    console.error('💥 ERROR CRÍTICO EN DEPLOYMENT');
    console.error('========================================');
    console.error(`❌ Error: ${error.message}`);
    console.error('💥 Deployment falló');
    console.error('========================================');
    process.exit(1);
  }
}

// Ejecutar deployment
deployProduction();
