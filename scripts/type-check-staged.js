#!/usr/bin/env node

/**
 * Script para ejecutar type-check en todo el proyecto
 * Uso: node scripts/type-check-staged.js
 */

const { execSync } = require('child_process');

try {
  console.log('🔍 Ejecutando type-check en todo el proyecto...');
  execSync('tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ Type-check completado exitosamente');
  process.exit(0);
} catch (error) {
  console.error('❌ Type-check falló');
  process.exit(1);
}
