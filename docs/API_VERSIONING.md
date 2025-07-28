# API Versioning Guide

## 📋 **Resumen**

Este documento explica la estructura de versionado implementada en la API de KM0 Market Backend, que utiliza un enfoque de versionado por URL con prefijos.

## 🏗️ **Estructura de Versionado**

### **URLs de la API**

```
# Endpoints versionados (v1)
GET  /api/v1/example          # Endpoint de ejemplo
GET  /api/v1/example/info     # Información del versionado

# Endpoints sin versionar (siempre disponibles)
GET  /health                  # Health check básico
GET  /health/detailed         # Health check detallado
GET  /docs                    # Documentación Swagger
```

### **Constantes Centralizadas**

```typescript
// src/shared/constants/api.ts
export const API_VERSIONS = {
  V1: 'v1',
  V2: 'v2', // Para futuras versiones
} as const;

export const API_PREFIXES = {
  BASE: 'api',
  V1: `api/${API_VERSIONS.V1}`,
  V2: `api/${API_VERSIONS.V2}`,
} as const;
```

## 🎯 **Configuración en main.ts**

```typescript
// Configurar prefijo global con versionado
app.setGlobalPrefix(API_PREFIXES.V1, {
  exclude: [`/${API_ROUTES.HEALTH}`, `/${API_ROUTES.DOCS}`],
});
```

## 📁 **Estructura de Carpetas Recomendada**

```
src/
├── modules/
│   ├── v1/                    # Módulos de la versión 1
│   │   ├── users/
│   │   ├── products/
│   │   └── orders/
│   ├── v2/                    # Módulos de la versión 2 (futuro)
│   │   ├── users/
│   │   └── products/
│   └── shared/                # Módulos compartidos entre versiones
│       ├── auth/
│       └── health/
├── shared/
│   └── constants/
│       └── api.ts            # Constantes de versionado
```

## 🔧 **Cómo Crear un Controlador Versionado**

### **Ejemplo: Controlador de Usuarios v1**

```typescript
// src/modules/v1/users/users.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users-v1')
@Controller('users')
export class UsersV1Controller {
  @Get()
  getUsers() {
    return {
      message: 'Users API v1',
      version: 'v1',
      data: [],
    };
  }
}
```

### **Ejemplo: Controlador de Usuarios v2 (futuro)**

```typescript
// src/modules/v2/users/users.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users-v2')
@Controller('users')
export class UsersV2Controller {
  @Get()
  getUsers() {
    return {
      message: 'Users API v2',
      version: 'v2',
      data: [],
      newFeatures: ['pagination', 'filtering'],
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
  description: 'This endpoint is deprecated. Use /api/v2/users instead.',
  deprecated: true,
})
getUsers() {
  return {
    message: 'This endpoint is deprecated. Use /api/v2/users instead.',
    deprecated: true,
    alternative: '/api/v2/users'
  };
}
```

## 🛡️ **Seguridad y Validación**

### **Validación por Versión**

```typescript
// DTOs específicos por versión
// src/modules/v1/users/dto/create-user.dto.ts
export class CreateUserV1Dto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}

// src/modules/v2/users/dto/create-user.dto.ts
export class CreateUserV2Dto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string; // Nuevo campo en v2
}
```

## 📈 **Monitoreo y Analytics**

### **Métricas por Versión**

```typescript
// Middleware para tracking de versiones
@Injectable()
export class VersionTrackingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    const version = req.url.split('/')[2]; // Extraer versión de /api/v1/...

    // Log para analytics
    console.log(`API Version: ${version}, Endpoint: ${req.url}`);

    next();
  }
}
```

## 🎯 **Mejores Prácticas**

### **✅ Recomendado**

1. **Usar constantes centralizadas** para rutas y versiones
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

- [NestJS Global Prefix](https://docs.nestjs.com/controllers#global-prefix)
- [API Versioning Best Practices](https://restfulapi.net/versioning/)
- [Semantic Versioning](https://semver.org/)

## 📝 **Notas de Implementación**

- **Prefijo global**: Configurado en `main.ts` con `setGlobalPrefix()`
- **Exclusiones**: Health y docs excluidos del versionado
- **Constantes**: Centralizadas en `src/shared/constants/api.ts`
- **Documentación**: Swagger configurado para mostrar versiones
- **Tests**: Cada versión debe tener sus propios tests
