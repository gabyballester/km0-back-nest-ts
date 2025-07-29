#!/usr/bin/env node

/**
 * Script para verificar que las dependencias estén correctamente organizadas
 * Previene errores de deployment por dependencias mal ubicadas
 */

const fs = require('fs');
const path = require('path');

// Dependencias que DEBEN estar en dependencies (producción)
const PRODUCTION_DEPS = [
  'drizzle-kit',
  'drizzle-orm',
  'postgres',
  '@nestjs/common',
  '@nestjs/core',
  '@nestjs/config',
  '@nestjs/platform-express',
  '@prisma/client',
  'zod',
  'helmet',
  'rxjs',
  'reflect-metadata',
  'swagger-ui-express',
  '@types/express', // ✅ CRÍTICO: Necesario para TypeScript en producción
];

// Dependencias que DEBEN estar en devDependencies (desarrollo)
const DEVELOPMENT_DEPS = [
  '@nestjs/cli',
  '@swc/cli',
  'prisma',
  'typescript',
  'jest',
  'eslint',
  'prettier',
  'husky',
  'lint-staged',
  '@types/node',
  '@types/jest',
  'ts-node',
  'ts-loader',
];

function checkDependencies() {
  console.log('🔍 ========================================');
  console.log('📦 VERIFICANDO ORGANIZACIÓN DE DEPENDENCIAS');
  console.log('========================================');

  const packagePath = path.join(process.cwd(), 'package.json');

  if (!fs.existsSync(packagePath)) {
    console.error('❌ package.json no encontrado');
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  let hasErrors = false;
  const errors = [];
  const warnings = [];

  // Verificar dependencias de producción
  console.log('\n✅ Verificando dependencias de producción...');
  for (const dep of PRODUCTION_DEPS) {
    if (!dependencies[dep]) {
      if (devDependencies[dep]) {
        errors.push(
          `❌ ${dep} está en devDependencies pero debe estar en dependencies`,
        );
        hasErrors = true;
      } else {
        warnings.push(`⚠️  ${dep} no encontrada en ninguna sección`);
      }
    } else {
      console.log(`  ✅ ${dep} en dependencies`);
    }
  }

  // Verificar dependencias de desarrollo
  console.log('\n🔧 Verificando dependencias de desarrollo...');
  for (const dep of DEVELOPMENT_DEPS) {
    if (!devDependencies[dep]) {
      if (dependencies[dep]) {
        errors.push(
          `❌ ${dep} está en dependencies pero debe estar en devDependencies`,
        );
        hasErrors = true;
      } else {
        warnings.push(`⚠️  ${dep} no encontrada en ninguna sección`);
      }
    } else {
      console.log(`  ✅ ${dep} en devDependencies`);
    }
  }

  // Mostrar resultados
  console.log('\n📊 ========================================');
  console.log('📋 RESUMEN DE VERIFICACIÓN');
  console.log('========================================');

  if (errors.length > 0) {
    console.log('\n❌ ERRORES CRÍTICOS:');
    errors.forEach(error => console.log(`  ${error}`));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  ADVERTENCIAS:');
    warnings.forEach(warning => console.log(`  ${warning}`));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ Todas las dependencias están correctamente organizadas');
  }

  console.log('\n========================================');

  if (hasErrors) {
    console.log(
      '🚨 Se encontraron errores críticos en la organización de dependencias',
    );
    console.log(
      '💡 Ejecuta: npm run fix:dependencies para corregir automáticamente',
    );
    process.exit(1);
  } else {
    console.log('✅ Verificación de dependencias completada exitosamente');
  }
}

function fixDependencies() {
  console.log('🔧 ========================================');
  console.log('🔧 CORRIGIENDO ORGANIZACIÓN DE DEPENDENCIAS');
  console.log('========================================');

  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  let changes = false;

  // Mover dependencias incorrectas
  for (const dep of PRODUCTION_DEPS) {
    if (packageJson.devDependencies?.[dep]) {
      console.log(`🔄 Moviendo ${dep} de devDependencies a dependencies`);
      packageJson.dependencies[dep] = packageJson.devDependencies[dep];
      delete packageJson.devDependencies[dep];
      changes = true;
    }
  }

  for (const dep of DEVELOPMENT_DEPS) {
    if (packageJson.dependencies?.[dep]) {
      console.log(`🔄 Moviendo ${dep} de dependencies a devDependencies`);
      packageJson.devDependencies[dep] = packageJson.dependencies[dep];
      delete packageJson.dependencies[dep];
      changes = true;
    }
  }

  if (changes) {
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('\n✅ Dependencias corregidas. Ejecuta: npm install');
  } else {
    console.log('\n✅ No se encontraron dependencias que necesiten corrección');
  }
}

// Ejecutar según argumentos
const command = process.argv[2];

if (command === 'fix') {
  fixDependencies();
} else {
  checkDependencies();
}

module.exports = { checkDependencies, fixDependencies };
