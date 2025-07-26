# Arquitectura del Proyecto

## 🏗️ Estructura Modular + Clean Architecture

### 📁 Organización de Carpetas

```
src/
├── shared/                    # Recursos compartidos
│   ├── constants/            # Constantes globales
│   ├── decorators/           # Decoradores personalizados
│   ├── filters/              # Filtros de excepción
│   ├── guards/               # Guards globales
│   ├── interceptors/         # Interceptores globales
│   ├── pipes/                # Pipes de validación
│   └── utils/                # Utilidades comunes
│
├── modules/                   # Módulos de negocio
│   ├── auth/                 # Autenticación
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── guards/
│   │   ├── strategies/
│   │   └── auth.module.ts
│   │
│   ├── users/                # Gestión de usuarios
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── entities/
│   │   ├── dto/
│   │   └── users.module.ts
│   │
│   ├── products/             # Gestión de productos
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── entities/
│   │   ├── dto/
│   │   └── products.module.ts
│   │
│   ├── orders/               # Gestión de pedidos
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── entities/
│   │   ├── dto/
│   │   └── orders.module.ts
│   │
│   └── security/             # Seguridad (rate limiting, etc.)
│       ├── controllers/
│       ├── services/
│       ├── middleware/
│       └── security.module.ts
│
├── infrastructure/            # Capa de infraestructura
│   ├── database/             # Configuración de BD
│   ├── cache/                # Configuración de caché
│   ├── external/             # APIs externas
│   └── messaging/            # Mensajería
│
├── config/                   # Configuración
├── health/                   # Health checks
└── app.module.ts             # Módulo raíz
```

## 🎯 Principios de Arquitectura

### 1. **Separación de Responsabilidades**

- **Módulos**: Cada módulo maneja una funcionalidad específica
- **Shared**: Recursos reutilizables entre módulos
- **Infrastructure**: Configuración de servicios externos

### 2. **Escalabilidad**

- **Fácil agregar módulos**: Estructura consistente
- **Independencia**: Cada módulo puede evolucionar por separado
- **Reutilización**: Shared components entre módulos

### 3. **Testabilidad**

- **Tests por módulo**: Cada módulo tiene sus propios tests
- **Mocks independientes**: Fácil mockear dependencias
- **Cobertura granular**: Medir cobertura por módulo

## 📋 Convenciones de Nomenclatura

### **Módulos**

- `auth.module.ts` - Módulo de autenticación
- `users.module.ts` - Módulo de usuarios
- `products.module.ts` - Módulo de productos

### **Controllers**

- `auth.controller.ts` - Controlador de autenticación
- `users.controller.ts` - Controlador de usuarios

### **Services**

- `auth.service.ts` - Servicio de autenticación
- `users.service.ts` - Servicio de usuarios

### **DTOs**

- `create-user.dto.ts` - DTO para crear usuario
- `update-user.dto.ts` - DTO para actualizar usuario

## 🔧 Estructura de un Módulo Típico

```
modules/users/
├── controllers/
│   └── users.controller.ts
├── services/
│   └── users.service.ts
├── entities/
│   └── user.entity.ts
├── dto/
│   ├── create-user.dto.ts
│   └── update-user.dto.ts
├── users.module.ts
└── users.module.spec.ts
```

## 🚀 Beneficios de esta Arquitectura

### **✅ Ventajas**

1. **Escalabilidad**: Fácil agregar nuevos módulos
2. **Mantenibilidad**: Código organizado y predecible
3. **Testabilidad**: Tests independientes por módulo
4. **Reutilización**: Shared components
5. **NestJS-friendly**: Se adapta perfectamente al framework

### **📈 Métricas de Calidad**

- **Cobertura por módulo**: Medir independientemente
- **Complejidad ciclomática**: Reducida por separación
- **Acoplamiento**: Mínimo entre módulos
- **Cohesión**: Alta dentro de cada módulo

## 🎯 Próximos Pasos

1. **Implementar módulos base**: Auth, Users, Products
2. **Crear shared components**: Guards, Interceptors, Pipes
3. **Configurar infraestructura**: Database, Cache
4. **Documentar APIs**: Swagger por módulo
5. **Tests e2e**: Por funcionalidad de negocio

## 📈 Política de Cobertura y Documentación

### 🎯 **Umbrales de Cobertura**

- **Umbrales configurados:** 80% branches, 90% functions/lines/statements
- **Cobertura real:** 100% en todas las métricas
- **Validación automática:** Pre-commit y pre-push hooks
- **Archivos excluidos:** Solo archivos declarativos/configuración

### 📊 **Estado Actual**

- **Módulos implementados:** Health, Security
- **Tests:** 204 tests pasando
- **Cobertura:** 100% en todos los archivos relevantes
- **Documentación:** Siempre alineada con el estado real del código
- **Swagger:** Configurado y documentado
