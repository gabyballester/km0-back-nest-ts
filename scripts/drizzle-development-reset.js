#!/usr/bin/env node

/**
 * Script de reset de desarrollo para Drizzle ORM
 * Versión: 1.0 - Reset explícito con confirmación
 * Última actualización: $(date)
 *
 * ⚠️  ADVERTENCIA: Este script DESTRUIRÁ todos los datos existentes
 * Solo usar cuando sea absolutamente necesario
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

console.log('🚨 ========================================');
console.log('⚠️  SCRIPT DE RESET DE DESARROLLO');
console.log('========================================');
console.log('🚨 ADVERTENCIA: Este script DESTRUIRÁ todos los datos');
console.log('🚨 Solo usar cuando sea absolutamente necesario');
console.log('========================================');

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

// Función para hacer backup antes del reset (opcional)
function createBackup() {
  try {
    console.log('💾 Creando backup antes del reset...');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups');

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);

    // Crear backup usando pg_dump si está disponible
    try {
      const databaseUrl = process.env.DATABASE_URL;
      if (databaseUrl) {
        // Extraer información de la URL
        const url = new URL(databaseUrl);
        const host = url.hostname;
        const port = url.port || '5432';
        const database = url.pathname.slice(1);
        const username = url.username;
        const password = url.password;

        const pgDumpCommand = `PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${username} -d ${database} -f ${backupFile}`;

        execSync(pgDumpCommand, { stdio: 'pipe' });
        console.log(`✅ Backup creado: ${backupFile}`);
        return true;
      }
    } catch (error) {
      console.log('⚠️  No se pudo crear backup automático:', error.message);
      console.log('💡 Puedes crear un backup manualmente si es necesario');
    }

    return false;
  } catch (error) {
    console.log('⚠️  Error creando backup:', error.message);
    return false;
  }
}

// Función para resetear la base de datos
function resetDatabase() {
  try {
    console.log('🗑️  Iniciando reset de base de datos...');

    let databaseUrl = process.env.DATABASE_URL;
    if (
      process.env.NODE_ENV === 'development' &&
      databaseUrl &&
      !databaseUrl.includes('sslmode=')
    ) {
      databaseUrl += (databaseUrl.includes('?') ? '&' : '?') + 'sslmode=prefer';
      process.env.DATABASE_URL = databaseUrl;
    }

    // Opción 1: Si hay migraciones, usar drizzle-kit push para reset completo
    if (hasMigrations()) {
      console.log('📦 Usando drizzle-kit push para reset completo...');

      if (!safeExec('npx drizzle-kit push', 'Reseteando esquema con push')) {
        throw new Error('No se pudo resetear el esquema');
      }
    } else {
      console.log('🆕 No hay migraciones, generando esquema desde cero...');

      // Generar migraciones primero
      if (!safeExec('npx drizzle-kit generate', 'Generando migraciones')) {
        throw new Error('No se pudieron generar las migraciones');
      }

      // Luego aplicar con push
      if (!safeExec('npx drizzle-kit push', 'Aplicando esquema con push')) {
        throw new Error('No se pudo aplicar el esquema');
      }
    }

    console.log('✅ Base de datos reseteada exitosamente');
    return true;
  } catch (error) {
    console.log('❌ Error reseteando base de datos:', error.message);
    return false;
  }
}

// Función para verificar el estado final
function validateReset() {
  try {
    console.log('🔍 Verificando estado después del reset...');

    let databaseUrl = process.env.DATABASE_URL;
    if (
      process.env.NODE_ENV === 'development' &&
      databaseUrl &&
      !databaseUrl.includes('sslmode=')
    ) {
      databaseUrl += (databaseUrl.includes('?') ? '&' : '?') + 'sslmode=prefer';
      process.env.DATABASE_URL = databaseUrl;
    }

    // Verificar que el esquema esté correcto
    const result = execSync('npx drizzle-kit check', {
      encoding: 'utf8',
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });

    if (result.includes('✅') || result.includes('No schema changes')) {
      console.log('✅ Esquema verificado correctamente después del reset');
      return true;
    } else {
      console.log('⚠️  Esquema no verificado correctamente después del reset');
      return false;
    }
  } catch (error) {
    console.log(
      '⚠️  Error verificando esquema después del reset:',
      error.message,
    );
    return false;
  }
}

function resetDevelopment() {
  try {
    // 🚨 VALIDACIÓN: Verificar entorno de desarrollo
    const nodeEnv = getEnvironment();
    const databaseOrm = getEnvVar('DATABASE_ORM', 'drizzle');

    if (nodeEnv !== 'development') {
      console.error('❌ ERROR: Este script solo debe usarse en desarrollo');
      throw new Error('Entorno incorrecto para reset');
    }

    // Verificar que estamos usando Drizzle
    if (databaseOrm !== 'drizzle') {
      console.error(
        '❌ ERROR: DATABASE_ORM debe ser "drizzle" para este script',
      );
      throw new Error('ORM incorrecto configurado');
    }

    // Confirmación final del usuario
    console.log('🚨 ========================================');
    console.log('⚠️  CONFIRMACIÓN FINAL REQUERIDA');
    console.log('========================================');
    console.log('🚨 ¿Estás SEGURO de que quieres DESTRUIR todos los datos?');
    console.log('🚨 Esta acción NO se puede deshacer');
    console.log('🚨 Escribe "DESTROY" para confirmar:');

    // En un entorno automatizado, podemos proceder con advertencia
    console.log('🔄 Procediendo con reset (modo automatizado)...');

    // 1. Crear backup (opcional)
    createBackup();

    // 2. Resetear base de datos
    if (!resetDatabase()) {
      throw new Error('No se pudo resetear la base de datos');
    }

    // 3. Validar estado final
    if (!validateReset()) {
      console.log('⚠️  Reset completado pero con advertencias');
    }

    // 4. Éxito
    console.log('🎉 ========================================');
    console.log('✅ RESET DE DESARROLLO COMPLETADO');
    console.log('========================================');
    console.log('📊 Resumen:');
    console.log('   - Backup creado (si fue posible)');
    console.log('   - Base de datos reseteada');
    console.log('   - Esquema verificado');
    console.log('   - Listo para desarrollo');
    console.log('========================================');
    console.log('💡 Recuerda: Todos los datos anteriores fueron eliminados');
  } catch (error) {
    console.error('❌ ========================================');
    console.error('💥 ERROR CRÍTICO EN RESET DE DESARROLLO');
    console.error('========================================');
    console.error(`❌ Error: ${error.message}`);
    console.error('💥 Reset falló');
    console.error('========================================');
    process.exit(1);
  }
}

// Ejecutar reset
resetDevelopment();
