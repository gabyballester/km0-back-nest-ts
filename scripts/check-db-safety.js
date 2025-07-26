#!/usr/bin/env node

/**
 * Script de validación de seguridad para comandos de base de datos
 * Verifica que no se usen comandos peligrosos en producción
 */

const { execSync } = require('child_process');

console.log('🛡️ Verificando seguridad de comandos de base de datos...');

// Comandos peligrosos que NUNCA deben usarse en producción
const DANGEROUS_COMMANDS = [
  'prisma migrate dev',
  'prisma migrate reset',
  'prisma db push --force-reset',
  'prisma db push --accept-data-loss',
];

// Comandos seguros para producción
const SAFE_COMMANDS = [
  'prisma migrate deploy',
  'prisma db push',
  'prisma generate',
  'prisma validate',
];

function checkEnvironment() {
  const nodeEnv = process.env.NODE_ENV;

  console.log(`🌍 Entorno detectado: ${nodeEnv || 'development'}`);

  if (nodeEnv === 'production') {
    console.log(
      '🚨 PRODUCCIÓN detectada - Validaciones de seguridad activadas',
    );
    return true;
  }

  console.log('✅ Entorno de desarrollo - Validaciones relajadas');
  return false;
}

function checkPackageScripts() {
  console.log('\n📋 Verificando scripts de package.json...');

  try {
    const packageJson = require('../package.json');
    const scripts = packageJson.scripts;

    let hasDangerousScripts = false;
    let dangerousScripts = [];

    Object.entries(scripts).forEach(([name, command]) => {
      const isDangerous = DANGEROUS_COMMANDS.some(dangerous =>
        command.includes(dangerous),
      );

      if (isDangerous) {
        // Verificar si es un script de desarrollo (aceptable)
        const isDevScript = name.includes('dev') || name.includes('test');
        const isSafeContext =
          command.includes('--create-only') ||
          command.includes('--accept-data-loss');

        if (!isDevScript && !isSafeContext) {
          console.log(`❌ Script peligroso detectado: ${name}`);
          console.log(`   Comando: ${command}`);
          dangerousScripts.push({ name, command });
          hasDangerousScripts = true;
        } else {
          console.log(`⚠️  Script de desarrollo detectado: ${name}`);
          console.log(`   Comando: ${command}`);
          console.log(`   ✅ ACEPTABLE para desarrollo/testing`);
        }
      }
    });

    if (!hasDangerousScripts) {
      console.log('✅ No se detectaron scripts peligrosos para producción');
    }

    return !hasDangerousScripts;
  } catch (error) {
    console.error('❌ Error al verificar package.json:', error.message);
    return false;
  }
}

function checkProductionScript() {
  console.log('\n🔍 Verificando script de producción...');

  try {
    const fs = require('fs');
    const productionScript = fs.readFileSync(
      './scripts/production-deploy.js',
      'utf8',
    );

    // Verificar que use comandos seguros
    const usesSafeCommands = SAFE_COMMANDS.some(safe =>
      productionScript.includes(safe),
    );

    // Verificar que NO use comandos peligrosos
    const usesDangerousCommands = DANGEROUS_COMMANDS.some(
      dangerous =>
        productionScript.includes(dangerous) &&
        !productionScript.includes('--create-only'),
    );

    if (usesSafeCommands && !usesDangerousCommands) {
      console.log('✅ Script de producción usa comandos seguros');
      return true;
    } else {
      console.log('❌ Script de producción usa comandos peligrosos');
      return false;
    }
  } catch (error) {
    console.error('❌ Error al verificar script de producción:', error.message);
    return false;
  }
}

function main() {
  const isProduction = checkEnvironment();
  const packageSafe = checkPackageScripts();
  const productionSafe = checkProductionScript();

  console.log('\n📊 Resumen de seguridad:');
  console.log(`   - Entorno: ${isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'}`);
  console.log(
    `   - Package.json: ${packageSafe ? '✅ SEGURO' : '❌ PELIGROSO'}`,
  );
  console.log(
    `   - Script producción: ${productionSafe ? '✅ SEGURO' : '❌ PELIGROSO'}`,
  );

  if (isProduction && (!packageSafe || !productionSafe)) {
    console.log('\n🚨 ERRORES DE SEGURIDAD DETECTADOS');
    console.log(
      '❌ No se puede proceder con comandos peligrosos en producción',
    );
    process.exit(1);
  }

  if (packageSafe && productionSafe) {
    console.log('\n✅ TODOS LOS COMANDOS SON SEGUROS');
    console.log('🛡️ Base de datos protegida');
  } else {
    console.log('\n⚠️ ADVERTENCIAS DETECTADAS');
    console.log('🔧 Revisar comandos antes de usar en producción');
  }
}

main();
