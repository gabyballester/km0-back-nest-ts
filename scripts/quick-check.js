#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script para verificación rápida del estado del proyecto
 * Verifica dependencias, archivos de entorno, y configuración básica
 */

console.log('🔍 Verificación rápida del proyecto...\n');

let allChecksPassed = true;

// 1. Verificar archivos de entorno
console.log('📋 Verificando archivos de entorno...');
const envFiles = ['.env', '.env.development', '.env.test'];
const missingEnvFiles = [];

for (const envFile of envFiles) {
  const envPath = path.join(__dirname, '..', envFile);
  if (fs.existsSync(envPath)) {
    console.log(`  ✅ ${envFile} existe`);
  } else {
    console.log(`  ❌ ${envFile} NO existe`);
    missingEnvFiles.push(envFile);
    allChecksPassed = false;
  }
}

if (missingEnvFiles.length > 0) {
  console.log(
    `\n⚠️  Archivos de entorno faltantes: ${missingEnvFiles.join(', ')}`,
  );
  console.log('💡 Ejecuta: npm run setup:env');
}

// 2. Verificar dependencias
console.log('\n📦 Verificando dependencias...');
try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'),
  );
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');

  if (fs.existsSync(nodeModulesPath)) {
    console.log('  ✅ node_modules existe');
  } else {
    console.log('  ❌ node_modules NO existe');
    allChecksPassed = false;
  }

  // Verificar dependencias críticas
  const criticalDeps = ['@nestjs/core', '@prisma/client', 'prisma'];
  for (const dep of criticalDeps) {
    const depPath = path.join(nodeModulesPath, dep);
    if (fs.existsSync(depPath)) {
      console.log(`  ✅ ${dep} instalado`);
    } else {
      console.log(`  ❌ ${dep} NO instalado`);
      allChecksPassed = false;
    }
  }
} catch (error) {
  console.log('  ❌ Error al verificar dependencias:', error.message);
  allChecksPassed = false;
}

// 3. Verificar archivos de configuración
console.log('\n⚙️  Verificando archivos de configuración...');
const configFiles = [
  'package.json',
  'tsconfig.json',
  'tsconfig.build.json',
  'jest.config.js',
  'prisma/schema.prisma',
];

for (const configFile of configFiles) {
  const configPath = path.join(__dirname, '..', configFile);
  if (fs.existsSync(configPath)) {
    console.log(`  ✅ ${configFile} existe`);
  } else {
    console.log(`  ❌ ${configFile} NO existe`);
    allChecksPassed = false;
  }
}

// 4. Verificar estructura de directorios
console.log('\n📁 Verificando estructura de directorios...');
const requiredDirs = ['src', 'test', 'prisma', 'scripts'];
for (const dir of requiredDirs) {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    console.log(`  ✅ ${dir}/ existe`);
  } else {
    console.log(`  ❌ ${dir}/ NO existe`);
    allChecksPassed = false;
  }
}

// 5. Verificar archivos de código fuente
console.log('\n💻 Verificando archivos de código fuente...');
const sourceFiles = [
  'src/main.ts',
  'src/app.module.ts',
  'src/modules/users/user.module.ts',
  'prisma/schema.prisma',
];

for (const sourceFile of sourceFiles) {
  const sourcePath = path.join(__dirname, '..', sourceFile);
  if (fs.existsSync(sourcePath)) {
    console.log(`  ✅ ${sourceFile} existe`);
  } else {
    console.log(`  ❌ ${sourceFile} NO existe`);
    allChecksPassed = false;
  }
}

// 6. Verificar Node.js y npm
console.log('\n🟢 Verificando versiones...');
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();

  console.log(`  ✅ Node.js: ${nodeVersion}`);
  console.log(`  ✅ npm: ${npmVersion}`);

  // Verificar versión mínima de Node.js
  const nodeMajor = parseInt(nodeVersion.replace('v', '').split('.')[0]);
  if (nodeMajor >= 22) {
    console.log('  ✅ Node.js versión compatible (>= 22.0.0)');
  } else {
    console.log('  ❌ Node.js versión incompatible (se requiere >= 22.0.0)');
    allChecksPassed = false;
  }
} catch (error) {
  console.log('  ❌ Error al verificar versiones:', error.message);
  allChecksPassed = false;
}

// Resumen
console.log('\n📊 Resumen de verificación:');
if (allChecksPassed) {
  console.log('🎉 ¡Todas las verificaciones pasaron!');
  console.log('\n🚀 El proyecto está listo para ejecutar:');
  console.log('  1. npm run db:generate');
  console.log('  2. npm run db:dev');
  console.log('  3. npm run start:dev');
} else {
  console.log('⚠️  Algunas verificaciones fallaron.');
  console.log('\n🔧 Pasos para solucionar:');
  if (missingEnvFiles.length > 0) {
    console.log('  1. npm run setup:env');
  }
  console.log('  2. npm install');
  console.log('  3. Verificar configuración de base de datos');
}

console.log('\n📚 Para más información, consulta: docs/SETUP_AND_RUNNING.md');
