#!/usr/bin/env node

/**
 * Script para verificar que process.env solo se use en env.config.ts
 * Uso: node scripts/check-process-env.js
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const ALLOWED_FILE = 'src/config/env.config.ts';
const EXCLUDED_PATTERNS = [
  'src/config/env.config.ts',
  'test/',
  '.spec.ts',
  '.e2e-spec.ts',
  '/dist/',
  '/node_modules/',
  '/generated/',
  '/coverage/',
  '/.jest-cache/',
];

function findProcessEnvUsage(dir, allowedFile) {
  const results = [];

  function scanDirectory(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        try {
          const fullPath = path.join(currentDir, item);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            scanDirectory(fullPath);
          } else if (item.endsWith('.ts') || item.endsWith('.js')) {
            const relativePath = path.relative(process.cwd(), fullPath);

            // Skip excluded files and patterns - normalize paths for comparison
            const normalizedRelativePath = relativePath.replace(/\\/g, '/');
            const normalizedAllowedFile = allowedFile.replace(/\\/g, '/');

            // Check if file matches any excluded pattern
            const isExcluded = EXCLUDED_PATTERNS.some(pattern => {
              if (pattern.endsWith('/')) {
                return normalizedRelativePath.includes(pattern);
              }
              return (
                normalizedRelativePath === pattern ||
                normalizedRelativePath.endsWith(pattern)
              );
            });

            if (
              normalizedRelativePath === normalizedAllowedFile ||
              isExcluded
            ) {
              continue;
            }

            try {
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
            } catch (readError) {
              console.warn(
                `⚠️  No se pudo leer archivo: ${relativePath} - ${readError.message}`,
              );
            }
          }
        } catch (itemError) {
          console.warn(
            `⚠️  Error procesando item: ${item} - ${itemError.message}`,
          );
        }
      }
    } catch (dirError) {
      console.warn(
        `⚠️  Error leyendo directorio: ${currentDir} - ${dirError.message}`,
      );
    }
  }

  scanDirectory(dir);
  return results;
}

function main() {
  try {
    console.log('🔍 Verificando uso de process.env...\n');

    // Verificar que el directorio src existe
    if (!fs.existsSync(SRC_DIR)) {
      console.error('❌ Error: Directorio src no encontrado');
      process.exit(1);
    }

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
  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { findProcessEnvUsage, main };
