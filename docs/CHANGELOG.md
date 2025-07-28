# Changelog

## [Unreleased] - 2025-07-27

### 🔧 Fixed

- **Dependencies Organization**: Corregida organización crítica de dependencias
  - **`drizzle-kit`**: Movido de `devDependencies` a `dependencies` para funcionar en producción
  - **`@nestjs/cli`**: Movido de `dependencies` a `devDependencies` (solo desarrollo)
  - **`@swc/cli`**: Movido de `dependencies` a `devDependencies` (solo desarrollo)
  - **`prisma`**: Movido de `dependencies` a `devDependencies` (solo desarrollo)
  - **CRÍTICO**: Sin esta corrección, las migraciones fallarían en producción

- **SSL Configuration**: Corregida configuración SSL para conexiones de base de datos en producción
  - Actualizado `drizzle.adapter.ts` para forzar SSL en producción
  - Agregado soporte SSL en `drizzle.config.ts`
  - Creado script `check-ssl-config.js` para validar configuración SSL
  - Integrado verificación SSL en script de deployment de producción

- **API Versioning**: Implementado sistema completo de versionado de API
  - **Prefijo global**: Cambiado de `/api` a `/api/v1` para versionado
  - **Constantes centralizadas**: Creado `src/shared/constants/api.ts` con configuración de versiones
  - **Controlador de ejemplo**: Implementado `ExampleController` para demostrar versionado
  - **Documentación**: Creado `docs/API_VERSIONING.md` con guía completa
  - **Estructura preparada**: Configuración lista para futuras versiones (v2, v3, etc.)
  - **Endpoints sin versionar**: Health y docs excluidos del versionado (mejor práctica)

- **Deployment Scripts**: Mejorados scripts de deployment
  - Agregado script `npm run db:check:ssl` para verificar configuración SSL
  - Integrada verificación SSL en `drizzle-production-deploy.js`
  - Actualizada documentación de deployment con soluciones a problemas comunes

### 📚 Documentation

- **DEPLOYMENT.md**: Actualizada documentación con:
  - Configuración SSL obligatoria para producción
  - Soluciones a problemas comunes (SSL/TLS, rutas legacy, vulnerabilidades)
  - Guía de monitoreo y recuperación
  - Mejores prácticas de deployment

### 🛡️ Security

- **Vulnerabilities**: Identificadas 4 vulnerabilidades moderadas en dependencias
  - Actualizado `drizzle-kit` a versión más reciente
  - Documentadas soluciones para vulnerabilidades restantes

### 🚀 Deployment

- **Render.com**: Deployment exitoso en producción
  - Aplicación NestJS iniciada correctamente
  - Base de datos conectada con Drizzle ORM
  - Endpoints mapeados y funcionando
  - Health checks operativos

### ⚠️ Known Issues

- **SSL Warning**: DATABASE_URL no tiene SSL explícito configurado
  - Recomendación: Agregar `?sslmode=require` al final de la URL
  - No afecta funcionalidad actual pero mejora seguridad

- **Vulnerabilities**: 2 vulnerabilidades moderadas restantes en `esbuild`
  - Dependencia de `drizzle-kit`
  - No críticas para funcionalidad de producción
  - Monitorear actualizaciones futuras

## [Previous Versions]

- Documentación de versiones anteriores...
