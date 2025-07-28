# Changelog

## [Unreleased] - 2025-07-27

### 🔧 Fixed

- **Deployment Script Enhancement**: Mejorado script de deployment para usar migraciones en lugar de push
  - **Problema**: Script usaba `drizzle-kit push` generando prompts interactivos sobre columnas
  - **Solución**: Script detecta migraciones existentes y usa `drizzle-kit migrate` automáticamente
  - **Beneficio**: Deployment completamente automatizado sin preguntas interactivas
  - **Implementación**: Lógica condicional que prioriza migraciones sobre push
  - **Impacto**: Eliminación de prompts como "Is created_at column created or renamed?"

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

- **API Versioning Warning Fix**: Eliminado warning de LegacyRouteConverter
  - **Cambio**: Migrado de prefijo global a versionado directo en controladores
  - **Beneficio**: Eliminación completa del warning sin afectar funcionalidad
  - **Implementación**: `ExampleController` ahora usa `@Controller('api/v1/example')`
  - **Documentación**: Actualizada guía de versionado con ambas opciones

- **API Simplification**: Eliminado versionado de API para simplificar estructura
  - **Cambio**: Removido versionado complejo por estructura simple
  - **Beneficio**: API más simple, menos verbosa y fácil de mantener
  - **Implementación**: Endpoints ahora en `/example` en lugar de `/api/v1/example`
  - **Documentación**: Actualizada guía de API con estructura simple

- **API Prefix Decision**: Decidido no usar prefijo `/api` para evitar incompatibilidades
  - **Problema**: El prefijo `/api` genera warning `LegacyRouteConverter` en NestJS
  - **Solución**: Estructura simple sin prefijo para evitar warnings de compatibilidad
  - **Beneficio**: URLs más limpias, sin warnings y mejor compatibilidad
  - **Implementación**: Controladores usan rutas directas (`/example`, `/users`, etc.)
  - **Documentación**: Actualizada guía de API para reflejar decisión final

### 📚 Documentation

- **DEPLOYMENT.md**: Actualizada documentación con:
  - Configuración SSL obligatoria para producción
  - Soluciones a problemas comunes (SSL/TLS, rutas legacy, vulnerabilidades)
  - Guía de monitoreo y recuperación
  - Mejores prácticas de deployment

- **TROUBLESHOOTING.md**: Creado guía completa de troubleshooting
  - Análisis del warning `LegacyRouteConverter` y su impacto
  - **NUEVA**: Solución implementada para eliminar el warning usando versionado directo en controladores
  - Soluciones a errores comunes de conexión SSL y dependencias
  - Comandos de diagnóstico y verificación rápida
  - Estados de salud del sistema y soluciones rápidas

- **API_VERSIONING.md**: Actualizada para reflejar decisión final
  - **NUEVA**: Documentación de estructura simple sin prefijo `/api`
  - **NUEVA**: Explicación de por qué no usar prefijo (warnings de compatibilidad)
  - **NUEVA**: Guía de mejores prácticas para estructura simple
  - **NUEVA**: Ejemplos de controladores sin versionado ni prefijo

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

- **LegacyRouteConverter Warning**: Resuelto al no usar prefijo `/api`
  - **Estado**: ✅ SOLUCIONADO
  - **Causa**: Prefijo global `/api` genera warning en NestJS
  - **Solución**: Estructura simple sin prefijo global
  - **Impacto**: URLs más limpias y sin warnings

- **SSL Configuration**: Requerida para producción
  - **Estado**: ✅ SOLUCIONADO
  - **Causa**: Render.com requiere SSL para conexiones de base de datos
  - **Solución**: Configuración SSL forzada en producción
  - **Impacto**: Conexiones seguras en producción

- **Dependencies**: 4 vulnerabilidades moderadas
  - **Estado**: 🔄 EN PROGRESO
  - **Causa**: Dependencias desactualizadas
  - **Solución**: Actualización gradual de dependencias
  - **Impacto**: Seguridad mejorada

### 🎯 Next Steps

1. **Implementar funcionalidades core del ecommerce**
2. **Completar sistema de autenticación**
3. **Implementar gestión de usuarios**
4. **Desarrollar módulo de productos**
5. **Crear sistema de pedidos**
