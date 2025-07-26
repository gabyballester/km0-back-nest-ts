#!/usr/bin/env node

/**
 * Validación estricta de archivos staged
 * Optimizado para pre-commit: rápido y eficiente
 * FALLA si encuentra cualquier error
 */

const { execSync } = require('child_process');

console.log('🔍 Ejecutando validación estricta de archivos staged...');

try {
  // 1. Ejecutar lint-staged (formato + type-check + eslint + tests rápidos)
  console.log('📋 Ejecutando lint-staged...');
  execSync('npx lint-staged', { stdio: 'inherit' });

  // 2. Validación de cobertura global (rápida)
  console.log('📊 Verificando cobertura global...');
  execSync('npm run validate:coverage:strict', { stdio: 'inherit' });

  console.log('✅ Validación staged estricta completada exitosamente');
} catch (error) {
  console.error('❌ Error en validación staged estricta:', error.message);
  console.error('🚨 COMMIT BLOQUEADO: Corrige los errores antes de continuar');
  process.exit(1);
}
