# 🛡️ Sistema de Seguridad de Base de Datos

## 📋 **Descripción General**

El Sistema de Seguridad de Base de Datos es una capa de protección robusta diseñada para **prevenir la destrucción accidental de datos**, especialmente en entornos de producción. Implementa múltiples niveles de seguridad basados en las mejores prácticas de NestJS, Drizzle ORM y la comunidad.

## 🎯 **Objetivos de Seguridad**

### **Principales:**

- ✅ **Prevenir destrucción accidental** de la base de datos
- ✅ **Proteger datos de producción** de operaciones peligrosas
- ✅ **Unificar comportamiento** entre desarrollo y producción
- ✅ **Proporcionar confirmaciones** para operaciones críticas
- ✅ **Crear backups automáticos** antes de operaciones peligrosas

### **Secundarios:**

- ✅ **Validar configuración** de seguridad
- ✅ **Monitorear estado** de la base de datos
- ✅ **Registrar operaciones** peligrosas
- ✅ **Proporcionar rollback** automático cuando sea posible

## 🏗️ **Arquitectura del Sistema**

### **Componentes Principales:**

1. **Database Safety Guard** (`scripts/database-safety-guard.js`)
   - Verificación de operaciones peligrosas
   - Confirmación manual para operaciones críticas
   - Creación de backups automáticos
   - Validación de configuración

2. **Niveles de Seguridad Configurables**
   - **Paranoid**: Bloquea TODO en producción
   - **Strict**: Bloquea operaciones destructivas
   - **Relaxed**: Solo advertencias
   - **Disabled**: Sin protección

3. **Integración con Workflow de Migraciones**
   - Verificación automática antes de migraciones
   - Backup automático antes de cambios
   - Validación post-operación

## 🔧 **Configuración del Sistema**

### **Variables de Entorno:**

```env
# Nivel de seguridad (obligatorio)
DATABASE_SAFETY_LEVEL=strict

# Entorno (obligatorio)
NODE_ENV=production

# URL de base de datos (obligatorio)
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
```

### **Niveles de Seguridad:**

#### **1. Paranoid (`paranoid`)**

```env
DATABASE_SAFETY_LEVEL=paranoid
```

- **Comportamiento**: Bloquea TODAS las operaciones en producción
- **Uso**: Entornos críticos donde no se permiten cambios
- **Confirmación**: Requiere `DATABASE_SAFETY_LEVEL=disabled` para operaciones

#### **2. Strict (`strict`) - RECOMENDADO**

```env
DATABASE_SAFETY_LEVEL=strict
```

- **Comportamiento**: Bloquea operaciones destructivas, permite operaciones seguras
- **Uso**: Producción estándar
- **Confirmación**: Requiere confirmación manual para operaciones peligrosas

#### **3. Relaxed (`relaxed`)**

```env
DATABASE_SAFETY_LEVEL=relaxed
```

- **Comportamiento**: Solo muestra advertencias
- **Uso**: Desarrollo avanzado
- **Confirmación**: No requiere confirmación

#### **4. Disabled (`disabled`)**

```env
DATABASE_SAFETY_LEVEL=disabled
```

- **Comportamiento**: Sin protección
- **Uso**: Solo para emergencias
- **Confirmación**: No requiere confirmación

## 🚨 **Operaciones Peligrosas Detectadas**

### **Operaciones de Reset/Destrucción:**

- `reset` - Reset de base de datos
- `drop` - Eliminación de tablas/base de datos
- `delete` - Eliminación masiva de datos
- `truncate` - Vaciamiento de tablas

### **Operaciones Destructivas:**

- `migrate reset` - Reset de migraciones
- `db push --force-reset` - Push forzado con reset
- `drizzle-kit drop` - Eliminación de esquema

### **Operaciones No Seguras para Producción:**

- `migrate dev` - Migración de desarrollo
- `db push --accept-data-loss` - Push con pérdida de datos

## 🛠️ **Comandos Disponibles**

### **Verificación de Seguridad:**

```bash
# Verificar configuración de seguridad
npm run db:safety:check

# Verificar estado de la base de datos
npm run db:safety:status
```

### **Operaciones con Seguridad:**

```bash
# Ejecutar operación con verificación de seguridad
npm run db:safety:execute "npm run db:reset"

# Crear backup de seguridad
npm run db:safety:backup
```

### **Workflow Integrado:**

```bash
# Workflow de migraciones con seguridad integrada
npm run migration:workflow
```

## 🔄 **Flujo de Trabajo Seguro**

### **1. Verificación Previa:**

```bash
npm run db:safety:check
```

### **2. Ejecución con Seguridad:**

```bash
# Para operaciones normales
npm run migration:workflow

# Para operaciones peligrosas
npm run db:safety:execute "npm run db:reset"
```

### **3. Confirmación Manual (si es requerida):**

```
🚨 OPERACIÓN PELIGROSA DETECTADA
========================================
Operación: npm run db:reset
Razón: Operación de reset detectada: reset
Entorno: production

⚠️  ESTA OPERACIÓN PUEDE DESTRUIR DATOS

🚨 ATENCIÓN: ESTÁS EN PRODUCCIÓN
Esta operación puede afectar a usuarios reales

Para continuar, escribe exactamente: CONFIRMO
Para cancelar, presiona Ctrl+C
```

## 📊 **Monitoreo y Logs**

### **Logs de Seguridad:**

```
🛡️  Verificando seguridad para: npm run db:reset
🛡️  Validando configuración de seguridad...
ℹ️  Nivel de seguridad: strict
ℹ️  Entorno: production
⚠️  Operación peligrosa detectada: Operación de reset detectada: reset
🚨 OPERACIÓN PELIGROSA DETECTADA
========================================
Operación: npm run db:reset
Razón: Operación de reset detectada: reset
Entorno: production

⚠️  ESTA OPERACIÓN PUEDE DESTRUIR DATOS

🚨 ATENCIÓN: ESTÁS EN PRODUCCIÓN
Esta operación puede afectar a usuarios reales

Para continuar, escribe exactamente: CONFIRMO
Para cancelar, presiona Ctrl+C
❌ Operación cancelada automáticamente en producción
ℹ️  Para forzar la operación, establece DATABASE_SAFETY_LEVEL=disabled
```

### **Estados de Verificación:**

- ✅ **Seguro**: Operación permitida
- ⚠️ **Advertencia**: Operación peligrosa detectada
- 🚨 **Bloqueado**: Operación bloqueada por seguridad
- ❌ **Error**: Error de configuración o sistema

## 🏭 **Configuración por Entorno**

### **Desarrollo:**

```env
NODE_ENV=development
DATABASE_SAFETY_LEVEL=relaxed
DATABASE_URL=postgresql://user:pass@localhost:5432/km0_db_dev
```

### **Testing:**

```env
NODE_ENV=test
DATABASE_SAFETY_LEVEL=strict
DATABASE_URL=postgresql://user:pass@localhost:5432/km0_db_test
```

### **Producción:**

```env
NODE_ENV=production
DATABASE_SAFETY_LEVEL=strict
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
```

## 🔍 **Validaciones de Seguridad**

### **Validación de Configuración:**

1. **Variables de entorno críticas** presentes
2. **Nivel de seguridad** válido
3. **Configuración SSL** en producción
4. **Conectividad** de base de datos

### **Validación de Operaciones:**

1. **Detección de patrones** peligrosos
2. **Verificación de contexto** (entorno)
3. **Confirmación manual** cuando es requerida
4. **Backup automático** antes de operaciones críticas

### **Validación Post-Operación:**

1. **Verificación de estado** de la base de datos
2. **Validación de integridad** de datos
3. **Registro de operaciones** realizadas

## 🚨 **Manejo de Emergencias**

### **Escenario 1: Necesitas hacer un reset en producción**

```bash
# 1. Cambiar nivel de seguridad temporalmente
export DATABASE_SAFETY_LEVEL=disabled

# 2. Crear backup manual
npm run db:safety:backup

# 3. Ejecutar operación
npm run db:reset

# 4. Restaurar nivel de seguridad
export DATABASE_SAFETY_LEVEL=strict
```

### **Escenario 2: Error de configuración**

```bash
# 1. Verificar configuración
npm run db:safety:check

# 2. Corregir variables de entorno
# 3. Verificar conectividad
npm run db:safety:status
```

### **Escenario 3: Operación bloqueada incorrectamente**

```bash
# 1. Verificar nivel de seguridad actual
echo $DATABASE_SAFETY_LEVEL

# 2. Cambiar a nivel más permisivo temporalmente
export DATABASE_SAFETY_LEVEL=relaxed

# 3. Ejecutar operación
npm run db:safety:execute "tu-comando"

# 4. Restaurar nivel de seguridad
export DATABASE_SAFETY_LEVEL=strict
```

## 📈 **Métricas y Auditoría**

### **Métricas Recopiladas:**

- **Operaciones bloqueadas** por seguridad
- **Confirmaciones manuales** requeridas
- **Backups automáticos** creados
- **Errores de configuración** detectados
- **Tiempo de respuesta** del sistema de seguridad

### **Auditoría de Seguridad:**

- **Log de todas las operaciones** peligrosas
- **Registro de confirmaciones** manuales
- **Historial de cambios** de nivel de seguridad
- **Backups de seguridad** creados

## 🎯 **Mejores Prácticas**

### **Para Desarrollo:**

1. **Usar nivel `relaxed`** para desarrollo rápido
2. **Probar operaciones peligrosas** en entorno de test
3. **Verificar configuración** antes de cambios importantes
4. **Documentar operaciones** críticas realizadas

### **Para Producción:**

1. **Usar nivel `strict`** como mínimo
2. **Considerar nivel `paranoid`** para entornos críticos
3. **Programar ventanas de mantenimiento** para operaciones peligrosas
4. **Tener plan de rollback** preparado
5. **Monitorear logs** de seguridad regularmente

### **Para el Equipo:**

1. **Capacitar al equipo** en el uso del sistema
2. **Documentar procedimientos** de emergencia
3. **Revisar logs** de seguridad periódicamente
4. **Actualizar configuración** según necesidades

## 🔮 **Futuras Mejoras**

### **Funcionalidades Planificadas:**

- [ ] **Dashboard web** para gestión de seguridad
- [ ] **Notificaciones automáticas** para operaciones críticas
- [ ] **Rollback automático** en caso de errores
- [ ] **Integración con CI/CD** para validaciones automáticas
- [ ] **Análisis de patrones** de uso para optimización
- [ ] **Backup incremental** para mejor rendimiento

### **Integración Avanzada:**

- [ ] **Integración con sistemas de monitoreo** (Prometheus, Grafana)
- [ ] **Alertas en tiempo real** para operaciones peligrosas
- [ ] **Integración con sistemas de tickets** para aprobaciones
- [ ] **Auditoría automática** de cambios de configuración

---

**Última actualización**: Enero 2024
**Versión del sistema**: 1.0.0
**Mantenido por**: Equipo de Desarrollo KM0 Market
**Basado en**: Mejores prácticas de NestJS, Drizzle ORM y la comunidad
