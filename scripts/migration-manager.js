#!/usr/bin/env node

/**
 * Gestor de Migraciones Robusto para Drizzle ORM
 * Versión: 1.0 - Gestión inteligente de migraciones
 * Última actualización: $(date)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Función helper para obtener variables de entorno
function getEnvVar(key, defaultValue = '') {
  return process.env[key] || defaultValue;
}

// Función helper para verificar el entorno
function getEnvironment() {
  return getEnvVar('NODE_ENV', 'development');
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

// Función para listar migraciones
function listMigrations() {
  try {
    const migrationsPath = path.join(process.cwd(), 'drizzle');
    if (!fs.existsSync(migrationsPath)) {
      console.log('📁 No hay directorio de migraciones');
      return [];
    }

    const sqlFiles = fs
      .readdirSync(migrationsPath)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log('📋 Migraciones disponibles:');
    if (sqlFiles.length === 0) {
      console.log('   - No hay migraciones');
    } else {
      sqlFiles.forEach((file, index) => {
        const filePath = path.join(migrationsPath, file);
        const stats = fs.statSync(filePath);
        console.log(`   ${index + 1}. ${file} (${stats.size} bytes)`);
      });
    }

    return sqlFiles;
  } catch (error) {
    console.log('❌ Error listando migraciones:', error.message);
    return [];
  }
}

// Función para generar migraciones
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

// Función para aplicar migraciones
function applyMigrations() {
  try {
    console.log('🔄 Aplicando migraciones...');

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

// Función para resetear migraciones
function resetMigrations() {
  try {
    console.log('🔄 Reseteando migraciones...');

    const migrationsPath = path.join(process.cwd(), 'drizzle');
    if (fs.existsSync(migrationsPath)) {
      fs.rmSync(migrationsPath, { recursive: true, force: true });
      console.log('✅ Directorio de migraciones eliminado');
    }

    // Generar migración inicial
    if (generateMigrations()) {
      console.log('✅ Migración inicial generada');
      return true;
    } else {
      throw new Error('No se pudo generar la migración inicial');
    }
  } catch (error) {
    console.log('❌ Error reseteando migraciones:', error.message);
    return false;
  }
}

// Función para validar estado de migraciones
function validateMigrationState() {
  try {
    console.log('🔍 Validando estado de migraciones...');

    const hasProjectMigrations = hasMigrations();
    const hasPending = hasPendingMigrations();

    console.log('📊 Estado de migraciones:');
    console.log(
      `   - Migraciones en proyecto: ${hasProjectMigrations ? 'SÍ' : 'NO'}`,
    );
    console.log(`   - Migraciones pendientes: ${hasPending ? 'SÍ' : 'NO'}`);

    if (hasProjectMigrations && !hasPending) {
      console.log('✅ Estado válido: Todas las migraciones aplicadas');
      return true;
    } else if (!hasProjectMigrations) {
      console.log('⚠️  Estado: No hay migraciones en el proyecto');
      return false;
    } else {
      console.log('⚠️  Estado: Hay migraciones pendientes');
      return false;
    }
  } catch (error) {
    console.log('❌ Error validando estado:', error.message);
    return false;
  }
}

// Función principal
function main() {
  const command = process.argv[2];
  const environment = getEnvironment();

  console.log('🚀 Gestor de Migraciones Robusto para Drizzle ORM');
  console.log(`🌍 Entorno: ${environment}`);

  switch (command) {
    case 'status':
      console.log('\n📊 Estado de Migraciones:');
      listMigrations();
      validateMigrationState();
      break;

    case 'generate':
      console.log('\n📝 Generando Migraciones:');
      generateMigrations();
      break;

    case 'apply':
      console.log('\n🔄 Aplicando Migraciones:');
      applyMigrations();
      break;

    case 'reset':
      console.log('\n🔄 Reseteando Migraciones:');
      resetMigrations();
      break;

    case 'validate':
      console.log('\n🔍 Validando Estado:');
      validateMigrationState();
      break;

    case 'full':
      console.log('\n🎯 Workflow Completo:');
      console.log('1. Validando estado actual...');
      validateMigrationState();

      console.log('\n2. Generando migraciones si es necesario...');
      if (!hasMigrations()) {
        generateMigrations();
      }

      console.log('\n3. Aplicando migraciones pendientes...');
      applyMigrations();

      console.log('\n4. Validando estado final...');
      validateMigrationState();
      break;

    default:
      console.log('\n📖 Uso del Gestor de Migraciones:');
      console.log('  npm run migration:status    # Ver estado de migraciones');
      console.log('  npm run migration:generate  # Generar migraciones');
      console.log('  npm run migration:apply     # Aplicar migraciones');
      console.log('  npm run migration:reset     # Resetear migraciones');
      console.log('  npm run migration:validate  # Validar estado');
      console.log('  npm run migration:full      # Workflow completo');
      break;
  }
}

// Ejecutar función principal
main();
