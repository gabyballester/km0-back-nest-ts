#!/usr/bin/env node

/**
 * Validación estricta de archivos staged
 * Ejecuta validaciones solo en archivos staged sin corregir errores automáticamente
 * FALLA si encuentra cualquier error de linting, type-check o tests de archivos staged
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Ejecutando validaciones estrictas en archivos staged...');

try {
  // 1. Verificar formato de archivos staged
  console.log('📝 Verificando formato de archivos staged...');
  execSync('npx lint-staged', { stdio: 'inherit' });

  // 2. Tests rápidos para archivos staged (solo si hay archivos .ts)
  console.log('🧪 Ejecutando tests rápidos para archivos staged...');
  execSync('npm run test:quick:staged', { stdio: 'inherit' });

  console.log(
    '✅ Validaciones estrictas de archivos staged completadas exitosamente',
  );
} catch (error) {
  console.error(
    '❌ Error en validaciones estrictas de archivos staged:',
    error.message,
  );
  console.error('🚨 COMMIT BLOQUEADO: Corrige los errores antes de continuar');
  process.exit(1);
}
