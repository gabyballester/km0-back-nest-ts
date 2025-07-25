#!/usr/bin/env node

/**
 * Script SEGURO para deployment de base de datos
 * Maneja bases de datos existentes sin perder datos
 * Incluye validaciones y verificaciones de seguridad
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Función para ejecutar comandos de forma segura
function safeExec(command, description) {
  try {
    console.log(`🔄 ${description}...`);
    execSync(command, {
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: '1' }
    });
    console.log(`✅ ${description} completado`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} falló: ${error.message}`);
    return false;
  }
}

// Función para verificar si la base de datos está vacía
function isDatabaseEmpty() {
  try {
    console.log('🔍 Verificando estado de la base de datos...');
    const result = execSync('npx prisma db execute --stdin', {
      input: 'SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = \'public\';',
      encoding: 'utf8'
    });

    const tableCount = parseInt(result.match(/\d+/)?.[0] || '0');
    console.log(`📊 Tablas encontradas en la base de datos: ${tableCount}`);

    return tableCount === 0;
  } catch (error) {
    console.log('⚠️  No se pudo verificar el estado de la base de datos, asumiendo que no está vacía');
    return false;
  }
}

// Función para verificar si hay migraciones
function hasMigrations() {
  const migrationsPath = path.join(process.cwd(), 'prisma', 'migrations');
  return fs.existsSync(migrationsPath) &&
         fs.readdirSync(migrationsPath).filter(dir =>
           fs.statSync(path.join(migrationsPath, dir)).isDirectory()
         ).length > 0;
}

// Función para crear baseline seguro
function createSafeBaseline() {
  console.log('🛡️  Creando baseline seguro para base de datos existente...');

  // 1. Verificar que el esquema es válido
  if (!safeExec('npx prisma validate', 'Validando esquema de Prisma')) {
    throw new Error('Esquema de Prisma inválido');
  }

  // 2. Crear migración inicial sin aplicar
  if (!safeExec('npx prisma migrate dev --name initial --create-only', 'Creando migración inicial')) {
    throw new Error('No se pudo crear la migración inicial');
  }

  // 3. Verificar que la migración se creó correctamente
  if (!hasMigrations()) {
    throw new Error('La migración inicial no se creó correctamente');
  }

  // 4. Marcar como baseline (esto NO modifica la base de datos)
  if (!safeExec('npx prisma migrate resolve --applied initial', 'Marcando migración como baseline')) {
    throw new Error('No se pudo marcar la migración como baseline');
  }

  console.log('✅ Baseline seguro completado');
}

async function deployDatabase() {
  console.log('🗄️  Iniciando deployment SEGURO de base de datos...\n');

  try {
    // 1. Verificar que estamos en producción
    if (process.env.NODE_ENV !== 'production') {
      console.log('⚠️  No estamos en producción, usando modo seguro');
    }

    // 2. Generar cliente Prisma
    if (!safeExec('npx prisma generate', 'Generando cliente Prisma')) {
      throw new Error('No se pudo generar el cliente Prisma');
    }

    // 3. Verificar esquema
    if (!safeExec('npx prisma validate', 'Validando esquema de Prisma')) {
      throw new Error('Esquema de Prisma inválido');
    }

    // 4. Verificar si hay migraciones existentes
    if (hasMigrations()) {
      console.log('📦 Aplicando migraciones existentes...');
      if (!safeExec('npx prisma migrate deploy', 'Aplicando migraciones')) {
        throw new Error('No se pudieron aplicar las migraciones');
      }
    } else {
      console.log('🔄 No hay migraciones, verificando estado de la base de datos...');

      // 5. Verificar si la base de datos está vacía
      const isEmpty = isDatabaseEmpty();

      if (isEmpty) {
        console.log('📝 Base de datos vacía, sincronizando esquema...');
        if (!safeExec('npx prisma db push --accept-data-loss', 'Sincronizando esquema')) {
          throw new Error('No se pudo sincronizar el esquema');
        }
      } else {
        console.log('🛡️  Base de datos con datos existentes, creando baseline seguro...');
        createSafeBaseline();
      }
    }

    // 6. Verificación final
    console.log('🔍 Verificación final del deployment...');
    if (!safeExec('npx prisma db execute --stdin', 'Verificando conexión a la base de datos')) {
      throw new Error('No se pudo verificar la conexión a la base de datos');
    }

    console.log('🎉 Deployment SEGURO de base de datos completado exitosamente!');

  } catch (error) {
    console.error('❌ Error CRÍTICO en deployment de base de datos:', error.message);
    console.error('🛑 Deployment falló por seguridad. Revisa los logs y corrige el problema.');
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

deployDatabase();
