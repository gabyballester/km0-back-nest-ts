#!/usr/bin/env node

/**
 * Script inteligente para deployment de base de datos
 * Maneja bases de datos existentes sin perder datos
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function deployDatabase() {
  console.log('🗄️  Iniciando deployment de base de datos...\n');

  try {
    // 1. Generar cliente Prisma
    console.log('🔧 Generando cliente Prisma...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Cliente Prisma generado\n');

    // 2. Verificar si hay migraciones
    const migrationsPath = path.join(process.cwd(), 'prisma', 'migrations');
    const hasMigrations =
      fs.existsSync(migrationsPath) &&
      fs.readdirSync(migrationsPath).length > 0;

    if (hasMigrations) {
      console.log('📦 Aplicando migraciones existentes...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Migraciones aplicadas\n');
    } else {
      console.log('🔄 No hay migraciones, sincronizando esquema...');

      // Intentar push primero (para bases de datos nuevas)
      try {
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
        console.log('✅ Esquema sincronizado con push\n');
      } catch (error) {
        console.log('⚠️  Push falló, intentando crear migración inicial...');

        // Crear migración inicial
        execSync('npx prisma migrate dev --name initial --create-only', {
          stdio: 'inherit',
        });
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        console.log('✅ Migración inicial creada y aplicada\n');
      }
    }

    console.log('🎉 Deployment de base de datos completado exitosamente!');
  } catch (error) {
    console.error('❌ Error en deployment de base de datos:', error.message);
    process.exit(1);
  }
}

deployDatabase();
