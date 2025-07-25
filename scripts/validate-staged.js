#!/usr/bin/env node

/**
 * Script para ejecutar validaciones solo en archivos staged
 * Uso: node scripts/validate-staged.js
 */

const { execSync } = require('child_process');

try {
  console.log('🔍 Ejecutando validaciones en archivos staged...');

  // Ejecutar lint-staged que ya maneja archivos staged
  execSync('npx lint-staged', { stdio: 'inherit' });

  console.log('✅ Validaciones de archivos staged completadas exitosamente');
  process.exit(0);
} catch (error) {
  console.error('❌ Validaciones de archivos staged fallaron');
  process.exit(1);
}
