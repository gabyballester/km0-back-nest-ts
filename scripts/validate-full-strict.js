#!/usr/bin/env node

/**
 * Validación completa estricta del proyecto
 * Ejecuta todas las validaciones sin corregir errores automáticamente
 * FALLA si encuentra cualquier error
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Ejecutando validación completa estricta del proyecto...');

try {
  // 1. Verificar formato sin corregir
  console.log('📝 Verificando formato...');
  execSync('npm run format:check', { stdio: 'inherit' });

  // 2. Verificar tipos de todo el proyecto
  console.log('🔍 Verificando tipos...');
  execSync('npm run type-check', { stdio: 'inherit' });

  // 3. Linting estricto SIN corregir errores
  console.log('🧹 Ejecutando linting estricto...');
  execSync(
    'npx eslint "{src,apps,libs,test}/**/*.ts" --cache --max-warnings=0',
    { stdio: 'inherit' },
  );

  // 4. Tests completos con coverage estricta (100%)
  console.log('🧪 Ejecutando tests completos con cobertura estricta...');
  execSync('npm run validate:coverage:strict', { stdio: 'inherit' });

  // 5. Tests E2E
  console.log('🌐 Ejecutando tests E2E...');
  execSync('npm run test:e2e:full', { stdio: 'inherit' });

  console.log('✅ Validación completa estricta completada exitosamente');
} catch (error) {
  console.error('❌ Error en validación completa estricta:', error.message);
  console.error('🚨 PUSH BLOQUEADO: Corrige los errores antes de continuar');
  process.exit(1);
}
