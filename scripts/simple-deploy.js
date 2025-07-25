#!/usr/bin/env node

/**
 * Script SIMPLE para deployment de base de datos
 * Solo lo esencial: generar cliente y manejar migraciones
 */

const { execSync } = require('child_process');

console.log('🗄️  Deployment simple de base de datos...');

try {
  // 1. Generar cliente Prisma
  console.log('🔧 Generando cliente Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // 2. Intentar aplicar migraciones (si existen)
  try {
    console.log('📦 Aplicando migraciones...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Migraciones aplicadas');
  } catch (error) {
    console.log('⚠️  No hay migraciones o error, usando push...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Esquema sincronizado');
  }

  console.log('🎉 Deployment completado!');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
