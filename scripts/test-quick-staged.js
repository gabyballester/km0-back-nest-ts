#!/usr/bin/env node

/**
 * Script para ejecutar tests rápidos solo en archivos staged
 * Uso: node scripts/test-quick-staged.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

try {
  console.log('🧪 Ejecutando tests rápidos para archivos staged...');

  // Obtener archivos TypeScript staged
  const stagedFiles = execSync(
    'git diff --cached --name-only --diff-filter=ACM',
    { encoding: 'utf8' },
  )
    .split('\n')
    .filter(
      file =>
        file.endsWith('.ts') &&
        !file.endsWith('.spec.ts') &&
        !file.endsWith('.test.ts'),
    )
    .filter(file => file.length > 0);

  if (stagedFiles.length === 0) {
    console.log('✅ No hay archivos TypeScript staged para testear');
    process.exit(0);
  }

  console.log(`📁 Archivos staged a testear: ${stagedFiles.length}`);

  // Encontrar archivos de test relacionados
  const testFiles = [];
  stagedFiles.forEach(file => {
    const baseName = path.basename(file, '.ts');
    const dirName = path.dirname(file);
    const specFile = path.join(dirName, `${baseName}.spec.ts`);

    if (fs.existsSync(specFile)) {
      testFiles.push(specFile);
    }
  });

  if (testFiles.length === 0) {
    console.log('✅ No se encontraron archivos de test relacionados');
    process.exit(0);
  }

  console.log(`🧪 Archivos de test relacionados: ${testFiles.length}`);

  // Ejecutar tests específicos si existen, sino todos los tests rápidos
  if (testFiles.length > 0) {
    const testPattern = testFiles.map(file => `"${file}"`).join(' ');
    execSync(
      `cross-env NODE_ENV=test jest --maxWorkers=4 --bail --passWithNoTests --silent --no-coverage ${testPattern}`,
      { stdio: 'inherit' },
    );
  } else {
    // Fallback: ejecutar todos los tests rápidos
    execSync(
      'cross-env NODE_ENV=test jest --maxWorkers=4 --bail --passWithNoTests --silent --no-coverage',
      { stdio: 'inherit' },
    );
  }

  console.log('✅ Tests rápidos para archivos staged completados exitosamente');
  process.exit(0);
} catch (error) {
  console.error('❌ Tests rápidos para archivos staged fallaron');
  process.exit(1);
}
