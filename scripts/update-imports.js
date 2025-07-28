#!/usr/bin/env node

/**
 * Script para actualizar imports relativos a alias
 * Reemplaza imports relativos con alias @/ en archivos TypeScript
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuración de alias
const ALIASES = {
  '@/*': 'src/*',
  '@/config/*': 'src/config/*',
  '@/shared/*': 'src/shared/*',
  '@/modules/*': 'src/modules/*',
  '@/infrastructure/*': 'src/infrastructure/*',
  '@/health/*': 'src/health/*',
  '@/test/*': 'test/*',
  '@/docs/*': 'docs/*',
  '@/scripts/*': 'scripts/*',
};

// Patrones de imports relativos a reemplazar
const RELATIVE_IMPORT_PATTERNS = [
  // Imports relativos simples
  /from ['"]\.\.\/\.\.\/\.\.\/([^'"]+)['"]/g,
  /from ['"]\.\.\/\.\.\/([^'"]+)['"]/g,
  /from ['"]\.\.\/([^'"]+)['"]/g,
  /from ['"]\.\/([^'"]+)['"]/g,
];

// Función para convertir ruta relativa a alias
function convertToAlias(relativePath, currentFilePath) {
  const currentDir = path.dirname(currentFilePath);
  const absolutePath = path.resolve(currentDir, relativePath);
  const projectRoot = path.resolve(process.cwd());
  const relativeToRoot = path.relative(projectRoot, absolutePath);

  // Normalizar separadores de ruta
  const normalizedPath = relativeToRoot.replace(/\\/g, '/');

  // Buscar el alias más específico
  for (const [alias, pattern] of Object.entries(ALIASES)) {
    if (normalizedPath.startsWith(pattern.replace('*', ''))) {
      const remainingPath = normalizedPath.substring(
        pattern.replace('*', '').length,
      );
      return `${alias.replace('*', '')}${remainingPath}`;
    }
  }

  // Si no encuentra un alias específico, usar el genérico
  return `@/${normalizedPath}`;
}

// Función para procesar un archivo
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;
    let hasChanges = false;

    // Reemplazar imports relativos
    for (const pattern of RELATIVE_IMPORT_PATTERNS) {
      updatedContent = updatedContent.replace(pattern, (match, importPath) => {
        const alias = convertToAlias(importPath, filePath);
        hasChanges = true;
        return `from '${alias}'`;
      });
    }

    // Si hay cambios, escribir el archivo
    if (hasChanges) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Función principal
function main() {
  console.log('🔄 Updating relative imports to aliases...\n');

  // Buscar archivos TypeScript
  const files = glob.sync('src/**/*.ts', {
    ignore: ['**/node_modules/**', '**/dist/**', '**/legacy/**'],
  });

  let updatedCount = 0;

  for (const file of files) {
    if (processFile(file)) {
      updatedCount++;
    }
  }

  console.log(`\n✅ Updated ${updatedCount} files`);
  console.log('🎉 Import alias conversion completed!');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { processFile, convertToAlias };
