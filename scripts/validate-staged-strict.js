#!/usr/bin/env node

/**
 * Validación estricta de archivos staged
 * Ejecuta validaciones sin corregir errores automáticamente
 * FALLA si encuentra cualquier error de linting, type-check o tests
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Ejecutando validaciones estrictas en archivos staged...');

try {
  // 1. Verificar formato sin corregir
  console.log('📝 Verificando formato...');
  execSync('npm run format:check', { stdio: 'inherit' });

  // 2. Verificar tipos de archivos staged
  console.log('🔍 Verificando tipos...');
  execSync('npm run type-check:staged', { stdio: 'inherit' });

  // 3. Linting estricto SIN corregir errores
  console.log('🧹 Ejecutando linting estricto...');
  execSync(
    'npx eslint "{src,apps,libs,test}/**/*.ts" --cache --max-warnings=0',
    { stdio: 'inherit' },
  );

  // 4. Tests mínimos para asegurar funcionalidad básica
  console.log('🧪 Ejecutando tests mínimos...');
  execSync('npm run test:quick', { stdio: 'inherit' });

  console.log('✅ Validaciones estrictas completadas exitosamente');
} catch (error) {
  console.error('❌ Error en validaciones estrictas:', error.message);
  console.error('🚨 COMMIT BLOQUEADO: Corrige los errores antes de continuar');
  process.exit(1);
}
