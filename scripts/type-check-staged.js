#!/usr/bin/env node

/**
 * Script para ejecutar type-check solo en archivos staged
 * Uso: node scripts/type-check-staged.js
 */

const { execSync } = require('child_process');

try {
  console.log('🔍 Ejecutando type-check en archivos staged...');

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
    console.log('✅ No hay archivos TypeScript staged para validar');
    process.exit(0);
  }

  console.log(`📁 Archivos staged a validar: ${stagedFiles.length}`);

  // Ejecutar type-check solo en archivos staged usando la configuración completa
  execSync('tsc --noEmit', { stdio: 'inherit' });

  console.log('✅ Type-check de archivos staged completado exitosamente');
  process.exit(0);
} catch (error) {
  console.error('❌ Type-check de archivos staged falló');
  process.exit(1);
}
