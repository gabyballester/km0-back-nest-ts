#!/usr/bin/env node

/**
 * Script de verificación de seguridad para base de datos
 * Se ejecuta ANTES del deployment para verificar que es seguro proceder
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function safeExec(command, description) {
  try {
    console.log(`🔍 ${description}...`);
    execSync(command, {
      stdio: 'pipe',
      encoding: 'utf8',
    });
    console.log(`✅ ${description} - OK`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} - FALLÓ: ${error.message}`);
    return false;
  }
}

function verifyDatabaseSafety() {
  console.log('🛡️  Verificación de seguridad de base de datos...\n');

  const checks = [];

  // 1. Verificar que DATABASE_URL está configurada
  if (!process.env.DATABASE_URL) {
    console.error('❌ CRÍTICO: DATABASE_URL no está configurada');
    process.exit(1);
  }
  console.log('✅ DATABASE_URL configurada');

  // 2. Verificar que es una base de datos de producción
  if (process.env.NODE_ENV === 'production') {
    if (
      process.env.DATABASE_URL.includes('localhost') ||
      process.env.DATABASE_URL.includes('127.0.0.1')
    ) {
      console.error(
        '❌ CRÍTICO: DATABASE_URL apunta a localhost en producción',
      );
      process.exit(1);
    }
    console.log('✅ Base de datos de producción detectada');
  }

  // 3. Verificar conexión a la base de datos
  if (
    !safeExec(
      'npx prisma db execute --stdin',
      'Verificando conexión a la base de datos',
    )
  ) {
    console.error('❌ CRÍTICO: No se puede conectar a la base de datos');
    process.exit(1);
  }

  // 4. Verificar esquema de Prisma
  if (!safeExec('npx prisma validate', 'Validando esquema de Prisma')) {
    console.error('❌ CRÍTICO: Esquema de Prisma inválido');
    process.exit(1);
  }

  // 5. Verificar si hay migraciones
  const migrationsPath = path.join(process.cwd(), 'prisma', 'migrations');
  const hasMigrations =
    fs.existsSync(migrationsPath) &&
    fs
      .readdirSync(migrationsPath)
      .filter(dir => fs.statSync(path.join(migrationsPath, dir)).isDirectory())
      .length > 0;

  if (hasMigrations) {
    console.log('✅ Migraciones existentes encontradas');
  } else {
    console.log('⚠️  No hay migraciones - se usará baseline');
  }

  // 6. Verificar estado de la base de datos
  try {
    const result = execSync('npx prisma db execute --stdin', {
      input:
        "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';",
      encoding: 'utf8',
    });

    const tableCount = parseInt(result.match(/\d+/)?.[0] || '0');
    console.log(`📊 Tablas en la base de datos: ${tableCount}`);

    if (tableCount > 0) {
      console.log(
        '⚠️  Base de datos con datos existentes - se usará baseline seguro',
      );
    } else {
      console.log('✅ Base de datos vacía - se puede usar push');
    }
  } catch (error) {
    console.log('⚠️  No se pudo verificar el estado de la base de datos');
  }

  console.log(
    '\n🎉 Verificación de seguridad completada - Es seguro proceder con el deployment',
  );
}

// Solo ejecutar si se llama directamente
if (require.main === module) {
  verifyDatabaseSafety();
}

module.exports = { verifyDatabaseSafety };
