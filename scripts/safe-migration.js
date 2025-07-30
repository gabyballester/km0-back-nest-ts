#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Script para hacer migraciones seguras sin perder datos
 * Maneja la migración de tablas existentes de forma incremental
 */

console.log('🔄 Iniciando migración segura...\n');

// Función para ejecutar comandos SQL directamente
function executeSQL(sql, description) {
  try {
    console.log(`📝 ${description}...`);

    // Obtener la URL de la base de datos desde las variables de entorno
    const envPath = path.join(__dirname, '..', '.env.development');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);

    if (!dbUrlMatch) {
      throw new Error('No se pudo encontrar DATABASE_URL en .env.development');
    }

    const dbUrl = dbUrlMatch[1];

    // Extraer información de la URL de la base de datos
    const urlMatch = dbUrl.match(
      /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/,
    );
    if (!urlMatch) {
      throw new Error('Formato de DATABASE_URL inválido');
    }

    const [, user, password, host, port, database] = urlMatch;

    // Crear archivo SQL temporal
    const tempSqlFile = path.join(__dirname, 'temp_migration.sql');
    fs.writeFileSync(tempSqlFile, sql);

    // Ejecutar SQL usando psql
    const psqlCommand = `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${user} -d ${database} -f "${tempSqlFile}"`;

    execSync(psqlCommand, { stdio: 'inherit' });

    // Limpiar archivo temporal
    fs.unlinkSync(tempSqlFile);

    console.log(`✅ ${description} completado`);
    return true;
  } catch (error) {
    console.error(`❌ Error en ${description}:`, error.message);
    return false;
  }
}

// Migración segura para la tabla users
const usersMigration = `
-- Migración segura para tabla users
-- Añadir columna updatedAt si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'users' AND column_name = 'updatedAt') THEN
        ALTER TABLE "users" ADD COLUMN "updatedAt" TIMESTAMP(3);
        UPDATE "users" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;
        ALTER TABLE "users" ALTER COLUMN "updatedAt" SET NOT NULL;
    END IF;
END $$;
`;

// Migración segura para la tabla profiles
const profilesMigration = `
-- Migración segura para tabla profiles
-- Crear tabla profiles si no existe
CREATE TABLE IF NOT EXISTS "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20),
    "language" VARCHAR(10) NOT NULL DEFAULT 'es',
    "city" VARCHAR(100),
    "postalCode" VARCHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- Añadir columna userId si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'profiles' AND column_name = 'userId') THEN
        ALTER TABLE "profiles" ADD COLUMN "userId" TEXT;
    END IF;
END $$;

-- Crear índices si no existen
CREATE INDEX IF NOT EXISTS "profiles_userId_key" ON "profiles"("userId");
CREATE INDEX IF NOT EXISTS "profiles_userId_idx" ON "profiles"("userId");

-- Crear constraint unique si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_userId_key') THEN
        ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_key" UNIQUE ("userId");
    END IF;
END $$;

-- Crear foreign key si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_userId_fkey') THEN
        ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
`;

// Ejecutar migraciones
console.log('🔄 Ejecutando migraciones seguras...\n');

const usersSuccess = executeSQL(usersMigration, 'Migración de tabla users');
const profilesSuccess = executeSQL(
  profilesMigration,
  'Migración de tabla profiles',
);

if (usersSuccess && profilesSuccess) {
  console.log('\n🎉 ¡Migración segura completada exitosamente!');
  console.log('\n📝 Próximos pasos:');
  console.log('1. npm run db:generate');
  console.log('2. npm run start:dev');
} else {
  console.log('\n⚠️  Algunas migraciones fallaron. Revisa los errores arriba.');
  process.exit(1);
}
