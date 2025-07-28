#!/usr/bin/env node

/**
 * Script de Monitoreo de Deployment
 * Versión: 2.0 - Monitoreo continuo hasta completar deployment
 */

const { execSync } = require('child_process');

const PRODUCTION_URL = 'https://km0-market.onrender.com';
const ENDPOINTS = [
  { path: '/health', name: 'Health Check' },
  { path: '/docs', name: 'API Documentation' },
  { path: '/example', name: 'Example Endpoint' },
];

function checkEndpoint(endpoint) {
  try {
    const url = `${PRODUCTION_URL}${endpoint.path}`;

    const result = execSync(`curl -s -w "%{http_code}" -o /dev/null "${url}"`, {
      encoding: 'utf8',
      timeout: 10000, // 10 segundos timeout
    });

    const statusCode = result.trim();

    if (statusCode === '200') {
      console.log(`✅ ${endpoint.name}: OK (${statusCode})`);
      return true;
    } else {
      console.log(`❌ ${endpoint.name}: Error (${statusCode})`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${endpoint.name}: Error - ${error.message}`);
    return false;
  }
}

function checkAllEndpoints() {
  console.log(
    `\n🔍 Verificando endpoints... (${new Date().toLocaleTimeString()})`,
  );

  let successCount = 0;
  let totalEndpoints = ENDPOINTS.length;

  ENDPOINTS.forEach(endpoint => {
    const isSuccess = checkEndpoint(endpoint);
    if (isSuccess) successCount++;
  });

  return { successCount, totalEndpoints };
}

function monitorDeployment() {
  console.log('🚀 Monitoreo Continuo de Deployment - KM0 Market Backend');
  console.log('========================================================');
  console.log(`🌍 URL de producción: ${PRODUCTION_URL}`);
  console.log(`📅 Inicio: ${new Date().toISOString()}`);
  console.log('⏱️  Monitoreando cada 30 segundos...');
  console.log('💡 Para detener: Ctrl+C');
  console.log('');

  let attempt = 1;
  const maxAttempts = 20; // 10 minutos máximo
  const interval = 30000; // 30 segundos

  const monitorInterval = setInterval(() => {
    console.log(`\n🔄 Intento ${attempt}/${maxAttempts}`);

    const { successCount, totalEndpoints } = checkAllEndpoints();

    console.log(
      `📊 Progreso: ${successCount}/${totalEndpoints} endpoints funcionando`,
    );

    if (successCount === totalEndpoints) {
      console.log('\n🎉 ¡DEPLOYMENT EXITOSO!');
      console.log('✅ Todos los endpoints están funcionando correctamente.');
      console.log('🌍 Aplicación disponible en:', PRODUCTION_URL);
      clearInterval(monitorInterval);
      process.exit(0);
    } else if (attempt >= maxAttempts) {
      console.log('\n⏰ Tiempo de espera agotado.');
      console.log('❌ El deployment no se completó en el tiempo esperado.');
      console.log(
        '💡 Verificar logs en Render.com: https://dashboard.render.com/web/km0-market-backend',
      );
      clearInterval(monitorInterval);
      process.exit(1);
    }

    attempt++;
  }, interval);

  // Primera verificación inmediata
  console.log('🔄 Intento 1/20');
  const { successCount, totalEndpoints } = checkAllEndpoints();
  console.log(
    `📊 Progreso: ${successCount}/${totalEndpoints} endpoints funcionando`,
  );

  if (successCount === totalEndpoints) {
    console.log('\n🎉 ¡DEPLOYMENT EXITOSO!');
    console.log('✅ Todos los endpoints están funcionando correctamente.');
    clearInterval(monitorInterval);
    process.exit(0);
  }
}

// Ejecutar monitoreo continuo
monitorDeployment();
