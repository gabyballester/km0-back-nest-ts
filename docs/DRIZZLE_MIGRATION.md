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

### **🔄 Scripts de Gestión Robusta de Migraciones (NUEVO)**

```bash
# Gestión inteligente de migraciones
npm run migration:status         # Ver estado de migraciones
npm run migration:generate       # Generar migraciones
npm run migration:apply          # Aplicar migraciones
npm run migration:reset          # Resetear migraciones
npm run migration:validate       # Validar estado
npm run migration:full           # Workflow completo
```

**Características del Gestor de Migraciones:**

- ✅ **Detección automática** de migraciones pendientes
- ✅ **Validación de estado** antes y después de operaciones
- ✅ **SSL automático** en producción
- ✅ **Workflow completo** con validaciones
- ✅ **Reseteo seguro** de migraciones
- ✅ **Logging detallado** de operaciones

### **🔧 Scripts de Respaldo (Prisma)**

```bash
# Prisma directo (bypass del manager)
npm run db:prisma:generate       # prisma generate
npm run db:prisma:migrate        # prisma migrate dev
npm run db:prisma:migrate:deploy # prisma migrate deploy
npm run db:prisma:studio         # prisma studio
npm run db:prisma:push           # prisma db push
npm run db:prisma:reset          # prisma migrate reset

# Prisma por entorno
npm run db:prisma:dev            # Push en desarrollo
npm run db:prisma:test           # Push en test
npm run db:prisma:prod           # Deploy en producción
npm run db:prisma:studio:dev     # Studio en desarrollo
npm run db:prisma:studio:test    # Studio en test
```

## **🎯 WORKFLOW ROBUSTO DE MIGRACIONES**

### **Estrategia de Deployment (v3.0)**

El nuevo sistema de deployment implementa una estrategia robusta que:

1. **Detecta automáticamente** el estado de migraciones
2. **Valida** la configuración SSL en producción
3. **Aplica migraciones** de forma segura
4. **Valida** el estado final
5. **Proporciona fallbacks** inteligentes

### **Workflow Recomendado**

#### **Para Desarrollo:**

```bash
# Cambios rápidos en desarrollo
npm run db:dev                    # Push directo
npm run db:drizzle:push           # Push específico de Drizzle
```

#### **Para Producción:**

```bash
# Workflow robusto para producción
npm run migration:full            # Workflow completo
npm run db:prod                   # Deployment automatizado
```

#### **Para Cambios en el Esquema:**

```bash
# 1. Hacer cambios en el esquema
# 2. Generar migración
npm run migration:generate

# 3. Aplicar migración
npm run migration:apply

# 4. Validar estado
npm run migration:validate
```

### **Gestión de Estados**

#### **Estado Válido:**

- ✅ Migraciones en proyecto: SÍ
- ✅ Migraciones pendientes: NO
- ✅ Base de datos sincronizada

#### **Estados Problemáticos:**

- ⚠️ Migraciones en proyecto: NO
- ⚠️ Migraciones pendientes: SÍ
- ❌ Base de datos inconsistente

### **Resolución de Problemas**

#### **Si no hay migraciones:**

```bash
npm run migration:generate        # Generar migraciones
npm run migration:apply           # Aplicar migraciones
```

#### **Si hay migraciones pendientes:**

```bash
npm run migration:apply           # Aplicar migraciones pendientes
npm run migration:validate        # Validar estado
```

#### **Si hay inconsistencias:**

```bash
npm run migration:reset           # Resetear migraciones
npm run migration:full            # Workflow completo
```

## **🔧 CONFIGURACIÓN TÉCNICA**

### **Variables de Entorno**

```bash
# ORM Principal
DATABASE_ORM=drizzle

# Configuración de Base de Datos
DATABASE_URL=postgresql://...

# Configuración SSL (automática en producción)
# sslmode=require se añade automáticamente
```

### **Archivos de Configuración**

```typescript
// drizzle.config.ts
export default defineConfig({
  schema: './src/infrastructure/database/schemas/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false, sslmode: 'require' }
        : false,
  },
});
```

### **Estructura de Migraciones**

```
drizzle/
├── 0000_smart_johnny_storm.sql    # Migración inicial
├── 0001_add_new_table.sql         # Migraciones incrementales
├── meta/
│   ├── _journal.json              # Control de versiones
│   └── 0000_snapshot.json         # Snapshot del esquema
```

## **🚨 TROUBLESHOOTING**

### **Problemas Comunes**

#### **1. Migraciones Pendientes**

```bash
# Verificar estado
npm run migration:status

# Aplicar migraciones
npm run migration:apply
```

#### **2. Esquema Inconsistente**

```bash
# Validar estado
npm run migration:validate

# Resetear si es necesario
npm run migration:reset
```

#### **3. Error SSL en Producción**

```bash
# Verificar configuración SSL
npm run db:check:ssl

# El script de deployment maneja SSL automáticamente
```

### **Logs de Diagnóstico**

```bash
# Ver logs detallados
npm run migration:full

# Ver estado actual
npm run migration:status
```

## **📚 RECURSOS ADICIONALES**

- [Documentación de Drizzle ORM](https://orm.drizzle.team/)
- [Guía de Migraciones](./TROUBLESHOOTING.md)
- [Estado de Deployment](./DEPLOYMENT_STATUS.md)
- [Configuración de Entornos](./ENVIRONMENT.md)
