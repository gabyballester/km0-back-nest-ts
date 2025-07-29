# 🗄️ Scripts de Migración de Base de Datos

## 📋 Resumen

Este proyecto utiliza **Drizzle ORM** para la gestión de base de datos y proporciona scripts seguros para diferentes entornos.

## 🛡️ Scripts Disponibles

### 🔒 **Desarrollo Seguro** (`db:dev:safe`)

```bash
npm run db:dev:safe
```

**Características:**

- ✅ **Preserva datos existentes**
- ✅ Usa migraciones incrementales
- ✅ Verifica antes de aplicar
- ✅ Logs detallados
- ✅ SSL configurado para desarrollo

**Cuándo usar:**

- Desarrollo diario
- Aplicar nuevas migraciones
- Verificar estado de la base de datos

### 🚨 **Reset de Desarrollo** (`db:dev:reset`)

```bash
npm run db:dev:reset
```

**Características:**

- ⚠️ **DESTRUYE todos los datos existentes**
- 💾 Intenta crear backup automático
- 🔄 Resetea esquema completo
- ✅ Validación post-reset

**Cuándo usar:**

- Solo cuando sea absolutamente necesario
- Cambios estructurales importantes
- Problemas de esquema irresolubles

### 🏭 **Producción** (`db:prod`)

```bash
npm run db:prod
```

**Características:**

- ✅ **100% seguro para producción**
- 🔒 SSL requerido
- 📦 Solo aplica migraciones pendientes
- 🛡️ Validaciones estrictas
- 📊 Logs detallados

**Cuándo usar:**

- Deploy en producción
- Render deployment automático

## 🔧 Configuración

### Variables de Entorno Requeridas

```env
# Desarrollo
DATABASE_URL=postgresql://user:password@localhost:5432/db_name
DATABASE_ORM=drizzle
NODE_ENV=development

# Producción
DATABASE_URL=postgresql://user:password@host:5432/db_name?sslmode=require
DATABASE_ORM=drizzle
NODE_ENV=production
```

### Estructura de Migraciones

```
drizzle/
├── 0000_smart_johnny_storm.sql    # Crear tabla users
├── 0001_ordinary_mongu.sql        # Agregar columnas
├── 0002_huge_toad.sql            # Agregar phone
└── meta/
    └── _journal.json              # Registro de migraciones
```

## 🚀 Workflow Recomendado

### 1. **Desarrollo Diario**

```bash
# Aplicar migraciones de forma segura
npm run db:dev:safe

# Iniciar servidor de desarrollo
npm run start:dev
```

### 2. **Nuevas Migraciones**

```bash
# Generar nueva migración
npx drizzle-kit generate

# Aplicar migración de forma segura
npm run db:dev:safe
```

### 3. **Reset Completo** (Solo cuando sea necesario)

```bash
# ⚠️ ADVERTENCIA: Esto destruirá todos los datos
npm run db:dev:reset
```

### 4. **Deploy a Producción**

```bash
# Render ejecuta automáticamente
npm run db:prod
```

## 🛡️ Garantías de Seguridad

### **Desarrollo Seguro**

- ✅ Nunca destruye datos existentes
- ✅ Usa `drizzle-kit migrate` (incremental)
- ✅ Verifica antes de aplicar
- ✅ Fallback seguro si falla

### **Producción**

- ✅ Solo aplica migraciones pendientes
- ✅ SSL requerido
- ✅ Validaciones estrictas
- ✅ Logs detallados para debugging

### **Reset**

- ⚠️ Solo en desarrollo
- 💾 Intenta backup automático
- 🚨 Advertencias claras
- ✅ Confirmación requerida

## 🔍 Troubleshooting

### Error: "No se pudieron verificar migraciones pendientes"

```bash
# Verificar conectividad
npx drizzle-kit check

# Verificar variables de entorno
echo $DATABASE_URL
echo $NODE_ENV
```

### Error: "SSL connection required"

```bash
# Agregar SSL a la URL
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

### Error: "Schema out of sync"

```bash
# Verificar diferencias
npx drizzle-kit check

# Generar migración si es necesario
npx drizzle-kit generate
```

## 📊 Monitoreo

### Logs de Desarrollo

```bash
npm run db:dev:safe
# Muestra: Estado inicial, migraciones pendientes, resultado
```

### Logs de Producción

```bash
npm run db:prod
# Muestra: Validaciones SSL, migraciones aplicadas, estado final
```

## 🔄 Migración desde Prisma

Si vienes de Prisma, los scripts antiguos siguen disponibles:

```bash
# Prisma (legacy)
npm run db:dev          # ⚠️ Destruye datos
npm run db:test         # ⚠️ Destruye datos

# Drizzle (recomendado)
npm run db:dev:safe     # ✅ Preserva datos
npm run db:prod         # ✅ Seguro para producción
```

## 📝 Notas Importantes

1. **Siempre usa `db:dev:safe`** para desarrollo diario
2. **Solo usa `db:dev:reset`** cuando sea absolutamente necesario
3. **Verifica logs** antes de proceder
4. **Backup manual** si tienes datos importantes
5. **Test en desarrollo** antes de producción

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs detallados
2. Verifica variables de entorno
3. Consulta la documentación de Drizzle
4. Revisa el estado de la base de datos
5. Contacta al equipo de desarrollo
