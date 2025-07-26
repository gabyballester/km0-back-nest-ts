#!/usr/bin/env node

/**
 * Script para ejecutar comandos con tiempo de ejecución
 * Uso: node scripts/timed-run.js "comando" "descripción"
 */

const { spawn } = require('child_process');

function runWithTimer(command, description) {
  const startTime = Date.now();

  console.log(`🚀 ${description}`);
  console.log(`⏱️  Iniciando: ${command}`);
  console.log('─'.repeat(50));

  const child = spawn(command, [], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env },
  });

  child.on('close', code => {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log('─'.repeat(50));
    console.log(`⏱️  Tiempo total: ${duration.toFixed(2)}s`);

    if (code === 0) {
      console.log(`✅ ${description} completado exitosamente`);
    } else {
      console.log(`❌ ${description} falló con código: ${code}`);
      process.exit(code);
    }
  });

  child.on('error', error => {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log('─'.repeat(50));
    console.log(`⏱️  Tiempo transcurrido: ${duration.toFixed(2)}s`);
    console.log(`❌ Error: ${error.message}`);
    process.exit(1);
  });

  // Manejar señales de terminación
  process.on('SIGINT', () => {
    child.kill('SIGINT');
    process.exit(1);
  });

  process.on('SIGTERM', () => {
    child.kill('SIGTERM');
    process.exit(1);
  });
}

// Función principal con manejo de errores
function main() {
  try {
    // Validar argumentos
    if (process.argv.length < 3) {
      console.error('❌ Error: Comando requerido');
      console.log('Uso: node scripts/timed-run.js "comando" "descripción"');
      console.log(
        'Ejemplo: node scripts/timed-run.js "npm run test:quick" "Tests rápidos"',
      );
      process.exit(1);
    }

    const command = process.argv[2];
    const description = process.argv[3] ?? 'Comando ejecutado';

    // Validar que el comando no esté vacío
    if (!command || command.trim() === '') {
      console.error('❌ Error: Comando no puede estar vacío');
      process.exit(1);
    }

    runWithTimer(command, description);
  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
    process.exit(1);
  }
}

// Ejecutar solo si es el módulo principal
if (require.main === module) {
  main();
}

module.exports = { runWithTimer, main };
