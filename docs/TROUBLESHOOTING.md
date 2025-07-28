# Troubleshooting Guide - KM0 Market Backend

## 🚨 Warnings y Errores Comunes

### 1. Warning de LegacyRouteConverter

**Síntoma:**

```
WARN [LegacyRouteConverter] Unsupported route path: "/api/v1/*"
```

**Explicación:**
Este warning aparece debido a cambios en la librería `path-to-regexp` utilizada por NestJS. En versiones anteriores, los símbolos `?`, `*`, y `+` se usaban para denotar parámetros opcionales o repetitivos. La versión más reciente requiere el uso de parámetros nombrados.

**Causa:**
El prefijo global `api/v1` se interpreta como un patrón de ruta con wildcard, aunque en realidad es solo un prefijo estático.

**Impacto:**

- ✅ **NO afecta la funcionalidad**
- ✅ **Las rutas funcionan correctamente**
- ✅ **Es solo un warning informativo**

**Verificación:**

```bash
# Las siguientes rutas funcionan correctamente:
GET /api/v1/example          # ✅ Funciona
GET /api/v1/example/info     # ✅ Funciona
GET /health                  # ✅ Funciona (excluida del versionado)
GET /docs                    # ✅ Funciona (excluida del versionado)
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

---

### 2. Vulnerabilidades de Seguridad en Dependencias

**Síntoma:**

```
4 moderate severity vulnerabilities
```

**Solución:**

```bash
# Verificar vulnerabilidades
npm audit

# Actualizar dependencias
npm update

# Para vulnerabilidades críticas
npm audit fix --force
```

---

### 3. Error de Conexión SSL en Base de Datos

**Síntoma:**

```
❌ Error al conectar con Drizzle: SSL/TLS required
```

**Solución:**

```bash
# Verificar configuración SSL
npm run db:check:ssl

# Aplicar configuración SSL
npm run db:prod
```

---

### 4. Error de Dependencias Faltantes

**Síntoma:**

```
❌ Error: Cannot find module 'drizzle-kit'
```

**Solución:**

```bash
# Reinstalar dependencias
npm install

# Verificar que drizzle-kit esté en dependencies
npm list drizzle-kit
```

---

### 5. Error de Variables de Entorno

**Síntoma:**

```
❌ Error de validación de variables de entorno
```

**Solución:**

```bash
# Configurar variables de entorno
npm run env:setup

# Verificar configuración
npm run env:check
```

---

## 🔧 Comandos de Diagnóstico

### Verificación Rápida del Sistema

```bash
# Verificar estado general
npm run test:quick

# Verificar configuración de base de datos
npm run db:check:ssl

# Verificar variables de entorno
npm run env:check

# Verificar dependencias
npm run deps:check
```

### Logs de Diagnóstico

```bash
# Ver logs de la aplicación
npm run start:dev

# Ver logs de tests
npm run test:full

# Ver logs de deployment
npm run deploy:check
```

---

## 📊 Estados de Salud del Sistema

### ✅ Estado Saludable

```
🚀 NESTJS APPLICATION STARTUP
✅ Base de datos conectada correctamente con DRIZZLE
🌍 Environment: development
🔧 Port: 4000
🏠 Host: localhost
```

### ❌ Estado Problemático

```
❌ APPLICATION STARTUP FAILED
❌ Error al conectar con Drizzle: SSL/TLS required
❌ Error de validación de variables de entorno
```

---

## 🎯 Soluciones Rápidas

### Problema: Aplicación no inicia

1. **Verificar variables de entorno:**

   ```bash
   npm run env:setup
   ```

2. **Verificar base de datos:**

   ```bash
   npm run db:check:ssl
   ```

3. **Reinstalar dependencias:**

   ```bash
   npm install
   ```

### Problema: Tests fallan

1. **Ejecutar tests rápidos:**

   ```bash
   npm run test:quick
   ```

2. **Verificar configuración de test:**

   ```bash
   npm run test:config
   ```

3. **Limpiar cache:**

   ```bash
   npm run test:clean
   ```

### Problema: Deployment falla

1. **Verificar configuración de producción:**

   ```bash
   npm run deploy:check
   ```

2. **Verificar dependencias de producción:**

   ```bash
   npm run deps:check
   ```

3. **Verificar configuración SSL:**

   ```bash
   npm run db:check:ssl
   ```

---

## 📞 Contacto y Soporte

### Documentación Relacionada

- [Deployment Guide](./DEPLOYMENT.md)
- [Environment Management](./ENVIRONMENT.md)
- [Testing Guide](./TESTING.md)
- [Architecture Guide](./ARCHITECTURE.md)

### Logs Importantes

- **Aplicación**: `npm run start:dev`
- **Tests**: `npm run test:full`
- **Deployment**: `npm run deploy:check`
- **Base de datos**: `npm run db:check:ssl`

### Comandos de Emergencia

```bash
# Reiniciar completamente
npm run reset:all

# Verificar estado completo
npm run health:check

# Backup de emergencia
npm run backup:emergency
```
