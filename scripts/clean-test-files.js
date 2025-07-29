#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script para limpiar archivos de test de la carpeta dist
 * Se ejecuta después del build para eliminar archivos innecesarios en producción
 */

const distPath = path.join(__dirname, '..', 'dist');

function removeTestFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log('📁 Carpeta dist no encontrada, saltando limpieza...');
    return;
  }

  const files = fs.readdirSync(dir);
  let removedCount = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      removedCount += removeTestFiles(filePath);

      // Eliminar directorio si está vacío
      if (fs.readdirSync(filePath).length === 0) {
        fs.rmdirSync(filePath);
      }
    } else if (stat.isFile()) {
      // Eliminar archivos de test
      if (
        file.endsWith('.spec.js') ||
        file.endsWith('.test.js') ||
        file.endsWith('.e2e-spec.js') ||
        file.endsWith('.d.ts')
      ) {
        fs.unlinkSync(filePath);
        removedCount++;
        console.log(`🗑️  Eliminado: ${filePath}`);
      }
    }
  }

  return removedCount;
}

console.log('🧹 Iniciando limpieza de archivos de test...');
const removedFiles = removeTestFiles(distPath);
console.log(
  `✅ Limpieza completada. ${removedFiles} archivos de test eliminados.`,
);
