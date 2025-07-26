#!/usr/bin/env node

/**
 * Scripts constants
 * Centralized constants for Node.js scripts
 * Reuses constants from src/shared/constants/environment.ts
 */

// Constantes para entornos (reutilizando las de TypeScript)
const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
};

// Constantes para variables de entorno (reutilizando las de TypeScript)
const ENV_KEYS = {
  NODE_ENV: 'NODE_ENV',
  SAFE_DEPLOYMENT_MODE: 'SAFE_DEPLOYMENT_MODE',
  FORCE_COLOR: 'FORCE_COLOR',
};

// Constantes para comandos peligrosos
const DANGEROUS_COMMANDS = [
  'prisma migrate dev',
  'prisma migrate reset',
  'prisma db push --force-reset',
  'prisma db push --accept-data-loss',
];

// Constantes para mensajes
const MESSAGES = {
  PRODUCTION_WARNING: '⚠️  ADVERTENCIA: Operación en PRODUCCIÓN detectada',
  SAFETY_CHECK: '🛡️  Verificando que la operación sea SEGURA...',
  UNSAFE_DEPLOYMENT: '❌ ERROR: Deployment no seguro detectado',
  SAFE_DEPLOYMENT_MODE_REQUIRED: '🚨 Para operaciones en producción, usar:',
  SAFE_DEPLOYMENT_COMMAND: '   SAFE_DEPLOYMENT_MODE=true npm run db:prod',
  DEPLOYMENT_ERROR: 'Deployment no seguro en producción',
};

module.exports = {
  ENVIRONMENTS,
  ENV_KEYS,
  DANGEROUS_COMMANDS,
  MESSAGES,
};
