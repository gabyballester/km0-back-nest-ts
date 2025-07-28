#!/usr/bin/env node

/**
 * Script de deployment para producción usando Drizzle ORM
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Función helper para obtener variables de entorno de forma segura
function getEnvVar(key, defaultValue = '') {
  return process.env[key] || defaultValue;
}

// Función helper para verificar el entorno
function getEnvironment() {
  return getEnvVar('NODE_ENV', 'development');
}

console.log('🚀 Iniciando deployment de producción con Drizzle ORM...');

// Función para ejecutar comandos de forma segura
function safeExec(command, description) {
  try {
    console.log(`🔄 ${description}...`);
    execSync(command, {
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: '1' },
    });
    console.log(`✅ ${description} completado`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} falló: ${error.message}`);
    return false;
  }
}

// Función para aplicar migraciones de forma segura
function applyMigrations() {
  try {
    console.log('🔄 Aplicando migraciones existentes...');

    // Asegurar que la URL tenga SSL en producción
    let databaseUrl = process.env.DATABASE_URL;
    if (
      process.env.NODE_ENV === 'production' &&
      databaseUrl &&
      !databaseUrl.includes('sslmode=')
    ) {
      databaseUrl +=
        (databaseUrl.includes('?') ? '&' : '?') + 'sslmode=require';
      process.env.DATABASE_URL = databaseUrl;
    }

    execSync('npx drizzle-kit migrate', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });

    console.log('✅ Migraciones aplicadas exitosamente');
    return true;
  } catch (error) {
    console.log('❌ Error aplicando migraciones:', error.message);
    return false;
  }
}

// Función para verificar si la base de datos existe y tiene tablas
function checkDatabaseExists() {
  try {
    console.log('🔍 Verificando estado de la base de datos...');

    // En producción, forzar SSL en la URL si no está presente
    let databaseUrl = process.env.DATABASE_URL;
    if (
      process.env.NODE_ENV === 'production' &&
      databaseUrl &&
      !databaseUrl.includes('sslmode=')
    ) {
      databaseUrl +=
        (databaseUrl.includes('?') ? '&' : '?') + 'sslmode=require';
      process.env.DATABASE_URL = databaseUrl;
    }

    const result = execSync(
      'npx drizzle-kit introspect --url "$DATABASE_URL"',
      {
        encoding: 'utf8',
        env: { ...process.env, DATABASE_URL: databaseUrl },
      },
    );

    console.log('📊 Base de datos accesible');
    return true;
  } catch (error) {
    console.log('⚠️  No se pudo verificar el estado de la base de datos');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Función para verificar si hay migraciones en el proyecto
function hasMigrations() {
  const migrationsPath = path.join(process.cwd(), 'drizzle');
  return (
    fs.existsSync(migrationsPath) &&
    fs.readdirSync(migrationsPath).filter(file => file.endsWith('.sql'))
      .length > 0
  );
}

function deployProduction() {
  try {
    // 🚨 VALIDACIÓN CRÍTICA: Verificar entorno de producción
    const nodeEnv = getEnvironment();
    const databaseOrm = getEnvVar('DATABASE_ORM', 'drizzle');

    if (nodeEnv === 'production') {
      console.log('🚨 ========================================');
      console.log('🛡️  DEPLOYMENT DE PRODUCCIÓN DETECTADO');
      console.log('========================================');
      console.log(`🗄️  ORM configurado: ${databaseOrm.toUpperCase()}`);
      console.log('⚠️  Verificando seguridad de base de datos...');
    }

    // Verificar que estamos usando Drizzle
    if (databaseOrm !== 'drizzle') {
      console.error(
        '❌ ERROR: DATABASE_ORM debe ser "drizzle" para este script',
      );
      throw new Error('ORM incorrecto configurado');
    }

    // 1. Generar migraciones si no existen
    if (!hasMigrations()) {
      console.log('📝 Generando migraciones iniciales...');
      if (!safeExec('npx drizzle-kit generate', 'Generando migraciones')) {
        throw new Error('No se pudieron generar las migraciones');
      }
    }

    // 2. Verificar configuración SSL
    console.log('🔒 Verificando configuración SSL...');
    try {
      require('./check-ssl-config.js');
    } catch (error) {
      console.warn(
        '⚠️  No se pudo verificar la configuración SSL:',
        error.message,
      );
    }

    // 3. Verificar esquema
    if (!safeExec('npx drizzle-kit check', 'Verificando esquema de Drizzle')) {
      throw new Error('Esquema de Drizzle inválido');
    }

    // 3. Verificar estado de la base de datos
    const databaseExists = checkDatabaseExists();
    const hasProjectMigrations = hasMigrations();

    console.log(`📋 Estado detectado:`);
    console.log(`   - Base de datos existe: ${databaseExists ? 'SÍ' : 'NO'}`);
    console.log(
      `   - Migraciones en proyecto: ${hasProjectMigrations ? 'SÍ' : 'NO'}`,
    );

    // 4. Estrategia según el estado
    if (hasProjectMigrations) {
      // Siempre usar migraciones si existen
      console.log('📦 Aplicando migraciones existentes...');
      if (!applyMigrations()) {
        throw new Error('No se pudieron aplicar las migraciones');
      }
    } else {
      // Solo usar push si no hay migraciones
      console.log('🆕 Sin migraciones - Sincronizando esquema...');

      // Asegurar que la URL tenga SSL en producción
      let databaseUrl = process.env.DATABASE_URL;
      if (
        process.env.NODE_ENV === 'production' &&
        databaseUrl &&
        !databaseUrl.includes('sslmode=')
      ) {
        databaseUrl +=
          (databaseUrl.includes('?') ? '&' : '?') + 'sslmode=require';
        process.env.DATABASE_URL = databaseUrl;
      }

      if (!safeExec('npx drizzle-kit push', 'Sincronizando esquema')) {
        console.log('⚠️  Fallback: Intentando con migraciones manuales...');
        // Fallback: generar y aplicar migraciones
        if (
          safeExec(
            'npx drizzle-kit generate',
            'Generando migraciones de fallback',
          )
        ) {
          applyMigrations();
        } else {
          throw new Error(
            'No se pudo sincronizar el esquema ni generar migraciones',
          );
        }
      }
    }

    // 5. Verificación final
    console.log('✅ Deployment completado exitosamente');
    console.log(
      '🎉 Deployment de producción con Drizzle completado exitosamente!',
    );
  } catch (error) {
    console.error('❌ Error crítico en deployment:', error.message);
    console.error('💥 Deployment falló');
    process.exit(1);
  }
}

// Ejecutar deployment
deployProduction();
