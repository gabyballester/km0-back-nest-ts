#!/usr/bin/env node

/**
 * Validación de cobertura estricta según umbrales configurados
 * FALLA si la cobertura no cumple los umbrales establecidos
 */

const { execSync } = require('child_process');

console.log(
  '📊 Ejecutando validación de cobertura según umbrales configurados...',
);

try {
  // Ejecutar tests con cobertura estricta
  execSync(
    'cross-env NODE_ENV=test jest --coverage --maxWorkers=2 --bail --passWithNoTests --silent',
    {
      stdio: 'inherit',
      env: {
        ...process.env,
        JEST_COVERAGE_THRESHOLD: JSON.stringify({
          global: {
            statements: 90,
            branches: 80,
            functions: 90,
            lines: 90,
          },
        }),
      },
    },
  );

  console.log('✅ Cobertura según umbrales configurados validada exitosamente');
} catch (error) {
  console.error('❌ Error en validación de cobertura:', error.message);
  console.error(
    '🚨 COBERTURA INSUFICIENTE: No se cumplen los umbrales establecidos',
  );
  process.exit(1);
}
