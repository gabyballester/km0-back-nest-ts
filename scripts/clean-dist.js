#!/usr/bin/env node

/**
 * Script para limpiar todas las carpetas dist y archivos compilados
 * Elimina carpetas dist anidadas y archivos .js/.js.map generados por SWC
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Limpiando carpetas dist y archivos compilados...');

// Función para eliminar directorio recursivamente
function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ Eliminado: ${dirPath}`);
    } catch (error) {
      console.error(`❌ Error eliminando ${dirPath}:`, error.message);
    }
  }
}

// Función para eliminar archivos
function removeFile(filePath) {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Eliminado: ${filePath}`);
    } catch (error) {
      console.error(`❌ Error eliminando ${filePath}:`, error.message);
    }
  }
}

// Función para buscar y eliminar carpetas dist recursivamente
function findAndRemoveDistDirs(startPath) {
  const items = fs.readdirSync(startPath, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(startPath, item.name);

    if (item.isDirectory()) {
      if (item.name === 'dist') {
        removeDirectory(fullPath);
      } else if (item.name !== 'node_modules' && item.name !== '.git') {
        findAndRemoveDistDirs(fullPath);
      }
    }
  }
}

// Función para buscar y eliminar archivos .js y .js.map en src
function findAndRemoveCompiledFiles(startPath) {
  const items = fs.readdirSync(startPath, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(startPath, item.name);

    if (item.isDirectory()) {
      if (
        item.name !== 'node_modules' &&
        item.name !== '.git' &&
        item.name !== 'dist'
      ) {
        findAndRemoveCompiledFiles(fullPath);
      }
    } else if (item.isFile()) {
      const ext = path.extname(item.name);
      if (ext === '.js' || ext === '.js.map') {
        const baseName = path.basename(item.name, ext);
        const tsFile = path.join(path.dirname(fullPath), `${baseName}.ts`);

        // Solo eliminar si existe el archivo .ts correspondiente
        if (fs.existsSync(tsFile)) {
          removeFile(fullPath);
        }
      }
    }
  }
}

try {
  // 1. Eliminar la carpeta dist principal
  removeDirectory('dist');

  // 2. Buscar y eliminar carpetas dist anidadas
  console.log('🔍 Buscando carpetas dist anidadas...');
  findAndRemoveDistDirs('.');

  // 3. Buscar y eliminar archivos .js/.js.map compilados en src
  console.log('🔍 Buscando archivos compilados en src...');
  if (fs.existsSync('src')) {
    findAndRemoveCompiledFiles('src');
  }

  // 4. Limpiar cache de Jest
  console.log('🧹 Limpiando cache de Jest...');
  try {
    execSync('npx jest --clearCache', { stdio: 'pipe' });
    console.log('✅ Cache de Jest limpiado');
  } catch (error) {
    console.log('ℹ️ No se pudo limpiar cache de Jest (puede ser normal)');
  }

  // 5. Limpiar cache de TypeScript
  console.log('🧹 Limpiando cache de TypeScript...');
  try {
    execSync('npx tsc --build --clean', { stdio: 'pipe' });
    console.log('✅ Cache de TypeScript limpiado');
  } catch (error) {
    console.log('ℹ️ No se pudo limpiar cache de TypeScript (puede ser normal)');
  }

  console.log('✅ Limpieza completada exitosamente');
} catch (error) {
  console.error('❌ Error durante la limpieza:', error.message);
  process.exit(1);
}
