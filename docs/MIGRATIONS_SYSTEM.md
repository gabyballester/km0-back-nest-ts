# 🗄️ Sistema de Migraciones Automatizado

## 📋 **Descripción General**

El sistema de migraciones automatizado proporciona un workflow completo y robusto para gestionar cambios en la base de datos, asegurando que tanto el desarrollo local como la producción mantengan esquemas sincronizados.

## 🏗️ **Arquitectura del Sistema**

### **Componentes Principales:**

1. **Drizzle ORM**: Generación y aplicación de migraciones SQL
2. **Prisma ORM**: Sincronización de esquemas y generación de cliente
3. **Scripts Automatizados**: Workflow completo de migraciones
4. **Verificación de Estado**: Control de integridad del sistema

### **Flujo de Trabajo:**

```
Cambio en Schema → Generar Migración → Aplicar → Sincronizar Prisma → Verificar
```

## 🚀 **Workflow Automatizado**

### **Comando Principal:**

```bash
npm run migration:workflow
```

### **Pasos Automatizados:**

1. **Verificación Inicial**
   - Comprueba el estado del proyecto
   - Identifica la última migración
   - Valida la estructura de archivos

2. **Generación de Migración**
   - Analiza cambios en el schema Drizzle
   - Genera archivo SQL de migración
   - Valida la sintaxis SQL

3. **Aplicación de Migración**
   - Ejecuta la migración en la base de datos
   - Verifica el éxito de la operación
   - Actualiza el registro de migraciones

4. **Sincronización Prisma**
   - Sincroniza el schema Prisma con la BD
   - Mantiene compatibilidad entre ORMs
   - Genera el cliente Prisma actualizado

5. **Verificación Final**
   - Comprueba el estado de las migraciones
   - Valida la integridad del sistema
   - Limpia carpetas dist innecesarias

## 📁 **Estructura de Archivos**

```
drizzle/
├── 0000_smart_johnny_storm.sql    # Migración inicial
├── 0001_ordinary_mongu.sql        # Migración de campos básicos
├── 0002_huge_toad.sql             # Migración de campo phone
└── meta/                          # Metadatos de migraciones

prisma/
├── schema.prisma                  # Schema Prisma (sincronizado)
└── migrations/                    # Migraciones Prisma (legacy)

scripts/
├── migration-manager.js           # Gestor de migraciones
├── migration-workflow.js          # Workflow automatizado
└── clean-unnecessary-dist.js      # Limpieza de carpetas dist
```

## 🛠️ **Comandos Disponibles**

### **Workflow Completo:**

```bash
npm run migration:workflow
```

### **Comandos Individuales:**

#### **Generación:**

```bash
npm run migration:generate    # Generar migración Drizzle
npm run db:generate          # Generar cliente Prisma
```

#### **Aplicación:**

```bash
npm run migration:apply      # Aplicar migración
npm run db:dev              # Sincronizar Prisma
```

#### **Verificación:**

```bash
npm run migration:status     # Estado de migraciones
npm run migration:validate   # Validar migraciones
```

#### **Limpieza:**

```bash
npm run clean:unnecessary-dist  # Limpiar carpetas dist
npm run check:dist             # Verificar carpetas dist
```

## 🔄 **Proceso de Desarrollo**

### **1. Hacer Cambios en el Schema:**

```typescript
// src/infrastructure/database/schemas/user.schema.ts
export const users = pgTable('users', {
  // ... campos existentes
  phone: varchar('phone', { length: 20 }), // Nuevo campo
});
```

### **2. Ejecutar Workflow:**

```bash
npm run migration:workflow
```

### **3. Verificar Resultado:**

- ✅ Migración generada: `0003_nueva_migracion.sql`
- ✅ Campo añadido a la base de datos
- ✅ Schema Prisma sincronizado
- ✅ Cliente Prisma actualizado
- ✅ Tests pasando

## 🏭 **Proceso de Producción**

### **Despliegue Seguro:**

1. **Backup de Base de Datos:**

   ```bash
   npm run db:backup
   ```

2. **Aplicar Migraciones:**

   ```bash
   npm run migration:apply
   ```

3. **Verificar Estado:**

   ```bash
   npm run migration:status
   ```

4. **Desplegar Aplicación:**

   ```bash
   npm run build
   npm run start:prod
   ```

### **Rollback (si es necesario):**

```bash
npm run migration:reset
```

## 🔍 **Verificaciones de Seguridad**

### **Antes de Aplicar Migraciones:**

1. **Validación de Schema:**
   - Sintaxis SQL correcta
   - Compatibilidad con datos existentes
   - No pérdida de datos

2. **Verificación de Estado:**
   - Base de datos accesible
   - Migraciones anteriores aplicadas
   - Sin conflictos de esquema

3. **Limpieza Automática:**
   - Eliminación de carpetas dist innecesarias
   - Verificación de integridad del proyecto

## 📊 **Monitoreo y Logs**

### **Logs del Workflow:**

```
🚀 WORKFLOW AUTOMATIZADO DE MIGRACIONES
========================================

🔧 Verificando
Estado inicial del proyecto
ℹ️  Encontrados 3 archivos de migración
ℹ️  Última migración: 0002_huge_toad.sql

🔧 Ejecutando
Generar migración Drizzle
✅ Generar migración Drizzle completado exitosamente

📋 RESUMEN DEL WORKFLOW
========================================
✅ Nueva migración creada: 0003_nueva_migracion.sql
✅ Migración aplicada a la base de datos
✅ Cliente Prisma generado
✅ Workflow completado exitosamente
```

### **Estados de Verificación:**

- ✅ **Éxito**: Operación completada correctamente
- ⚠️ **Advertencia**: Problema menor, continuando
- ❌ **Error**: Fallo crítico, deteniendo proceso

## 🚨 **Manejo de Errores**

### **Errores Comunes:**

1. **Migración ya aplicada:**

   ```
   ⚠️ No se generó una nueva migración. No hay cambios en el schema.
   ```

2. **Base de datos no accesible:**

   ```
   ❌ No se pudo aplicar la migración
   ```

3. **Conflictos de esquema:**

   ```
   ❌ No se pudo sincronizar Prisma. Verifica manualmente.
   ```

### **Recuperación de Errores:**

1. **Verificar conectividad de BD**
2. **Revisar logs de error**
3. **Ejecutar validación manual**
4. **Contactar administrador de BD si es necesario**

## 🔧 **Configuración Avanzada**

### **Variables de Entorno:**

```env
# Base de datos
DATABASE_URL=postgresql://user:pass@localhost:5432/km0_db_dev

# Entorno
NODE_ENV=development

# Configuración de migraciones
MIGRATION_TIMEOUT=30000
MIGRATION_RETRY_ATTEMPTS=3
```

### **Configuración de Drizzle:**

```typescript
// drizzle.config.ts
export default {
  schema: './src/infrastructure/database/schemas/*',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
};
```

## 📈 **Métricas y Rendimiento**

### **Tiempos Promedio:**

- **Generación de migración**: ~2-5 segundos
- **Aplicación de migración**: ~1-3 segundos
- **Sincronización Prisma**: ~2-4 segundos
- **Workflow completo**: ~10-15 segundos

### **Optimizaciones:**

- Ejecución paralela de operaciones independientes
- Caché de validaciones de esquema
- Limpieza automática de archivos temporales

## 🎯 **Mejores Prácticas**

### **Desarrollo:**

1. **Siempre usar el workflow automatizado**
2. **Verificar tests después de migraciones**
3. **Documentar cambios significativos**
4. **Hacer backup antes de cambios importantes**

### **Producción:**

1. **Probar migraciones en staging primero**
2. **Programar ventanas de mantenimiento**
3. **Tener plan de rollback preparado**
4. **Monitorear logs de aplicación post-migración**

### **Mantenimiento:**

1. **Revisar migraciones antiguas periódicamente**
2. **Limpiar archivos de migración obsoletos**
3. **Actualizar documentación con cambios**
4. **Verificar integridad de esquemas regularmente**

## 🔮 **Futuras Mejoras**

### **Funcionalidades Planificadas:**

- [ ] Migraciones con dependencias entre tablas
- [ ] Rollback automático en caso de error
- [ ] Migraciones con datos de seed
- [ ] Validación de integridad referencial
- [ ] Migraciones con versionado semántico
- [ ] Dashboard web para gestión de migraciones

### **Integración CI/CD:**

- [ ] Pipeline automático de migraciones
- [ ] Validación en pull requests
- [ ] Despliegue automático en staging
- [ ] Notificaciones de estado de migraciones

---

**Última actualización**: Enero 2024
**Versión del sistema**: 1.0.0
**Mantenido por**: Equipo de Desarrollo KM0 Market
