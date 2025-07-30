
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
