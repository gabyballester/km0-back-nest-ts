#!/usr/bin/env node

/**
 * Validación de cobertura al 100% (aspiración máxima)
 * FALLA si la cobertura no es 100% en todas las métricas
 * USO: Para validaciones especiales cuando se quiera aspirar al máximo
 */

const { execSync } = require('child_process');

console.log(
  '📊 Ejecutando validación de cobertura al 100% (aspiración máxima)...',
);

try {
  // Ejecutar tests con cobertura 100%
  execSync(
    'cross-env NODE_ENV=test jest --coverage --maxWorkers=2 --bail --passWithNoTests --silent',
    {
      stdio: 'inherit',
      env: {
        ...process.env,
        JEST_COVERAGE_THRESHOLD: JSON.stringify({
          global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100,
          },
        }),
      },
    },
  );

  console.log('✅ Cobertura al 100% validada exitosamente');
} catch (error) {
  console.error('❌ Error en validación de cobertura 100%:', error.message);
  console.error(
    '🚨 COBERTURA INSUFICIENTE: Se requiere 100% en todas las métricas',
  );
  process.exit(1);
}
