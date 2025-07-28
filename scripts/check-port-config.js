#!/usr/bin/env node

/**
 * Script para verificar la configuración de puertos en diferentes entornos
 * Verifica que los puertos estén configurados correctamente para cada entorno
 */

const fs = require('fs');
const path = require('path');

// Configuración de puertos por entorno
const PORT_CONFIG = {
  development: 4000,
  test: 6000,
  production: 8000,
};

// Configuración de hosts por entorno
const HOST_CONFIG = {
  development: 'localhost',
  test: 'localhost',
  production: '0.0.0.0',
};

/**
 * Verificar archivo de configuración de entorno
 */
function checkEnvFile(envFile, environment) {
  console.log(`🔍 Verificando ${envFile}...`);

  if (!fs.existsSync(envFile)) {
    console.log(`⚠️  Archivo ${envFile} no existe`);
    return false;
  }

  const content = fs.readFileSync(envFile, 'utf8');
  const lines = content.split('\n');

  let portFound = false;
  let hostFound = false;
  let nodeEnvFound = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('PORT=')) {
      const port = trimmedLine.split('=')[1];
      const expectedPort = PORT_CONFIG[environment];

      if (port === expectedPort.toString()) {
        console.log(`✅ PORT=${port} (correcto para ${environment})`);
        portFound = true;
      } else {
        console.log(
          `❌ PORT=${port} (esperado: ${expectedPort} para ${environment})`,
        );
      }
    }

    if (trimmedLine.startsWith('HOST=')) {
      const host = trimmedLine.split('=')[1];
      const expectedHost = HOST_CONFIG[environment];

      if (host === expectedHost) {
        console.log(`✅ HOST=${host} (correcto para ${environment})`);
        hostFound = true;
      } else {
        console.log(
          `❌ HOST=${host} (esperado: ${expectedHost} para ${environment})`,
        );
      }
    }

    if (trimmedLine.startsWith('NODE_ENV=')) {
      const nodeEnv = trimmedLine.split('=')[1];

      if (nodeEnv === environment) {
        console.log(`✅ NODE_ENV=${nodeEnv} (correcto)`);
        nodeEnvFound = true;
      } else {
        console.log(`❌ NODE_ENV=${nodeEnv} (esperado: ${environment})`);
      }
    }
  }

  return portFound && hostFound && nodeEnvFound;
}

/**
 * Verificar render.yaml
 */
function checkRenderYaml() {
  console.log('\n🔍 Verificando render.yaml...');

  const renderYamlPath = path.join(process.cwd(), 'render.yaml');

  if (!fs.existsSync(renderYamlPath)) {
    console.log('⚠️  Archivo render.yaml no existe');
    return false;
  }

  const content = fs.readFileSync(renderYamlPath, 'utf8');
  const lines = content.split('\n');

  let portFound = false;
  let hostFound = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.includes('key: PORT')) {
      console.log('🔍 Encontrada configuración de PORT en render.yaml');
    }

    if (trimmedLine.includes('value: 8000')) {
      console.log('✅ PORT=8000 encontrado en render.yaml');
      portFound = true;
    }

    if (trimmedLine.includes('key: HOST')) {
      console.log('🔍 Encontrada configuración de HOST en render.yaml');
    }

    if (trimmedLine.includes('value: 0.0.0.0')) {
      console.log('✅ HOST=0.0.0.0 encontrado en render.yaml');
      hostFound = true;
    }
  }

  if (!portFound) {
    console.log('❌ PORT=8000 no encontrado en render.yaml');
  }

  if (!hostFound) {
    console.log('❌ HOST=0.0.0.0 no encontrado en render.yaml');
  }

  return portFound && hostFound;
}

/**
 * Función principal
 */
function main() {
  console.log('🚀 ========================================');
  console.log('🔍 VERIFICACIÓN DE CONFIGURACIÓN DE PUERTOS');
  console.log('========================================\n');

  const envFiles = [
    { file: 'env.example', env: 'production' },
    { file: 'env.development.example', env: 'development' },
    { file: 'env.test.example', env: 'test' },
  ];

  let allCorrect = true;

  // Verificar archivos de ejemplo
  for (const { file, env } of envFiles) {
    const filePath = path.join(process.cwd(), file);
    const isCorrect = checkEnvFile(filePath, env);

    if (!isCorrect) {
      allCorrect = false;
    }

    console.log('');
  }

  // Verificar render.yaml
  const renderCorrect = checkRenderYaml();
  if (!renderCorrect) {
    allCorrect = false;
  }

  console.log('\n========================================');
  if (allCorrect) {
    console.log('✅ TODA LA CONFIGURACIÓN DE PUERTOS ES CORRECTA');
    console.log('🚀 El proyecto está listo para despliegue');
  } else {
    console.log('❌ HAY PROBLEMAS EN LA CONFIGURACIÓN DE PUERTOS');
    console.log('🔧 Revisa los archivos de configuración');
  }
  console.log('========================================');

  process.exit(allCorrect ? 0 : 1);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { checkEnvFile, checkRenderYaml, PORT_CONFIG, HOST_CONFIG };
