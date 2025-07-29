#!/usr/bin/env node

/**
 * Script para limpiar carpetas dist innecesarias
 * Elimina automáticamente las carpetas dist que no deberían existir
 */

const fs = require('fs');
const path = require('path');

// Importar funciones del script de verificación
const {
  findDistFolders,
  analyzeDistFolders,
} = require('./check-dist-folders.js');

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
 * Elimina un directorio y todo su contenido recursivamente
 */
function removeDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return false;
  }

  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        removeDirectory(fullPath);
      } else {
        fs.unlinkSync(fullPath);
      }
    }

    fs.rmdirSync(dirPath);
    return true;
  } catch (error) {
    console.error(
      `${colors.red}Error eliminando ${dirPath}:${colors.reset} ${error.message}`,
    );
    return false;
  }
}

/**
 * Función principal
 */
function main() {
  console.log(
    `${colors.blue}${colors.bold}🧹 Limpiando carpetas dist innecesarias...${colors.reset}\n`,
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
      `${colors.green}✅ No se encontraron carpetas dist para limpiar.${colors.reset}`,
    );
    return 0;
  }

  // Analizar las carpetas encontradas
  const analysis = analyzeDistFolders(distFolders);

  let cleanedCount = 0;
  let failedCount = 0;

  // Limpiar carpetas innecesarias
  if (analysis.unnecessary.length > 0) {
    console.log(
      `${colors.yellow}🗑️  Eliminando carpetas dist innecesarias:${colors.reset}`,
    );

    for (const folder of analysis.unnecessary) {
      console.log(
        `  ${colors.yellow}•${colors.reset} Eliminando ${folder.relativePath}...`,
      );

      if (removeDirectory(folder.path)) {
        console.log(
          `    ${colors.green}✅ Eliminado exitosamente${colors.reset}`,
        );
        cleanedCount++;
      } else {
        console.log(`    ${colors.red}❌ Error al eliminar${colors.reset}`);
        failedCount++;
      }
    }
    console.log('');
  }

  // Mostrar carpetas necesarias (no se eliminan)
  if (analysis.necessary.length > 0) {
    console.log(
      `${colors.green}✅ Carpetas dist necesarias (no eliminadas):${colors.reset}`,
    );
    analysis.necessary.forEach(folder => {
      console.log(`  ${colors.green}•${colors.reset} ${folder.relativePath}`);
    });
    console.log('');
  }

  // Mostrar resumen
  console.log(`${colors.blue}📊 Resumen de limpieza:${colors.reset}`);
  console.log(
    `  • Carpetas innecesarias encontradas: ${analysis.unnecessary.length}`,
  );
  console.log(`  • Carpetas eliminadas exitosamente: ${cleanedCount}`);
  console.log(`  • Errores al eliminar: ${failedCount}`);
  console.log(
    `  • Carpetas necesarias preservadas: ${analysis.necessary.length}`,
  );

  if (cleanedCount > 0) {
    console.log(
      `\n${colors.green}✅ Limpieza completada. Se eliminaron ${cleanedCount} carpetas dist innecesarias.${colors.reset}`,
    );
  }

  if (failedCount > 0) {
    console.log(
      `\n${colors.red}⚠️  Se encontraron ${failedCount} errores durante la limpieza.${colors.reset}`,
    );
    return 1;
  }

  return 0;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const exitCode = main();
  process.exit(exitCode);
}

module.exports = { main, removeDirectory };
