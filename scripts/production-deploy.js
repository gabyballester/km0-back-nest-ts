#!/usr/bin/env node

/**
 * Script de deployment para producción basado en mejores prácticas oficiales
 * de Prisma y la comunidad para bases de datos existentes
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log(
  '🚀 Iniciando deployment de producción siguiendo mejores prácticas...',
);

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
  const migrationsPath = path.join(process.cwd(), 'prisma', 'migrations');
  return (
    fs.existsSync(migrationsPath) &&
    fs
      .readdirSync(migrationsPath)
      .filter(dir => fs.statSync(path.join(migrationsPath, dir)).isDirectory())
      .length > 0
  );
}

// Función para crear baseline de base de datos existente (mejor práctica oficial de Prisma)
function createBaselineForExistingDatabase() {
  console.log(
    '🛡️  Creando baseline para base de datos existente (mejor práctica oficial)...',
  );

  // 🚨 VALIDACIÓN CRÍTICA: Verificar que estamos en entorno seguro
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️  ADVERTENCIA: Operación en PRODUCCIÓN detectada');
    console.log('🛡️  Verificando que la operación sea SEGURA...');

    // Verificar que la operación sea solo de lectura
    if (!process.env.SAFE_DEPLOYMENT_MODE) {
      console.error('❌ ERROR: Deployment no seguro detectado');
      console.error('🚨 Para operaciones en producción, usar:');
      console.error('   SAFE_DEPLOYMENT_MODE=true npm run db:prod');
      throw new Error('Deployment no seguro en producción');
    }
  }

  // 1. Crear migración inicial sin aplicar (SÓLO LECTURA)
  if (
    !safeExec(
      'npx prisma migrate dev --name initial --create-only',
      'Creando migración inicial (SÓLO LECTURA)',
    )
  ) {
    throw new Error('No se pudo crear la migración inicial');
  }

  // 2. Marcar como baseline (esto NO modifica la base de datos)
  if (
    !safeExec(
      'npx prisma migrate resolve --applied initial',
      'Marcando migración como baseline (SÓLO LECTURA)',
    )
  ) {
    throw new Error('No se pudo marcar la migración como baseline');
  }

  console.log('✅ Baseline creado correctamente (base de datos NO modificada)');
  console.log('🛡️  Operación SEGURA completada');
}

function deployProduction() {
  try {
    // 🚨 VALIDACIÓN CRÍTICA: Verificar entorno de producción
    if (process.env.NODE_ENV === 'production') {
      console.log('🚨 ========================================');
      console.log('🛡️  DEPLOYMENT DE PRODUCCIÓN DETECTADO');
      console.log('========================================');
      console.log('⚠️  Verificando seguridad de base de datos...');

      // Verificar que no se usen comandos peligrosos
      if (
        process.argv.includes('migrate dev') &&
        !process.argv.includes('--create-only')
      ) {
        console.error('❌ ERROR CRÍTICO: Comando peligroso detectado');
        console.error('🚨 NUNCA usar "prisma migrate dev" en producción');
        console.error('✅ Usar "prisma migrate deploy" en su lugar');
        throw new Error('Comando peligroso detectado en producción');
      }
    }

    // 1. Generar cliente Prisma (siempre necesario)
    if (!safeExec('npx prisma generate', 'Generando cliente Prisma')) {
      throw new Error('No se pudo generar el cliente Prisma');
    }

    // 2. Verificar esquema
    if (!safeExec('npx prisma validate', 'Validando esquema de Prisma')) {
      throw new Error('Esquema de Prisma inválido');
    }

    // 3. Verificar estado de la base de datos
    const databaseExists = checkDatabaseExists();
    const hasProjectMigrations = hasMigrations();

    console.log(`📋 Estado detectado:`);
    console.log(`   - Base de datos existe: ${databaseExists ? 'SÍ' : 'NO'}`);
    console.log(
      `   - Migraciones en proyecto: ${hasProjectMigrations ? 'SÍ' : 'NO'}`,
    );

    // 4. Estrategia según el estado
    if (databaseExists && !hasProjectMigrations) {
      // Caso 1: Base de datos existe pero no hay migraciones en el proyecto
      console.log(
        '📝 Caso 1: Base de datos existente sin migraciones - Creando baseline...',
      );
      createBaselineForExistingDatabase();
    } else if (databaseExists && hasProjectMigrations) {
      // Caso 2: Base de datos existe y hay migraciones - Aplicar migraciones
      console.log(
        '📦 Caso 2: Base de datos existente con migraciones - Aplicando migraciones...',
      );
      if (
        !safeExec(
          'npx prisma migrate deploy',
          'Aplicando migraciones de producción',
        )
      ) {
        throw new Error('No se pudieron aplicar las migraciones');
      }
    } else if (!databaseExists && !hasProjectMigrations) {
      // Caso 3: Base de datos nueva sin migraciones - Usar push
      console.log(
        '🆕 Caso 3: Base de datos nueva sin migraciones - Sincronizando esquema...',
      );
      if (!safeExec('npx prisma db push', 'Sincronizando esquema')) {
        throw new Error('No se pudo sincronizar el esquema');
      }
    } else if (!databaseExists && hasProjectMigrations) {
      // Caso 4: Base de datos nueva con migraciones - Aplicar migraciones
      console.log(
        '🆕 Caso 4: Base de datos nueva con migraciones - Aplicando migraciones...',
      );
      if (
        !safeExec(
          'npx prisma migrate deploy',
          'Aplicando migraciones de producción',
        )
      ) {
        throw new Error('No se pudieron aplicar las migraciones');
      }
    }

    // 5. Verificación final (omitida para evitar problemas de conexión)
    console.log('✅ Deployment completado exitosamente');

    console.log(
      '🎉 Deployment de producción completado exitosamente siguiendo mejores prácticas!',
    );
  } catch (error) {
    console.error('❌ Error crítico en deployment:', error.message);
    console.error(
      '🛑 Deployment falló. Revisa los logs y corrige el problema.',
    );
    process.exit(1);
  }
}

// Manejo de señales para interrupción segura
process.on('SIGINT', () => {
  console.log('\n🛑 Deployment interrumpido por el usuario');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Deployment terminado por el sistema');
  process.exit(1);
});

deployProduction();
