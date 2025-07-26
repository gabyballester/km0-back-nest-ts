#!/usr/bin/env node

/**
 * Script de preparación multiplataforma
 * Solo ejecuta husky en entornos de desarrollo
 */

// Constantes para entornos
const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
};

// Constantes para variables de entorno
const ENV_KEYS = {
  NODE_ENV: 'NODE_ENV',
};

const { execSync } = require('child_process');

const nodeEnv = process.env[ENV_KEYS.NODE_ENV] ?? ENVIRONMENTS.DEVELOPMENT;

console.log(`🔧 Environment: ${nodeEnv}`);

// Solo ejecutar husky en entornos de desarrollo
if (nodeEnv !== ENVIRONMENTS.PRODUCTION) {
  try {
    console.log('🐕 Installing Husky hooks...');
    execSync('husky', { stdio: 'inherit' });
    console.log('✅ Husky hooks installed successfully');
  } catch (error) {
    console.warn('⚠️  Husky installation failed, but continuing...');
    console.warn('   This is normal if husky is not available');
  }
} else {
  console.log(
    '🚀 Production environment detected, skipping Husky installation',
  );
}

console.log('✅ Prepare script completed');
