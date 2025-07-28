# Guía de Solución de Problemas

## 🚨 **Problemas Comunes y Soluciones**

### 1. Warning de LegacyRouteConverter

**Síntoma:**

```
WARN [LegacyRouteConverter] Unsupported route path: "/api/v1/*"
```

**Solución:**

### **Opción 1: Ignorar el Warning (Actual)**

No es necesario hacer cambios. El sistema auto-convierte el patrón automáticamente.

### **Opción 2: Eliminar el Warning (Recomendado)**

Aplicar el versionado directamente en los controladores:

```typescript
// En lugar de usar prefijo global en main.ts
// app.setGlobalPrefix(API_PREFIXES.V1, { exclude: [...] });

// Usar versionado directo en controladores
@Controller('api/v1/example')
export class ExampleController {
  // ...
}
```

**Ventajas:**

- ✅ Elimina el warning completamente
- ✅ Más explícito y claro
- ✅ Mayor control por controlador
- ✅ Fácil de mantener y debuggear

### 2. Problema de Nomenclatura: Prisma → Drizzle

**Síntoma:**

```
Is created_at column in users table created or renamed from another column?
❯ + created_at             create column
  ~ createdAt › created_at rename column
```

**Causa:**
Diferencia en convenciones de nomenclatura entre Prisma y Drizzle:

- **Prisma**: Usa CamelCase (`createdAt`) en el modelo y Snake_case (`created_at`) en BD
- **Drizzle**: Requiere mapeo explícito entre ambos

**Solución Implementada:**

1. **Mapeo Correcto en Drizzle Schema:**

```typescript
export const users = pgTable('users', {
  createdAt: timestamp('created_at').defaultNow().notNull(), // ← Mapeo explícito
  updatedAt: timestamp('updated_at').defaultNow().notNull(), // ← Mapeo explícito
});
```

2. **Script de Deployment Mejorado:**

```javascript
// Priorizar migrate sobre push para evitar prompts
if (hasProjectMigrations) {
  execSync('npx drizzle-kit migrate', { stdio: 'inherit' });
} else {
  execSync('npx drizzle-kit push', { stdio: 'inherit' });
}
```

**Prevención:**

- ✅ Usar migraciones existentes (`migrate`) en lugar de sincronización (`push`)
- ✅ Mapeo explícito en todos los esquemas Drizzle
- ✅ Scripts de deployment no interactivos

### 3. Problema de Migraciones vs Push

**Síntoma:**

```
No pending migrations to apply
# O
Error: No migration files found for changes
```

**Causa:**
Conflicto entre el sistema de migraciones y sincronización directa:

- **Migraciones**: Archivos SQL versionados para cambios incrementales
- **Push**: Sincronización directa del esquema con la base de datos
- **Estado inconsistente**: Cambios en el esquema sin migraciones generadas

**Escenarios Problemáticos:**

1. **Migración ya aplicada:**

```bash
# La migración 0000_smart_johnny_storm.sql ya está en la BD
drizzle-kit migrate  # ← No hace nada
```

2. **Cambios sin migraciones:**

```bash
# Esquema modificado pero sin generar migraciones
drizzle-kit migrate  # ← Falla, no encuentra migraciones para los cambios
```

3. **Estado inconsistente:**

```bash
# BD no coincide con esquema actual
drizzle-kit migrate  # ← No puede resolver diferencias
```

**Solución Implementada:**

1. **Estrategia Inteligente en Deployment:**

```javascript
if (hasProjectMigrations) {
  // Usar migraciones si existen
  applyMigrations();
} else {
  // Usar push solo si no hay migraciones
  safeExec('npx drizzle-kit push', 'Sincronizando esquema');
}
```

2. **Workflow Recomendado:**

```bash
# Para cambios en el esquema
npm run db:drizzle:generate  # Genera migración
npm run db:drizzle:migrate   # Aplica migración

# Para desarrollo rápido
npm run db:dev              # Push en desarrollo
npm run db:prod             # Migrate en producción
```

**Prevención:**

- ✅ Generar migraciones para cada cambio en el esquema
- ✅ Usar migraciones en producción, push solo en desarrollo
- ✅ Mantener consistencia entre esquema y migraciones
- ✅ Revisar estado de migraciones antes de deployment

### 4. Error de SSL/TLS en Producción

**Síntoma:**

```
PostgresError: SSL/TLS required
```

**Solución:**
Configurar SSL explícitamente para producción:

```typescript
// drizzle.config.ts
dbCredentials: {
  url: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false, sslmode: 'require' }
    : false,
}
```

### 5. Error de Build en Producción

**Síntoma:**

```
npm error could not determine executable to run
```

**Solución:**

- Mover `@nestjs/cli` a `dependencies`
- Simplificar comandos de build

### 6. Vulnerabilidades de Seguridad

**Síntoma:**

```
npm audit found X vulnerabilities
```

**Solución:**

```bash
npm audit fix
npm audit fix --force  # Solo si es necesario
```

### 7. Errores de TypeScript

**Síntoma:**

```
Type 'X' is not assignable to type 'Y'
```

**Solución:**

- Revisar tipos en interfaces
- Verificar imports
- Ejecutar `npm run type-check`

### 8. Errores de ESLint

**Síntoma:**

```
ESLint: 'X' is defined but never used
```

**Solución:**

- Usar prefijo `_` para variables no utilizadas
- Ejecutar `npm run lint:fix`

## 🔧 **Comandos de Diagnóstico**

```bash
# Verificar estado del proyecto
npm run type-check
npm run lint:check
npm run test:quick:ultra

# Verificar base de datos
npm run db:health
npm run db:validate

# Verificar deployment
npm run check:deployment
```

## 📚 **Recursos Adicionales**

- [Documentación de NestJS](https://docs.nestjs.com/)
- [Documentación de Drizzle ORM](https://orm.drizzle.team/)
- [Guía de API](./API_VERSIONING.md)
- [Estado de Deployment](./DEPLOYMENT_STATUS.md)
