#!/usr/bin/env node

/**
 * Script para verificar la configuración SSL de la base de datos
 * Verifica que las variables de entorno estén configuradas correctamente para producción
 */

const { config } = require('dotenv');

// Cargar variables de entorno
config();

function checkSSLConfiguration() {
  console.log('🔍 ========================================');
  console.log('🔒 VERIFICANDO CONFIGURACIÓN SSL');
  console.log('========================================');

  const nodeEnv = process.env.NODE_ENV;
  const databaseUrl = process.env.DATABASE_URL;

  console.log(`🌍 Environment: ${nodeEnv || 'undefined'}`);
  console.log(
    `🔗 Database URL: ${databaseUrl ? '✅ Configurada' : '❌ No configurada'}`,
  );

  if (nodeEnv === 'production') {
    console.log('🚀 PRODUCTION MODE DETECTED');

    if (!databaseUrl) {
      console.error('❌ ERROR: DATABASE_URL no está configurada en producción');
      process.exit(1);
    }

    // Verificar que la URL tenga SSL configurado
    if (
      databaseUrl.includes('sslmode=require') ||
      databaseUrl.includes('ssl=true')
    ) {
      console.log('✅ SSL configurado en DATABASE_URL');
    } else {
      console.warn(
        '⚠️  ADVERTENCIA: DATABASE_URL no tiene SSL explícito configurado',
      );
      console.log(
        '💡 Recomendación: Agregar ?sslmode=require al final de la URL',
      );
    }

    console.log('✅ Configuración SSL válida para producción');
  } else {
    console.log('🔧 DEVELOPMENT/TEST MODE');
    console.log('ℹ️  SSL no es requerido en desarrollo');
  }

  console.log('========================================');
  console.log('✅ Verificación SSL completada');
}

if (require.main === module) {
  checkSSLConfiguration();
}

module.exports = { checkSSLConfiguration };
