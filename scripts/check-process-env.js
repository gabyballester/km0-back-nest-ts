#!/usr/bin/env node

/**
 * Script para verificar que process.env solo se use en env.config.ts
 * Uso: node scripts/check-process-env.js
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const ALLOWED_FILE = 'src/config/env.config.ts';

function findProcessEnvUsage(dir, allowedFile) {
  const results = [];

  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.ts') || item.endsWith('.js')) {
        const relativePath = path.relative(process.cwd(), fullPath);

        // Skip allowed file - normalize paths for comparison
        const normalizedRelativePath = relativePath.replace(/\\/g, '/');
        const normalizedAllowedFile = allowedFile.replace(/\\/g, '/');

        if (normalizedRelativePath === normalizedAllowedFile) {
          console.log(`✅ Skipping allowed file: ${normalizedRelativePath}`);
          continue;
        }

        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          if (line.includes('process.env')) {
            results.push({
              file: relativePath,
              line: index + 1,
              content: line.trim(),
            });
          }
        });
      }
    }
  }

  scanDirectory(dir);
  return results;
}

function main() {
  console.log('🔍 Verificando uso de process.env...\n');

  const violations = findProcessEnvUsage(SRC_DIR, ALLOWED_FILE);

  if (violations.length === 0) {
    console.log('✅ No se encontraron usos incorrectos de process.env');
    console.log('✅ Solo se permite en:', ALLOWED_FILE);
    process.exit(0);
  } else {
    console.log('❌ Se encontraron usos incorrectos de process.env:');
    console.log('❌ Solo se permite en:', ALLOWED_FILE, '\n');

    violations.forEach(violation => {
      console.log(`📁 ${violation.file}:${violation.line}`);
      console.log(`   ${violation.content}\n`);
    });

    console.log(
      '🚨 REGLA VIOLADA: process.env solo debe usarse en env.config.ts',
    );
    console.log('💡 Solución: Usar ConfigService en lugar de process.env');
    console.log('📖 Ver documentación: docs/TESTING.md');

    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { findProcessEnvUsage };
