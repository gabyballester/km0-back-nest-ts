#!/usr/bin/env node

/**
 * Script para configurar archivos de entorno
 * Uso: node scripts/setup-env.js
 *
 * ESTRATEGIA:
 * - .env: Variables base para PRODUCCIÓN
 * - .env.development: Solo variables específicas de desarrollo
 * - .env.test: Solo variables específicas de testing
 */

const fs = require('fs');
const path = require('path');

function setupEnvironment() {
  try {
    console.log('🔧 Configurando archivos de entorno...\n');

    const envFiles = [
      {
        name: '.env',
        example: 'env.example',
        description: 'Variables base para PRODUCCIÓN',
      },
      {
        name: '.env.development',
        example: 'env.development.example',
        description: 'Variables específicas de desarrollo (sobrescribe .env)',
      },
      {
        name: '.env.test',
        example: 'env.test.example',
        description: 'Variables específicas de testing (sobrescribe .env)',
      },
    ];

    let createdCount = 0;
    let existingCount = 0;
    let missingCount = 0;

    envFiles.forEach(({ name, example, description }) => {
      try {
        const examplePath = path.join(process.cwd(), example);
        const envPath = path.join(process.cwd(), name);

        if (fs.existsSync(examplePath) && !fs.existsSync(envPath)) {
          fs.copyFileSync(examplePath, envPath);
          console.log(`✅ Creado: ${name} (${description})`);
          createdCount++;
        } else if (fs.existsSync(envPath)) {
          console.log(`⚠️  Ya existe: ${name}`);
          existingCount++;
        } else {
          console.log(`❌ No se encontró: ${example}`);
          missingCount++;
        }
      } catch (error) {
        console.error(`❌ Error procesando ${name}:`, error.message);
        missingCount++;
      }
    });

    console.log('\n📊 Resumen:');
    console.log(`✅ Creados: ${createdCount}`);
    console.log(`⚠️  Existentes: ${existingCount}`);
    console.log(`❌ Faltantes: ${missingCount}`);

    console.log('\n📋 Estrategia de configuración de entornos:');
    console.log('✅ .env - Variables base para PRODUCCIÓN');
    console.log('✅ .env.development - Sobrescribe variables para desarrollo');
    console.log('✅ .env.test - Sobrescribe variables para testing');

    console.log('\n🔗 URLs configuradas:');
    console.log(
      '- Desarrollo: postgresql://postgres:admin@localhost:5432/km0_db_dev',
    );
    console.log(
      '- Testing: postgresql://postgres:admin@localhost:5432/km0_db_test',
    );
    console.log(
      '- Producción: postgresql://user:password@host:port/database_name',
    );

    console.log('\n🚀 Comandos disponibles:');
    console.log('npm run start:dev      # Desarrollo con hot reload');
    console.log('npm run start:test     # Testing');
    console.log('npm run db:dev         # Sincronizar DB desarrollo');
    console.log('npm run db:test        # Sincronizar DB testing');
    console.log('npm run db:prod        # Sincronizar DB producción');
    console.log('npm run db:studio:dev  # Ver DB desarrollo');
    console.log('npm run db:studio:test # Ver DB testing');
    console.log('npm run db:studio:prod # Ver DB producción');

    console.log('\n📖 NestJS ConfigModule:');
    console.log('✅ Carga automáticamente .env según NODE_ENV');
    console.log('✅ Variables específicas sobrescriben las base');
    console.log('✅ Validación con Zod en tiempo de ejecución');
    console.log('✅ Orden de carga: .env → .env.{NODE_ENV}');

    if (missingCount > 0) {
      console.log('\n⚠️  Algunos archivos de ejemplo no se encontraron');
      console.log('   Verifica que existan los archivos env.*.example');
    }

    return { createdCount, existingCount, missingCount };
  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
    throw error;
  }
}

function main() {
  try {
    setupEnvironment();
    console.log('\n✅ Configuración de entorno completada');
  } catch (error) {
    console.error('❌ Error en la configuración:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { setupEnvironment, main };
