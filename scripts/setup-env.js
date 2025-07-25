#!/usr/bin/env node

/**
 * Script para configurar archivos de entorno
 * Uso: node scripts/setup-env.js
 */

const fs = require('fs');
const path = require('path');

function setupEnvironment() {
  console.log('🔧 Configurando archivos de entorno...\n');

  const envFiles = [
    {
      name: '.env',
      example: 'env.example',
      description: 'Variables comunes para todos los entornos',
    },
    {
      name: '.env.development',
      example: 'env.development.example',
      description: 'Desarrollo local - PostgreSQL (pgAdmin)',
    },
    {
      name: '.env.test',
      example: 'env.test.example',
      description: 'Testing - PostgreSQL (pgAdmin)',
    },
    {
      name: '.env.production',
      example: 'env.production.example',
      description: 'Producción - PostgreSQL (Render)',
    },
  ];

  envFiles.forEach(({ name, example, description }) => {
    const examplePath = path.join(process.cwd(), example);
    const envPath = path.join(process.cwd(), name);

    if (fs.existsSync(examplePath) && !fs.existsSync(envPath)) {
      fs.copyFileSync(examplePath, envPath);
      console.log(`✅ Creado: ${name} (${description})`);
    } else if (fs.existsSync(envPath)) {
      console.log(`⚠️  Ya existe: ${name}`);
    } else {
      console.log(`❌ No se encontró: ${example}`);
    }
  });

  console.log('\n📋 Configuración de entornos (NestJS ConfigModule):');
  console.log('✅ .env - Variables base para todos los entornos');
  console.log('✅ .env.development - Sobrescribe variables para desarrollo');
  console.log('✅ .env.test - Sobrescribe variables para testing');
  console.log('✅ .env.production - Sobrescribe variables para producción');

  console.log('\n🔗 URLs configuradas:');
  console.log(
    '- Desarrollo: postgresql://postgres:admin@localhost:5432/km0_db_dev',
  );
  console.log(
    '- Testing: postgresql://postgres:admin@localhost:5432/km0_db_test',
  );
  console.log(
    '- Producción: postgresql://gabi:...@dpg-d21b6hmmcj7s73c4atcg-a.oregon-postgres.render.com/km0_db',
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
}

if (require.main === module) {
  setupEnvironment();
}

module.exports = { setupEnvironment };
