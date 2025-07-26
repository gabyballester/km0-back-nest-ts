#!/usr/bin/env node

/**
 * Script para probar los diferentes entornos de NestJS
 * Muestra información detallada de cada entorno
 */

const { spawn } = require('child_process');
const path = require('path');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(title) {
  console.log('\n' + '='.repeat(60));
  log(`  ${title}`, 'bright');
  console.log('='.repeat(60));
}

function logEnvironment(env) {
  const envColors = {
    development: 'green',
    production: 'red',
    test: 'yellow',
  };

  log(`\n🌍 Testing Environment: ${env.toUpperCase()}`, envColors[env]);
  console.log('-'.repeat(40));
}

function runCommand(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'pipe',
      env: { ...process.env, ...env },
      cwd: process.cwd(),
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', data => {
      output += data.toString();
    });

    child.stderr.on('data', data => {
      errorOutput += data.toString();
    });

    child.on('close', code => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Command failed with code ${code}: ${errorOutput}`));
      }
    });

    child.on('error', error => {
      reject(error);
    });
  });
}

async function testEnvironment(environment) {
  logEnvironment(environment);

  try {
    // Probar el comando de información del entorno
    const result = await runCommand('npm', ['run', `env:${environment}`], {
      [ENV_KEYS.NODE_ENV]: environment,
    });

    log('✅ Environment info command:', 'green');
    console.log(result.trim());

    // Probar el comando de inicio (solo por 3 segundos)
    log('\n🚀 Testing startup command (3 seconds)...', 'cyan');

    const startCommand =
      environment === 'prod' ? 'start:prod' : `start:${environment}`;
    const startProcess = spawn('npm', ['run', startCommand], {
      stdio: 'pipe',
      env: { ...process.env, [ENV_KEYS.NODE_ENV]: environment },
      cwd: process.cwd(),
    });

    let startupOutput = '';

    startProcess.stdout.on('data', data => {
      startupOutput += data.toString();
      // Mostrar las primeras líneas del output
      const lines = startupOutput.split('\n').slice(-5);
      console.log(lines.join('\n'));
    });

    // Detener después de 3 segundos
    setTimeout(() => {
      startProcess.kill('SIGTERM');
      log('\n⏹️  Startup test completed', 'yellow');
    }, 3000);

    startProcess.on('close', () => {
      log('✅ Startup test finished', 'green');
    });
  } catch (error) {
    log(`❌ Error testing ${environment} environment: ${error.message}`, 'red');
  }
}

// Constantes para entornos
const ENVIRONMENTS = {
  DEV: 'dev',
  TEST: 'test',
  PROD: 'prod',
};

// Constantes para variables de entorno
const ENV_KEYS = {
  NODE_ENV: 'NODE_ENV',
};

async function main() {
  logHeader('NESTJS ENVIRONMENT TESTING SCRIPT');

  log('This script will test all three environments:', 'cyan');
  log('• Development (dev)', 'green');
  log('• Production (prod)', 'red');
  log('• Test (test)', 'yellow');

  const environments = [ENVIRONMENTS.DEV, ENVIRONMENTS.TEST, ENVIRONMENTS.PROD];

  for (const env of environments) {
    await testEnvironment(env);
    // Pausa entre tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  logHeader('TESTING COMPLETED');
  log('All environment tests have been executed.', 'green');
  log('Check the output above for any issues.', 'cyan');
}

// Ejecutar el script
if (require.main === module) {
  main().catch(error => {
    log(`❌ Script failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { testEnvironment, runCommand };
