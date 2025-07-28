# 📋 **CHANGELOG - KM0 Market Backend**

## **🔄 Versión 3.0 - Workflow Robusto de Migraciones**

### **📅 Fecha: $(date)**

### **🎯 Nuevas Características**

#### **🔄 Gestor de Migraciones Robusto**

- **Nuevo script**: `scripts/migration-manager.js`
- **Comandos disponibles**:
  - `npm run migration:status` - Ver estado de migraciones
  - `npm run migration:generate` - Generar migraciones
  - `npm run migration:apply` - Aplicar migraciones
  - `npm run migration:reset` - Resetear migraciones
  - `npm run migration:validate` - Validar estado
  - `npm run migration:full` - Workflow completo

#### **🚀 Script de Deployment Mejorado (v3.0)**

- **Detección automática** de migraciones pendientes
- **Validación de estado** antes y después de operaciones
- **SSL automático** en producción
- **Workflow completo** con validaciones
- **Reseteo seguro** de migraciones
- **Logging detallado** de operaciones

### **🔧 Mejoras Técnicas**

#### **Gestión Inteligente de Migraciones**

- ✅ **Detección automática** de migraciones pendientes
- ✅ **Validación de estado** antes y después de operaciones
- ✅ **SSL automático** en producción
- ✅ **Workflow completo** con validaciones
- ✅ **Reseteo seguro** de migraciones
- ✅ **Logging detallado** de operaciones

#### **Estrategia de Deployment Robusta**

- **Opción 1**: Usar migraciones existentes si están disponibles
- **Opción 2**: Generar y aplicar migraciones si no existen
- **Opción 3**: Sincronización como último recurso
- **Validación final** del estado de la base de datos

### **📚 Documentación Actualizada**

- **`docs/DRIZZLE_MIGRATION.md`**: Workflow robusto de migraciones
- **`docs/TROUBLESHOOTING.md`**: Problemas de migraciones vs push
- **`package.json`**: Nuevos scripts de migración

---

## **🔄 Versión 2.0 - Optimización de Scripts**

### **📅 Fecha: $(date)**

### **🔧 Optimizaciones Realizadas**

#### **Script de Deployment Mejorado**

- **Problema**: Script usaba `drizzle-kit push` generando prompts interactivos sobre columnas
- **Solución**: Priorizar `drizzle-kit migrate` cuando existen migraciones
- **Resultado**: Deployment no interactivo y más confiable

#### **Configuración SSL Mejorada**

- **Problema**: Errores SSL/TLS en producción
- **Solución**: Configuración SSL explícita en `drizzle.config.ts` y scripts
- **Resultado**: Conexiones seguras en producción

#### **Optimización de Scripts npm**

- **Problema**: Scripts `build` y `build:prod` redundantes
- **Solución**: Eliminar `build:prod`, mantener solo `build`
- **Resultado**: Scripts más limpios y mantenibles

### **📁 Archivos Modificados**

- **`scripts/drizzle-production-deploy.js`**: Versión 2.0 con lógica mejorada
- **`drizzle.config.ts`**: Configuración SSL para producción
- **`package.json`**: Eliminación de script redundante
- **`render.yaml`**: Actualización de comando de build

---

## **🔄 Versión 1.0 - Migración a Drizzle ORM**

### **📅 Fecha: $(date)**

### **🎯 Cambios Principales**

#### **Migración de Prisma a Drizzle ORM**

- **ORM Principal**: Drizzle ORM para todos los entornos
- **ORM de Respaldo**: Prisma mantenido para compatibilidad
- **Configuración**: `DATABASE_ORM=drizzle` por defecto

#### **Estructura de Base de Datos**

- **Esquemas**: Migrados a Drizzle con mapeo explícito
- **Migraciones**: Sistema de migraciones SQL de Drizzle
- **Configuración**: SSL automático en producción

#### **Scripts de Gestión**

- **Manager inteligente**: `scripts/db-manager.js`
- **Health checks**: Scripts de validación de estado
- **Backup y restore**: Sistema completo de respaldos
- **Migración de datos**: Herramientas para migrar entre ORMs

### **🔧 Mejoras Técnicas**

#### **Rendimiento**

- **Más rápido** que Prisma en operaciones complejas
- **Menor overhead** de memoria
- **Mejor rendimiento** en consultas anidadas

#### **TypeScript**

- **Type-safe** por defecto
- **Mejor inferencia** de tipos
- **Menos código boilerplate**

#### **Flexibilidad**

- **SQL raw** más fácil de usar
- **Más control** sobre las consultas
- **Mejor integración** con SQL nativo

### **📁 Archivos Creados/Modificados**

- **`src/infrastructure/database/schemas/user.schema.ts`**: Esquema Drizzle
- **`src/infrastructure/database/adapters/drizzle.adapter.ts`**: Adaptador Drizzle
- **`drizzle.config.ts`**: Configuración Drizzle Kit
- **`scripts/db-manager.js`**: Manager inteligente de ORMs
- **`docs/DRIZZLE_MIGRATION.md`**: Documentación de migración

---

## **🔄 Versión 0.5 - Simplificación de API**

### **📅 Fecha: $(date)**

### **🎯 Decisiones de Diseño**

#### **Eliminación de Versionado de API**

- **Problema**: API versionada muy verbosa
- **Solución**: API simple sin versionado
- **Resultado**: URLs más limpias y mantenimiento más fácil

#### **Eliminación de Prefijo `/api`**

- **Problema**: Warning `LegacyRouteConverter` con prefijo `/api`
- **Solución**: Eliminar prefijo global
- **Resultado**: URLs directas sin warnings

### **🔧 Cambios Técnicos**

#### **Controladores**

- **Antes**: `@Controller('api/v1/example')`
- **Después**: `@Controller('example')`

#### **Constantes de API**

- **Eliminadas**: Constantes de versionado
- **Simplificadas**: Constantes de rutas básicas
- **Añadidas**: Helper para URLs base por entorno

### **📁 Archivos Modificados**

- **`src/main.ts`**: Eliminación de `setGlobalPrefix`
- **`src/shared/constants/api.ts`**: Simplificación de constantes
- **`src/modules/example/example.controller.ts`**: Rutas simplificadas
- **`docs/API_VERSIONING.md`**: Documentación actualizada

---

## **🔄 Versión 0.1 - Configuración Inicial**

### **📅 Fecha: $(date)**

### **🎯 Características Iniciales**

#### **Arquitectura Base**

- **Framework**: NestJS con TypeScript
- **ORM**: Prisma ORM inicial
- **Base de datos**: PostgreSQL
- **Documentación**: Swagger/OpenAPI

#### **Configuración de Entornos**

- **Desarrollo**: Configuración local
- **Testing**: Configuración de tests
- **Producción**: Configuración para deployment

#### **Scripts de Desarrollo**

- **Build**: Compilación con SWC
- **Tests**: Jest con coverage
- **Linting**: ESLint + Prettier
- **Type checking**: TypeScript estricto

### **📁 Estructura Inicial**

- **`src/`**: Código fuente principal
- **`docs/`**: Documentación del proyecto
- **`scripts/`**: Scripts de utilidad
- **`test/`**: Tests unitarios y e2e
