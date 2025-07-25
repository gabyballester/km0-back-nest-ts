#!/usr/bin/env node

/**
 * Script para ejecutar tests rápidos en todo el proyecto
 * Uso: node scripts/test-quick-staged.js
 */

const { execSync } = require('child_process');

try {
  console.log('🧪 Ejecutando tests rápidos en todo el proyecto...');
  execSync(
    'cross-env NODE_ENV=test jest --maxWorkers=4 --bail --passWithNoTests --silent --no-coverage',
    { stdio: 'inherit' },
  );
  console.log('✅ Tests rápidos completados exitosamente');
  process.exit(0);
} catch (error) {
  console.error('❌ Tests rápidos fallaron');
  process.exit(1);
}
