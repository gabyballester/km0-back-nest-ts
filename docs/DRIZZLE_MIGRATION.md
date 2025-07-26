# 🗄️ **MIGRACIÓN A DRIZZLE ORM**

## **📋 RESUMEN**

Este proyecto ha migrado de **Prisma ORM** a **Drizzle ORM** manteniendo compatibilidad con ambos ORMs. Drizzle está configurado como ORM principal para todos los entornos (desarrollo, test, producción), pero Prisma se mantiene como respaldo.

## **🎯 CONFIGURACIÓN ACTUAL**

### **ORM Principal: Drizzle**

- **Desarrollo**: `DATABASE_ORM=drizzle`
- **Testing**: `DATABASE_ORM=drizzle`
- **Producción**: `DATABASE_ORM=drizzle`

### **ORM de Respaldo: Prisma**

- Mantenido para migración de datos y respaldo
- Scripts específicos disponibles: `db:prisma:*`

## **🔧 SCRIPTS DISPONIBLES**

### **🚀 Scripts de Configuración**

```bash
# Configuración automática
npm run db:setup                    # Setup completo
npm run db:setup:skip-validation    # Setup sin validación
npm run db:setup:skip-migration     # Setup sin migración inicial
```

### **🏥 Scripts de Health Check**

```bash
# Health check completo
npm run db:health                   # Health check del entorno actual
npm run db:health:dev              # Health check desarrollo
npm run db:health:test             # Health check test
npm run db:health:prod             # Health check producción
npm run db:health:skip-connection  # Health check sin conexión
npm run db:health:skip-data        # Health check sin verificación de datos
```

### **💾 Scripts de Backup y Restore**

```bash
# Backup y restore
npm run db:backup:create            # Crear backup completo
npm run db:backup:create:data       # Crear backup de datos (JSON)
npm run db:backup:create:full       # Crear backup completo (SQL)
npm run db:backup:restore <file>    # Restaurar backup
npm run db:backup:list              # Listar backups disponibles
```

### **🎯 Scripts Principales (Inteligentes - Detectan ORM)**

```bash
# Operaciones básicas (usan el ORM configurado en DATABASE_ORM)
npm run db:generate      # Genera cliente/esquemas
npm run db:push          # Push schema a BD
npm run db:migrate       # Ejecuta migraciones
npm run db:migrate:deploy # Deploy migraciones
npm run db:reset         # Reset base de datos
npm run db:studio        # Abre UI de base de datos
npm run db:seed          # Ejecuta seeders
npm run db:validate      # Valida configuración

# Por entorno (usan el ORM configurado)
npm run db:dev           # Push en desarrollo
npm run db:test          # Push en test
npm run db:prod          # Migrate en producción
npm run db:studio:dev    # Studio en desarrollo
npm run db:studio:test   # Studio en test
npm run db:seed:dev      # Seed en desarrollo
npm run db:seed:test     # Seed en test
npm run db:validate:dev  # Validar desarrollo
npm run db:validate:test # Validar test
npm run db:validate:prod # Validar producción
```

### **🌊 Scripts Específicos de Drizzle**

```bash
# Drizzle directo (bypass del manager)
npm run db:drizzle:generate      # drizzle-kit generate
npm run db:drizzle:migrate       # drizzle-kit migrate
npm run db:drizzle:studio        # drizzle-kit studio
npm run db:drizzle:push          # drizzle-kit push
npm run db:drizzle:reset         # drizzle-kit drop && drizzle-kit push

# Drizzle por entorno
npm run db:drizzle:dev           # Push en desarrollo
npm run db:drizzle:test          # Push en test
npm run db:drizzle:prod          # Migrate en producción
npm run db:drizzle:studio:dev    # Studio en desarrollo
npm run db:drizzle:studio:test   # Studio en test
```

### **🔧 Scripts de Respaldo (Prisma)**

```bash
# Prisma directo (bypass del manager)
npm run db:prisma:generate       # prisma generate
npm run db:prisma:push           # prisma db push
npm run db:prisma:migrate        # prisma migrate dev
npm run db:prisma:migrate:deploy # prisma migrate deploy
npm run db:prisma:reset          # prisma migrate reset --force
npm run db:prisma:studio         # prisma studio

# Prisma por entorno
npm run db:prisma:dev            # Push en desarrollo
npm run db:prisma:test           # Push en test
npm run db:prisma:prod           # Migrate en producción
npm run db:prisma:studio:dev     # Studio en desarrollo
npm run db:prisma:studio:test    # Studio en test
npm run db:prisma:studio:prod    # Studio en producción
```

### **🔄 Scripts de Migración de Datos**

```bash
# Migración entre ORMs
npm run db:migrate:data:export-prisma <file>     # Exportar desde Prisma
npm run db:migrate:data:import-drizzle <file>    # Importar a Drizzle
npm run db:migrate:data:prisma-to-drizzle        # Migración completa
npm run db:migrate:data:backup <file>            # Backup actual
```

## **📁 ESTRUCTURA DE ARCHIVOS**

### **Drizzle**

```
src/infrastructure/database/
├── schemas/
│   └── user.schema.ts          # Esquema de usuario
├── adapters/
│   ├── drizzle.adapter.ts      # Adaptador Drizzle
│   └── prisma.adapter.ts       # Adaptador Prisma (respaldo)
├── interfaces/
│   ├── database.adapter.interface.ts
│   └── repository.interface.ts
├── factory/
│   └── database.factory.ts     # Factory para seleccionar ORM
└── database.module.ts          # Módulo NestJS
```

### **Configuración**

```
drizzle.config.ts               # Configuración Drizzle Kit
prisma/
├── schema.prisma              # Esquema Prisma (respaldo)
└── migrations/                # Migraciones Prisma (respaldo)
```

### **Scripts y Utilidades**

```
scripts/
├── db-manager.js              # Manager inteligente de ORMs
├── db-validate.js             # Validación de configuración
├── db-health.js               # Health check avanzado
├── db-backup.js               # Backup y restore
├── migrate-data.js            # Migración entre ORMs
└── setup-db.js                # Configuración automática

data/
├── seed-dev.json              # Datos de desarrollo
└── seed-test.json             # Datos de test

backups/                       # Directorio de backups
```

## **🔐 VARIABLES DE ENTORNO**

### **Requeridas**

```bash
DATABASE_URL=postgresql://user:password@host:port/database_name
DATABASE_ORM=drizzle  # o 'prisma' para respaldo
```

### **Opcionales**

```bash
SEED_ENABLED=true
SEED_DATA_PATH=./data/seed.json
```

## **🚀 FLUJO DE TRABAJO**

### **Configuración Inicial**

```bash
# 1. Setup automático
npm run db:setup

# 2. Verificar configuración
npm run db:health:dev

# 3. Configurar variables de entorno
# Editar .env.development, .env.test, .env

# 4. Validar configuración
npm run db:validate:dev
```

### **Desarrollo Diario**

```bash
# 1. Health check
npm run db:health:dev

# 2. Generar esquemas
npm run db:generate

# 3. Aplicar cambios
npm run db:push

# 4. Ejecutar seeders
npm run db:seed:dev

# 5. Abrir studio
npm run db:studio:dev
```

### **Testing**

```bash
# 1. Health check
npm run db:health:test

# 2. Resetear base de datos
npm run db:reset

# 3. Aplicar esquema
npm run db:push

# 4. Ejecutar seeders de test
npm run db:seed:test
```

### **Producción**

```bash
# 1. Health check
npm run db:health:prod

# 2. Generar esquemas
npm run db:generate

# 3. Deploy migraciones
npm run db:prod
```

### **Backup y Restore**

```bash
# Crear backup
npm run db:backup:create:data

# Listar backups
npm run db:backup:list

# Restaurar backup
npm run db:backup:restore backup-data-2024-01-01.json
```

## **🔄 MIGRACIÓN DE DATOS**

### **De Prisma a Drizzle**

```bash
# Migración completa automática
npm run db:migrate:data:prisma-to-drizzle

# O paso a paso
npm run db:migrate:data:export-prisma backup.json
npm run db:migrate:data:import-drizzle backup.json
```

### **Backup de Datos Actuales**

```bash
npm run db:migrate:data:backup backup-$(date +%Y%m%d).json
```

## **🔧 CAMBIAR ENTRE ORMs**

### **Cambiar a Prisma Temporalmente**

```bash
# 1. Cambiar variable de entorno
export DATABASE_ORM=prisma

# 2. O usar scripts específicos
npm run db:prisma:generate
npm run db:prisma:push
npm run db:prisma:studio
```

### **Volver a Drizzle**

```bash
# 1. Cambiar variable de entorno
export DATABASE_ORM=drizzle

# 2. O usar scripts específicos
npm run db:drizzle:generate
npm run db:drizzle:push
npm run db:drizzle:studio
```

## **📊 VENTAJAS DE DRIZZLE**

### **✅ Rendimiento**

- **Más rápido** que Prisma en operaciones complejas
- **Menor overhead** de memoria
- **Mejor rendimiento** en consultas anidadas

### **✅ TypeScript**

- **Type-safe** por defecto
- **Mejor inferencia** de tipos
- **Menos código boilerplate**

### **✅ Flexibilidad**

- **SQL raw** más fácil de usar
- **Más control** sobre las consultas
- **Mejor integración** con SQL nativo

### **✅ Mantenimiento**

- **Menos dependencias** que Prisma
- **Configuración más simple**
- **Mejor documentación** de la API

## **⚠️ CONSIDERACIONES**

### **Diferencias con Prisma**

1. **Migraciones**: Drizzle usa archivos SQL, Prisma usa archivos de migración
2. **Studio**: Drizzle Studio es más básico que Prisma Studio
3. **Seeders**: Drizzle requiere implementación manual de seeders
4. **Relaciones**: Drizzle maneja las relaciones de forma diferente

### **Compatibilidad**

- **Ambos ORMs** pueden coexistir en el mismo proyecto
- **Migración de datos** disponible entre ORMs
- **Scripts de respaldo** para volver a Prisma si es necesario

## **🔍 TROUBLESHOOTING**

### **Problemas Comunes**

#### **Error de Conexión**

```bash
# Verificar configuración
npm run db:health

# Verificar variables de entorno
echo $DATABASE_URL
echo $DATABASE_ORM
```

#### **Error de Migración**

```bash
# Resetear base de datos
npm run db:reset

# Regenerar esquemas
npm run db:generate
```

#### **Error de Tipos**

```bash
# Regenerar cliente Prisma (si usas respaldo)
npm run db:prisma:generate

# Verificar tipos TypeScript
npm run type-check
```

#### **Problemas de Setup**

```bash
# Setup automático
npm run db:setup

# Verificar health
npm run db:health:dev
```

## **📚 RECURSOS**

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Drizzle Kit Documentation](https://orm.drizzle.team/kit-docs/overview)
- [NestJS Integration](https://orm.drizzle.team/docs/get-started-postgresql#nestjs)
- [Migration Guide](https://orm.drizzle.team/docs/migrations)
