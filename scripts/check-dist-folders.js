#!/usr/bin/env node

/**
 * Script para verificar que no se generen carpetas dist innecesariamente
 * Se ejecuta en pre-commit y pre-push para detectar carpetas dist no deseadas
 */

const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

/**
 * Busca carpetas dist recursivamente
 */
function findDistFolders(dir, excludeDirs = []) {
  const distFolders = [];

  function scanDirectory(currentDir, depth = 0) {
    // Evitar recursión infinita y directorios muy profundos
    if (depth > 10) return;

    try {
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Verificar si es una carpeta dist
          if (item === 'dist') {
            // Verificar si está en directorios excluidos
            const isExcluded = excludeDirs.some(excludeDir =>
              fullPath.includes(excludeDir),
            );

            if (!isExcluded) {
              distFolders.push({
                path: fullPath,
                relativePath: path.relative(process.cwd(), fullPath),
                size: getDirectorySize(fullPath),
              });
            }
          }

          // Continuar escaneando subdirectorios (excepto node_modules y legacy)
          if (
            ![
              'node_modules',
              'legacy',
              '.git',
              'coverage',
              '.jest-cache',
            ].includes(item)
          ) {
            scanDirectory(fullPath, depth + 1);
          }
        }
      }
    } catch (error) {
      // Ignorar errores de permisos o directorios inaccesibles
      console.warn(
        `${colors.yellow}Warning:${colors.reset} No se pudo acceder a ${currentDir}: ${error.message}`,
      );
    }
  }

  scanDirectory(dir);
  return distFolders;
}

/**
 * Calcula el tamaño de un directorio
 */
function getDirectorySize(dirPath) {
  let totalSize = 0;

  function calculateSize(currentPath) {
    try {
      const items = fs.readdirSync(currentPath);

      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          calculateSize(fullPath);
        } else {
          totalSize += stat.size;
        }
      }
    } catch (error) {
      // Ignorar errores
    }
  }

  calculateSize(dirPath);
  return totalSize;
}

/**
 * Formatea el tamaño en bytes a formato legible
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Verifica si las carpetas dist son necesarias
 */
function analyzeDistFolders(distFolders) {
  const analysis = {
    necessary: [],
    unnecessary: [],
    warnings: [],
  };

  for (const folder of distFolders) {
    const relativePath = folder.relativePath;
    // Normalizar separadores de ruta para compatibilidad cross-platform
    const normalizedPath = relativePath.replace(/\\/g, '/');

    // Carpetas dist que SÍ son necesarias
    if (normalizedPath === 'dist') {
      analysis.necessary.push(folder);
      continue;
    }

    // Carpetas dist que NO son necesarias
    if (
      normalizedPath.includes('src/') ||
      normalizedPath.includes('modules/') ||
      normalizedPath.includes('shared/') ||
      normalizedPath.includes('config/') ||
      normalizedPath.includes('health/') ||
      normalizedPath.includes('infrastructure/') ||
      normalizedPath.includes('scripts/') ||
      normalizedPath.includes('test/') ||
      normalizedPath.includes('application/') ||
      normalizedPath.includes('domain/') ||
      normalizedPath.includes('presentation/') ||
      normalizedPath.includes('repositories/') ||
      normalizedPath.includes('services/') ||
      normalizedPath.includes('dto/') ||
      normalizedPath.includes('entities/') ||
      normalizedPath.includes('factories/')
    ) {
      analysis.unnecessary.push(folder);
      continue;
    }

    // Casos que requieren revisión manual
    analysis.warnings.push(folder);
  }

  return analysis;
}

/**
 * Función principal
 */
function main() {
  console.log(
    `${colors.blue}${colors.bold}🔍 Verificando carpetas dist innecesarias...${colors.reset}\n`,
  );

  const projectRoot = process.cwd();
  const excludeDirs = [
    'node_modules',
    'legacy',
    '.git',
    'coverage',
    '.jest-cache',
  ];

  // Buscar todas las carpetas dist
  const distFolders = findDistFolders(projectRoot, excludeDirs);

  if (distFolders.length === 0) {
    console.log(
      `${colors.green}✅ No se encontraron carpetas dist innecesarias.${colors.reset}`,
    );
    return 0;
  }

  // Analizar las carpetas encontradas
  const analysis = analyzeDistFolders(distFolders);

  let hasIssues = false;

  // Mostrar carpetas innecesarias
  if (analysis.unnecessary.length > 0) {
    console.log(
      `${colors.red}❌ Carpetas dist innecesarias encontradas:${colors.reset}`,
    );
    analysis.unnecessary.forEach(folder => {
      console.log(
        `  ${colors.red}•${colors.reset} ${folder.relativePath} (${formatBytes(folder.size)})`,
      );
    });
    console.log('');
    hasIssues = true;
  }

  // Mostrar advertencias
  if (analysis.warnings.length > 0) {
    console.log(
      `${colors.yellow}⚠️  Carpetas dist que requieren revisión manual:${colors.reset}`,
    );
    analysis.warnings.forEach(folder => {
      console.log(
        `  ${colors.yellow}•${colors.reset} ${folder.relativePath} (${formatBytes(folder.size)})`,
      );
    });
    console.log('');
  }

  // Mostrar carpetas necesarias
  if (analysis.necessary.length > 0) {
    console.log(`${colors.green}✅ Carpetas dist necesarias:${colors.reset}`);
    analysis.necessary.forEach(folder => {
      console.log(
        `  ${colors.green}•${colors.reset} ${folder.relativePath} (${formatBytes(folder.size)})`,
      );
    });
    console.log('');
  }

  // Mostrar resumen
  console.log(`${colors.blue}📊 Resumen:${colors.reset}`);
  console.log(`  • Total de carpetas dist: ${distFolders.length}`);
  console.log(`  • Necesarias: ${analysis.necessary.length}`);
  console.log(`  • Innecesarias: ${analysis.unnecessary.length}`);
  console.log(`  • Requieren revisión: ${analysis.warnings.length}`);

  if (hasIssues) {
    console.log(
      `\n${colors.red}${colors.bold}🚨 Se encontraron carpetas dist innecesarias!${colors.reset}`,
    );
    console.log(`${colors.yellow}💡 Recomendaciones:${colors.reset}`);
    console.log(
      `  • Revisar scripts de build que puedan estar generando estas carpetas`,
    );
    console.log(`  • Verificar configuraciones de TypeScript/compiladores`);
    console.log(
      `  • Añadir las carpetas innecesarias al .gitignore si es apropiado`,
    );
    console.log(`  • Eliminar las carpetas innecesarias manualmente`);
    return 1;
  }

  console.log(
    `\n${colors.green}✅ Verificación completada sin problemas.${colors.reset}`,
  );
  return 0;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const exitCode = main();
  process.exit(exitCode);
}

module.exports = { main, findDistFolders, analyzeDistFolders };
