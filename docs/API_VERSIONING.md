# API Guide - Simple Structure

## 📋 **Resumen**

Este documento explica la estructura simple de la API de KM0 Market Backend, sin versionado y sin prefijo `/api` para mantener la simplicidad y facilidad de mantenimiento.

## 🎯 **Estrategia de API**

### **API Simple Sin Versionado y Sin Prefijo**

Utilizamos una **estructura simple sin versionado ni prefijo** para mantener la simplicidad:

- ✅ **Simple y directo**
- ✅ **Fácil de mantener**
- ✅ **Menos verboso**
- ✅ **Perfecto para proyectos pequeños/medianos**
- ✅ **Sin complejidad innecesaria**
- ✅ **Sin warnings de compatibilidad**

## 🏗️ **Estructura de la API**

### **URLs de la API**

```
# Endpoints principales
GET  /example                 # Endpoint de ejemplo
GET  /example/info            # Información de la API

# Endpoints del sistema
GET  /health                  # Health check básico
GET  /health/detailed         # Health check detallado
GET  /docs                    # Documentación Swagger
```

### **Constantes Centralizadas**

```typescript
// src/shared/constants/api.ts
export const API_ROUTES = {
  HEALTH: 'health',
  HEALTH_DETAILED: 'health/detailed',
  DOCS: 'docs',
  SWAGGER: 'swagger',
} as const;

export const API_ENDPOINTS = {
  HEALTH: `/${API_ROUTES.HEALTH}`,
  HEALTH_DETAILED: `/${API_ROUTES.HEALTH_DETAILED}`,
  DOCS: `/${API_ROUTES.DOCS}`,
  SWAGGER: `/${API_ROUTES.SWAGGER}`,
} as const;
```

## 🎯 **Configuración de la API**

### **Estructura Simple**

```typescript
// Controladores simples sin versionado ni prefijo
@Controller('example')
export class ExampleController {
  // ...
}

@Controller('health')
export class HealthController {
  // ...
}
```

**✅ Ventajas:**

- Simple y directo
- Fácil de mantener
- Sin complejidad innecesaria
- Perfecto para proyectos pequeños/medianos
- Sin warnings de compatibilidad
- URLs más cortas y limpias

## 📁 **Estructura de Carpetas Recomendada**

```
src/
├── modules/
│   ├── users/                # Módulos de usuarios
│   ├── products/             # Módulos de productos
│   ├── orders/               # Módulos de pedidos
│   └── shared/               # Módulos compartidos
│       ├── auth/
│       └── health/
├── shared/
│   └── constants/
│       └── api.ts            # Constantes de API
```

## 🔧 **Cómo Crear un Controlador**

### **Ejemplo: Controlador de Usuarios**

```typescript
// src/modules/users/users.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Get()
  getUsers() {
    return {
      message: 'Users API',
      data: [],
    };
  }
}
```

## 🚫 **Endpoints Sin Versionar**

Los siguientes endpoints **NO** deben versionarse y siempre estarán disponibles en la raíz:

- **`/health`** - Health check básico
- **`/health/detailed`** - Health check detallado
- **`/docs`** - Documentación Swagger
- **`/swagger`** - Swagger UI (si se configura)

### **Razones para no versionar:**

1. **Health checks**: Necesarios para monitoreo y load balancers
2. **Documentación**: Debe ser accesible sin importar la versión
3. **Endpoints de sistema**: No son parte de la lógica de negocio

## 📊 **Estrategia de Versionado**

### **Cuándo Crear una Nueva Versión**

1. **Cambios breaking**: Modificaciones que rompen compatibilidad
2. **Nuevas funcionalidades**: Features que no pueden coexistir con la versión actual
3. **Refactoring mayor**: Cambios estructurales significativos

### **Cuándo NO Crear una Nueva Versión**

1. **Bug fixes**: Correcciones que no rompen compatibilidad
2. **Nuevos campos opcionales**: Agregar campos que no son requeridos
3. **Mejoras de performance**: Optimizaciones internas

## 🔄 **Migración entre Versiones**

### **Plan de Migración**

1. **Fase 1**: Mantener ambas versiones activas
2. **Fase 2**: Deprecar endpoints de la versión anterior
3. **Fase 3**: Eliminar completamente la versión anterior

### **Ejemplo de Deprecación**

```typescript
@Get()
@ApiOperation({
  summary: 'Get users (DEPRECATED)',
  description: 'This endpoint is deprecated. Use /users/v2 instead.',
  deprecated: true,
})
getUsers() {
  return {
    message: 'This endpoint is deprecated. Use /users/v2 instead.',
    deprecated: true,
    alternative: '/users/v2'
  };
}
```

## 🛡️ **Seguridad y Validación**

### **Validación por Versión**

```typescript
// DTOs específicos por versión
// src/modules/users/dto/create-user.dto.ts
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}
```

## 📈 **Monitoreo y Analytics**

### **Métricas por Versión**

```typescript
// Middleware para tracking de versiones
@Injectable()
export class VersionTrackingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    // Log para analytics
    console.log(`API Endpoint: ${req.url}`);

    next();
  }
}
```

## 🎯 **Mejores Prácticas**

### **✅ Recomendado**

1. **Usar constantes centralizadas** para rutas
2. **Documentar cambios** entre versiones
3. **Mantener compatibilidad** durante transiciones
4. **Usar DTOs específicos** por versión
5. **Implementar deprecación gradual**

### **❌ Evitar**

1. **Versionar endpoints de sistema** (health, docs)
2. **Crear versiones innecesarias** para cambios menores
3. **Romper compatibilidad** sin aviso previo
4. **Mezclar lógica** entre versiones
5. **Olvidar documentación** de cambios

## 🔗 **Referencias**

- [NestJS Controllers](https://docs.nestjs.com/controllers)
- [API Versioning Best Practices](https://restfulapi.net/versioning/)
- [Semantic Versioning](https://semver.org/)

## 📝 **Notas de Implementación**

- **Sin prefijo global**: No usamos `setGlobalPrefix()` para evitar warnings
- **Controladores directos**: Cada controlador define su propia ruta
- **Constantes**: Centralizadas en `src/shared/constants/api.ts`
- **Documentación**: Swagger configurado para mostrar endpoints
- **Tests**: Cada endpoint debe tener sus propios tests
