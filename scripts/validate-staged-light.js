#!/usr/bin/env node

/**
 * Validación ligera de archivos staged
 * Ejecuta validaciones rápidas: format, type-check, lint y tests mínimos
 * Incluye tests rápidos para asegurar funcionalidad básica
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Ejecutando validaciones ligeras en archivos staged...');

try {
  // 1. Formatear archivos staged
  console.log('📝 Formateando archivos...');
  execSync('npm run format', { stdio: 'inherit' });

  // 2. Verificar tipos de archivos staged
  console.log('🔍 Verificando tipos...');
  execSync('npm run type-check:staged', { stdio: 'inherit' });

  // 3. Linting de archivos staged
  console.log('🧹 Ejecutando linting...');
  execSync('npm run lint', { stdio: 'inherit' });

  // 4. Tests mínimos para asegurar funcionalidad básica
  console.log('🧪 Ejecutando tests mínimos...');
  execSync('npm run test:quick', { stdio: 'inherit' });

  console.log('✅ Validaciones ligeras completadas exitosamente');
} catch (error) {
  console.error('❌ Error en validaciones ligeras:', error.message);
  process.exit(1);
}
