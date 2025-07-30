#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script para configurar automáticamente los archivos de entorno
 * Copia los archivos de ejemplo a los archivos reales
 */

const envFiles = [
  {
    source: 'env.development.example',
    target: '.env.development',
    description: 'Desarrollo',
  },
  {
    source: 'env.test.example',
    target: '.env.test',
    description: 'Testing',
  },
];

function copyEnvFile(source, target, description) {
  const sourcePath = path.join(__dirname, '..', source);
  const targetPath = path.join(__dirname, '..', target);

  if (!fs.existsSync(sourcePath)) {
    console.log(`❌ Archivo fuente no encontrado: ${source}`);
    return false;
  }

  if (fs.existsSync(targetPath)) {
    console.log(`⚠️  El archivo ${target} ya existe, saltando...`);
    return true;
  }

  try {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ Archivo ${target} creado para ${description}`);
    return true;
  } catch (error) {
    console.error(`❌ Error al crear ${target}:`, error.message);
    return false;
  }
}

function createMainEnvFile() {
  const mainEnvPath = path.join(__dirname, '..', '.env');

  if (fs.existsSync(mainEnvPath)) {
    console.log('⚠️  El archivo .env ya existe, saltando...');
    return true;
  }

  const mainEnvContent = `# ========================================
# 🗄️ CONFIGURACIÓN DE BASE DE DATOS
# ========================================

# ORM Principal: Prisma
DATABASE_ORM=prisma

# ========================================
# 🔐 CONFIGURACIÓN DE SEGURIDAD
# ========================================

# Tiempo de expiración del token JWT (en segundos)
JWT_EXPIRES_IN=86400

# ========================================
# 📧 CONFIGURACIÓN DE EMAIL
# ========================================

# Servidor SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email de origen
FROM_EMAIL=noreply@km0.com
FROM_NAME=KM0 Market

# ========================================
# 📊 CONFIGURACIÓN DE LOGGING
# ========================================

# Nivel de logging
LOG_LEVEL=info
`;

  try {
    fs.writeFileSync(mainEnvPath, mainEnvContent);
    console.log('✅ Archivo .env creado con variables comunes');
    return true;
  } catch (error) {
    console.error('❌ Error al crear .env:', error.message);
    return false;
  }
}

console.log('🚀 Configurando archivos de entorno...\n');

// Crear archivo .env principal
const mainEnvCreated = createMainEnvFile();

// Copiar archivos de entorno específicos
let successCount = 0;
for (const envFile of envFiles) {
  if (copyEnvFile(envFile.source, envFile.target, envFile.description)) {
    successCount++;
  }
}

console.log(`\n📊 Resumen:`);
console.log(`- Archivos creados: ${successCount + (mainEnvCreated ? 1 : 0)}`);
console.log(
  `- Archivos existentes: ${envFiles.length + 1 - (successCount + (mainEnvCreated ? 1 : 0))}`,
);

if (successCount === envFiles.length && mainEnvCreated) {
  console.log('\n🎉 ¡Configuración de entorno completada exitosamente!');
  console.log('\n📝 Próximos pasos:');
  console.log('1. Revisar y ajustar las variables en los archivos .env*');
  console.log('2. Configurar la base de datos PostgreSQL');
  console.log('3. Ejecutar: npm run db:generate');
  console.log('4. Ejecutar: npm run db:dev');
  console.log('5. Ejecutar: npm run start:dev');
} else {
  console.log(
    '\n⚠️  Algunos archivos no pudieron ser creados. Revisa los errores arriba.',
  );
}
