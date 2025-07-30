# Deployment Guide

## Configuración de Producción

### Variables de Entorno Requeridas

```bash
# Entorno
NODE_ENV=production

# Base de datos (OBLIGATORIO: Nomenclatura específica por entorno)
DATABASE_URL=postgresql://user:password@host:port/km0_db?sslmode=require
DATABASE_ORM=drizzle

# Sistema de Seguridad de Base de Datos (CRÍTICO)
DATABASE_SAFETY_LEVEL=strict

# Servidor
PORT=8000
HOST=0.0.0.0

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
```

### 🛡️ Nomenclatura Obligatoria de Bases de Datos

**CRÍTICO**: El sistema valida automáticamente que cada entorno use su base de datos designada para prevenir pérdida accidental de datos.

| Entorno        | Base de Datos | Ejemplo                                                   |
| -------------- | ------------- | --------------------------------------------------------- |
| **Producción** | `km0_db`      | `postgresql://user:pass@host:5432/km0_db?sslmode=require` |
| **Desarrollo** | `km0_db_dev`  | `postgresql://user:pass@localhost:5432/km0_db_dev`        |
| **Test**       | `km0_db_test` | `postgresql://user:pass@localhost:5432/km0_db_test`       |

**Validación Automática**: Si intentas usar una base de datos incorrecta para el entorno, el sistema abortará automáticamente con un error claro.

### Configuración de Puertos y Host

**Configuración por Entorno:**

- **Development**: `PORT=4000`, `HOST=localhost`
- **Test**: `PORT=6000`, `HOST=localhost`
- **Production**: `PORT=8000`, `HOST=0.0.0.0`

**Importante**: En producción, el servidor debe escuchar en `0.0.0.0` para ser accesible desde el exterior.

### Configuración SSL para Base de Datos

En producción, es **obligatorio** configurar SSL para la conexión a la base de datos:

1. **Render.com**: Agregar `?sslmode=require` al final de la DATABASE_URL
2. **Heroku**: SSL se configura automáticamente
3. **AWS RDS**: Usar certificados SSL apropiados

### Verificación de Configuración

```bash
# Verificar configuración SSL
npm run db:check:ssl

# Verificar configuración de puertos
npm run check:ports

# Deployment completo
npm run db:prod
npm run build:prod
npm run start:prod
```

## Dependencias Críticas para Producción

### ✅ Dependencias de Producción (dependencies)

```json
{
  "dependencies": {
    "@nestjs/common": "^11.0.1",
    "@nestjs/config": "^4.0.2",
    "@nestjs/core": "^11.0.1",
    "@nestjs/platform-express": "^11.0.1",
    "@nestjs/swagger": "^11.2.0",
    "@nestjs/throttler": "^6.4.0",
    "@prisma/client": "^6.12.0",
    "drizzle-orm": "^0.44.3",
    "drizzle-kit": "^0.31.4", // ✅ CRÍTICO: Para migraciones en producción
    "postgres": "^3.4.7",
    "zod": "^4.0.8"
  }
}
```

### 🔧 Dependencias de Desarrollo (devDependencies)

```json
{
  "devDependencies": {
    "@nestjs/cli": "^11.0.7", // ✅ Solo para desarrollo
    "@swc/cli": "^0.6.0", // ✅ Solo para desarrollo
    "prisma": "^6.12.0", // ✅ Solo para desarrollo
    "typescript": "^5.1.3",
    "jest": "^29.5.0"
  }
}
```

### ⚠️ Dependencias Críticas Verificadas

- **`drizzle-kit`**: ✅ Movido a `dependencies` para funcionar en producción
- **`@nestjs/cli`**: ✅ Movido a `devDependencies` (solo desarrollo)
- **`@swc/cli`**: ✅ Movido a `devDependencies` (solo desarrollo)
- **`prisma`**: ✅ Movido a `devDependencies` (solo desarrollo)

## Problemas Comunes y Soluciones

### Error de Puerto no Detectado en Render

**Síntoma:**

```
Port scan timeout reached, failed to detect open port 8000
```

**Solución:**

1. Verificar que `HOST=0.0.0.0` esté configurado en producción
2. Ejecutar `npm run check:ports` para validar configuración
3. Asegurar que el servidor escuche en el host correcto
4. **Importante**: Usar las claves correctas en `ConfigService`:
   - ✅ `configService.get('PORT')` y `configService.get('HOST')`
   - ❌ `configService.get('env.port')` y `configService.get('env.host')`

**Causa Raíz:**
El problema se debía a que en `src/main.ts` se estaban usando las claves incorrectas del `ConfigService`. Las claves `CONFIG_KEYS.ENV_PORT` (`'env.port'`) y `CONFIG_KEYS.ENV_HOST` (`'env.host'`) no existían en la configuración registrada, por lo que se usaban los valores por defecto (4000 y localhost).

### Error SSL/TLS Required

**Síntoma:**

```
PostgresError: SSL/TLS required
```

**Solución:**

1. Verificar que DATABASE_URL incluya `?sslmode=require`
2. Ejecutar `npm run db:check:ssl` para validar configuración
3. Asegurar que NODE_ENV=production esté configurado

### Error: drizzle-kit not found

**Síntoma:**

```
Error: Cannot find module 'drizzle-kit'
```

**Solución:**

1. Verificar que `drizzle-kit` esté en `dependencies` (no en `devDependencies`)
2. Ejecutar `npm install` para reinstalar dependencias
3. Verificar que el build incluya `drizzle-kit`

### Advertencia de Rutas Legacy

**Síntoma:**

```
[LegacyRouteConverter] Unsupported route path: "/api/v1/*"
```

**Explicación:**

Este warning aparece debido a cambios en la librería `path-to-regexp` utilizada por NestJS. En versiones anteriores, los símbolos `?`, `*`, y `+` se usaban para denotar parámetros opcionales o repetitivos. La versión más reciente requiere el uso de parámetros nombrados.

**Causa:**

El prefijo global `api/v1` se interpreta como un patrón de ruta con wildcard, aunque en realidad es solo un prefijo estático.

**Solución:**

- **Estado actual**: Las rutas están configuradas correctamente en `main.ts`
- **Impacto**: Esta advertencia es **informativa** y **NO afecta la funcionalidad**
- **Comportamiento**: La aplicación funciona normalmente y las rutas se resuelven correctamente
- **Resolución**: El sistema intenta auto-convertir el patrón automáticamente

**Verificación:**

```bash
# Las siguientes rutas funcionan correctamente:
GET /api/v1/example          # ✅ Funciona
GET /api/v1/example/info     # ✅ Funciona
GET /health                  # ✅ Funciona (excluida del versionado)
GET /docs                    # ✅ Funciona (excluida del versionado)
```

### Vulnerabilidades de Seguridad

**Síntoma:**

```
4 moderate severity vulnerabilities
```

**Solución:**

1. Ejecutar `npm audit` para ver detalles
2. Actualizar dependencias: `npm update`
3. Para vulnerabilidades críticas: `npm audit fix --force`

## Monitoreo de Producción

### Health Checks

- **Endpoint**: `GET /health`
- **Endpoint detallado**: `GET /health/detailed`
- **Documentación**: `GET /docs`
- **API v1**: `GET /api/v1/example`
- **Info versionado**: `GET /api/v1/example/info`

### Logs Importantes

```bash
# Inicio exitoso
🚀 NESTJS APPLICATION STARTUP
✅ Base de datos conectada correctamente con DRIZZLE

# Error de conexión
❌ Error al conectar con Drizzle: SSL/TLS required

# Error de dependencias
❌ Error: Cannot find module 'drizzle-kit'
```

## Rollback y Recuperación

### Rollback Rápido

1. Revertir al commit anterior
2. Reconstruir: `npm run build:prod`
3. Reiniciar servicio

### Recuperación de Base de Datos

1. Verificar migraciones: `npx drizzle-kit check`
2. Aplicar migraciones: `npx drizzle-kit migrate`
3. Verificar estado: `npm run db:check:ssl`

### Verificación de Dependencias

```bash
# Verificar que drizzle-kit esté disponible en producción
npm list drizzle-kit

# Verificar dependencias críticas
npm list --depth=0 | grep -E "(drizzle|@nestjs|postgres)"
```

## Mejores Prácticas

1. **Siempre probar en staging antes de producción**
2. **Mantener backups de base de datos**
3. **Monitorear logs de aplicación**
4. **Configurar alertas de salud**
5. **Documentar cambios de configuración**
6. **Verificar dependencias críticas antes del deployment**
7. **Usar `npm run db:check:ssl` antes de cada deployment**
