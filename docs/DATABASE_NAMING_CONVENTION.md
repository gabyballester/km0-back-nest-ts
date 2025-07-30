# 🛡️ Convención de Nomenclatura de Bases de Datos

## 📋 **Descripción General**

Este documento define la **convención obligatoria de nomenclatura de bases de datos** implementada en el proyecto KM0 Market Backend para prevenir pérdida accidental de datos y asegurar que cada entorno use su base de datos designada.

## 🎯 **Objetivos de Seguridad**

### **Principales:**

- ✅ **Prevenir pérdida accidental** de datos de producción
- ✅ **Asegurar aislamiento** entre entornos
- ✅ **Validación automática** de configuración
- ✅ **Documentación clara** de convenciones

### **Secundarios:**

- ✅ **Facilitar debugging** de problemas de entorno
- ✅ **Mejorar trazabilidad** de operaciones
- ✅ **Reducir errores** de configuración

## 🏗️ **Nomenclatura Obligatoria**

### **Convención por Entorno:**

| Entorno        | Base de Datos | Ejemplo Completo                                          |
| -------------- | ------------- | --------------------------------------------------------- |
| **Producción** | `km0_db`      | `postgresql://user:pass@host:5432/km0_db?sslmode=require` |
| **Desarrollo** | `km0_db_dev`  | `postgresql://user:pass@localhost:5432/km0_db_dev`        |
| **Test**       | `km0_db_test` | `postgresql://user:pass@localhost:5432/km0_db_test`       |

### **Reglas de Validación:**

1. **Exact Match**: El nombre debe coincidir exactamente
2. **Case Sensitive**: Los nombres son sensibles a mayúsculas/minúsculas
3. **Validación Automática**: Se valida en múltiples puntos del sistema

## 🔧 **Implementación Técnica**

### **1. Validación en Zod Schema (`src/config/env.schema.ts`)**

```typescript
const DATABASE_NAMES = {
  [ENV_VALUES.NODE_ENV.PRODUCTION]: 'km0_db',
  [ENV_VALUES.NODE_ENV.DEVELOPMENT]: 'km0_db_dev',
  [ENV_VALUES.NODE_ENV.TEST]: 'km0_db_test',
} as const;

[ENV_KEYS.DATABASE_URL]: z
  .string()
  .url('DATABASE_URL must be a valid URL')
  .refine(
    (url) => {
      const environment = process.env.NODE_ENV || ENV_VALUES.NODE_ENV.DEVELOPMENT;
      return validateDatabaseUrlByEnvironment(url, environment);
    },
    (url) => {
      const environment = process.env.NODE_ENV || ENV_VALUES.NODE_ENV.DEVELOPMENT;
      const dbUrl = new URL(url);
      const dbName = dbUrl.pathname.slice(1);
      const expectedName = DATABASE_NAMES[environment as keyof typeof DATABASE_NAMES];

      return {
        message: `Database name mismatch! Environment: ${environment}, Expected: ${expectedName}, Found: ${dbName}. This prevents accidental data loss by ensuring each environment uses its designated database.`
      };
    }
  ),
```

### **2. Validación en Database Safety Guard (`scripts/database-safety-guard.js`)**

```javascript
const DATABASE_NAMES = {
  development: 'km0_db_dev',
  production: 'km0_db',
  test: 'km0_db_test',
};

function validateDatabaseName() {
  const databaseUrl = process.env.DATABASE_URL;
  const environment = getCurrentEnvironment();

  if (!databaseUrl) {
    logError('DATABASE_URL no está configurada');
    return false;
  }

  try {
    const dbUrl = new URL(databaseUrl);
    const dbName = dbUrl.pathname.slice(1);
    const expectedName = DATABASE_NAMES[environment];

    if (dbName !== expectedName) {
      logError('❌ Error de validación de nombre de base de datos!');
      logError(`   Entorno: ${environment}`);
      logError(`   Esperado: ${expectedName}`);
      logError(`   Encontrado: ${dbName}`);
      return false;
    }

    return true;
  } catch (error) {
    logError(`Error validando DATABASE_URL: ${error.message}`);
    return false;
  }
}
```

## 🚨 **Puntos de Validación**

### **1. Inicio de la Aplicación**

- **Cuándo**: Al arrancar la aplicación NestJS
- **Dónde**: `src/config/env.schema.ts`
- **Acción**: Aborta el inicio si la validación falla

### **2. Scripts de Base de Datos**

- **Cuándo**: Antes de ejecutar operaciones de BD
- **Dónde**: `scripts/database-safety-guard.js`
- **Acción**: Aborta la operación si la validación falla

### **3. Migraciones**

- **Cuándo**: Antes de aplicar migraciones
- **Dónde**: `scripts/migration-manager.js`
- **Acción**: Aborta la migración si la validación falla

## 📊 **Ejemplos de Errores**

### **Error 1: Base de datos incorrecta en producción**

```
❌ Error de validación de nombre de base de datos!
   Entorno: production
   Esperado: km0_db
   Encontrado: km0_db_dev
   Esto previene la pérdida accidental de datos
   asegurando que cada entorno use su base de datos designada.
```

### **Error 2: Base de datos incorrecta en desarrollo**

```
❌ Error de validación de nombre de base de datos!
   Entorno: development
   Esperado: km0_db_dev
   Encontrado: km0_db
   Esto previene la pérdida accidental de datos
   asegurando que cada entorno use su base de datos designada.
```

## 🛠️ **Configuración por Entorno**

### **Desarrollo (.env.development)**

```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:admin@localhost:5432/km0_db_dev
```

### **Testing (.env.test)**

```env
NODE_ENV=test
DATABASE_URL=postgresql://postgres:admin@localhost:5432/km0_db_test
```

### **Producción (.env.production)**

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/km0_db?sslmode=require
```

## 🔄 **Workflow de Desarrollo**

### **1. Crear Nueva Base de Datos**

```bash
# Desarrollo
createdb km0_db_dev

# Testing
createdb km0_db_test

# Producción (solo en el servidor de producción)
createdb km0_db
```

### **2. Verificar Configuración**

```bash
# Verificar configuración actual
npm run db:safety:check

# Verificar nombre de base de datos
npm run db:validate
```

### **3. Migraciones Seguras**

```bash
# Desarrollo
npm run db:dev:safe

# Testing
npm run db:test

# Producción
npm run db:prod
```

## 🚨 **Manejo de Emergencias**

### **Escenario 1: Necesitas usar una base diferente temporalmente**

```bash
# 1. Deshabilitar validación temporalmente (SOLO EMERGENCIAS)
export DATABASE_SAFETY_LEVEL=disabled

# 2. Ejecutar operación
npm run tu-comando

# 3. Restaurar validación
export DATABASE_SAFETY_LEVEL=strict
```

### **Escenario 2: Error de configuración**

```bash
# 1. Verificar configuración actual
echo $NODE_ENV
echo $DATABASE_URL

# 2. Corregir variables de entorno
# 3. Verificar validación
npm run db:safety:check
```

## 📈 **Beneficios Obtenidos**

### **Para el Equipo:**

- ✅ **Prevención de errores** de configuración
- ✅ **Trazabilidad clara** de operaciones
- ✅ **Debugging más fácil** de problemas
- ✅ **Confianza en operaciones** de base de datos

### **Para el Proyecto:**

- ✅ **Protección de datos** de producción
- ✅ **Aislamiento entre entornos**
- ✅ **Configuración consistente**
- ✅ **Documentación clara**

## 🔮 **Futuras Mejoras**

### **Funcionalidades Planificadas:**

- [ ] Validación en tiempo real durante desarrollo
- [ ] Alertas automáticas en CI/CD
- [ ] Dashboard de estado de bases de datos
- [ ] Backup automático antes de operaciones críticas

### **Integración CI/CD:**

- [ ] Validación en pipeline de deployment
- [ ] Verificación en pull requests
- [ ] Alertas en Slack/Discord
- [ ] Métricas de cumplimiento

---

## 📚 **Referencias**

- [NestJS Configuration Documentation](https://docs.nestjs.com/techniques/configuration)
- [Zod Validation Documentation](https://zod.dev/)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html)
- [Database Safety Best Practices](https://12factor.net/dev-prod-parity)
