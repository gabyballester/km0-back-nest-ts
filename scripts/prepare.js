#!/usr/bin/env node

/**
 * Script de preparación multiplataforma
 * Solo ejecuta husky en entornos de desarrollo
 */

const { execSync } = require('child_process');
const { ENVIRONMENTS, ENV_KEYS } = require('./constants');

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
