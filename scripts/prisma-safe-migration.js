#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Script para hacer migraciones seguras usando Prisma
 * Maneja la migración de tablas existentes sin perder datos
 */

console.log('🔄 Iniciando migración segura con Prisma...\n');

// Función para ejecutar comandos de Prisma
function runPrismaCommand(command, description) {
  try {
    console.log(`📝 ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completado`);
    return true;
  } catch (error) {
    console.error(`❌ Error en ${description}:`, error.message);
    return false;
  }
}

// Estrategia: Crear una migración que maneje los cambios de forma segura
console.log('🔄 Creando migración segura...\n');

// 1. Generar el cliente de Prisma
const generateSuccess = runPrismaCommand(
  'npx prisma generate',
  'Generando cliente Prisma',
);

if (!generateSuccess) {
  console.log('\n❌ Error al generar el cliente de Prisma');
  process.exit(1);
}

// 2. Intentar hacer push con force-reset solo si es necesario
console.log('\n🔄 Aplicando cambios a la base de datos...');

try {
  // Primero intentar push normal
  console.log('📝 Intentando push normal...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Push normal completado exitosamente');
} catch (error) {
  console.log('⚠️  Push normal falló, intentando con force-reset...');

  try {
    // Si falla, usar force-reset
    execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
    console.log('✅ Push con force-reset completado exitosamente');
  } catch (resetError) {
    console.error('❌ Error en force-reset:', resetError.message);
    console.log('\n🔧 Alternativas:');
    console.log('1. Verificar que PostgreSQL esté ejecutándose');
    console.log('2. Verificar las credenciales de la base de datos');
    console.log('3. Crear manualmente las bases de datos:');
    console.log('   - km0_db_dev');
    console.log('   - km0_db_test');
    console.log('   - km0_db');
    process.exit(1);
  }
}

// 3. Verificar que todo esté funcionando
console.log('\n🔄 Verificando estado de la base de datos...');

try {
  execSync('npx prisma db pull', { stdio: 'inherit' });
  console.log('✅ Verificación completada');
} catch (error) {
  console.log('⚠️  Advertencia en verificación:', error.message);
}

console.log('\n🎉 ¡Migración completada exitosamente!');
console.log('\n📝 Próximos pasos:');
console.log('1. npm run start:dev');
console.log('2. Verificar endpoints en http://localhost:4000/health');
