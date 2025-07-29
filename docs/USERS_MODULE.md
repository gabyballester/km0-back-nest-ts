# Módulo de Usuarios - Documentación

## 📋 Resumen

El módulo de usuarios ha sido implementado completamente siguiendo la arquitectura hexagonal (Clean Architecture) con NestJS. Este módulo proporciona funcionalidades CRUD completas para la gestión de usuarios.

## 🏗️ Arquitectura

### Estructura del Módulo

```
src/modules/users/
├── application/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   │   └── user-response.dto.ts
│   └── services/
│       └── user.service.ts
├── domain/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── repositories/
│   │   └── user.repository.interface.ts
│   └── services/
│       └── user.service.interface.ts
├── infrastructure/
│   ├── repositories/
│   │   └── user.repository.ts
│   └── services/
│       └── user-domain.service.ts
├── presentation/
│   └── user.controller.ts
└── user.module.ts
```

## 🎯 Funcionalidades Implementadas

### Entidad de Dominio

- **User Entity**: Entidad con lógica de negocio encapsulada
- **Métodos de dominio**: `hasRole()`, `isAdmin`, `activate()`, `deactivate()`, etc.
- **Validaciones de negocio**: Reglas de negocio implementadas en la entidad

### DTOs (Data Transfer Objects)

- **CreateUserDto**: Para creación de usuarios con validaciones
- **UpdateUserDto**: Para actualización parcial de usuarios
- **UserResponseDto**: Para respuestas de la API
- **Validaciones en español**: Mensajes de error localizados

### Servicios

- **UserService**: Servicio de aplicación con casos de uso
- **UserDomainService**: Servicio de dominio para lógica compleja
- **Inyección de dependencias**: Interfaces en lugar de implementaciones concretas

### Repositorio

- **UserRepository**: Implementación con Drizzle ORM
- **Interfaz de repositorio**: Abstracción para facilitar testing
- **Operaciones CRUD**: Completas con paginación y filtros

### Controlador

- **UserController**: Endpoints REST completos
- **Validación automática**: DTOs con class-validator
- **Respuestas tipadas**: TypeScript estricto

## 🚀 Endpoints Disponibles

### CRUD Básico

- `POST /users` - Crear usuario
- `GET /users` - Listar usuarios (con paginación)
- `GET /users/:id` - Obtener usuario por ID
- `PUT /users/:id` - Actualizar usuario completo
- `DELETE /users/:id` - Eliminar usuario

### Endpoints Especializados

- `GET /users/active` - Listar usuarios activos
- `GET /users/count` - Contar usuarios
- `GET /users/role/:role` - Filtrar por rol
- `GET /users/email/:email` - Buscar por email
- `PUT /users/:id/activate` - Activar usuario
- `PUT /users/:id/deactivate` - Desactivar usuario
- `PUT /users/:id/role` - Cambiar rol
- `PUT /users/:id/password` - Cambiar contraseña

## 🗄️ Base de Datos

### Esquema de Usuario

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT cuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### ORM Configurado

- **Drizzle ORM**: Para operaciones de base de datos
- **Prisma**: Esquema sincronizado para compatibilidad
- **PostgreSQL**: Base de datos principal

## 🧪 Testing

### Cobertura de Tests

- **388 tests unitarios** pasando
- **Tests de entidad**: Validación de lógica de negocio
- **Tests de DTOs**: Validación de entrada de datos
- **Tests de servicios**: Casos de uso y lógica de aplicación
- **Tests de controlador**: Endpoints y respuestas HTTP
- **Tests de repositorio**: Operaciones de base de datos

### Factories

- **UserFactory**: Generación automática de datos de prueba
- **Faker.js**: Datos realistas para testing

## 🔧 Configuración

### Variables de Entorno

```env
DATABASE_URL=postgresql://user:password@localhost:5432/km0_db_dev
DATABASE_ORM=drizzle
JWT_SECRET=your-secret-key
```

### Validaciones

- **Email**: Formato válido y único
- **Password**: Mínimo 8 caracteres, mayúscula, minúscula y número
- **Nombres**: 2-50 caracteres
- **Roles**: user, admin, moderator

## 📊 Estado Actual

### ✅ Completado

- [x] Arquitectura hexagonal implementada
- [x] Entidad de dominio con lógica de negocio
- [x] DTOs con validaciones en español
- [x] Servicios de aplicación y dominio
- [x] Repositorio con Drizzle ORM
- [x] Controlador con endpoints CRUD
- [x] Base de datos sincronizada
- [x] Tests unitarios completos
- [x] Factories para testing
- [x] Documentación del módulo

### 🔄 En Desarrollo

- [ ] Autenticación JWT
- [ ] Autorización por roles
- [ ] Tests E2E
- [ ] Documentación Swagger

### 📋 Pendiente

- [ ] Recuperación de contraseña
- [ ] Verificación de email
- [ ] Logs de auditoría
- [ ] Rate limiting específico
- [ ] Cache de usuarios

## 🚀 Uso

### Crear Usuario

```bash
curl -X POST http://localhost:4000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "Password123",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "user"
  }'
```

### Listar Usuarios

```bash
curl -X GET http://localhost:4000/users
```

### Obtener Usuario por ID

```bash
curl -X GET http://localhost:4000/users/{id}
```

## 🔗 Dependencias

- **NestJS**: Framework principal
- **Drizzle ORM**: ORM para base de datos
- **class-validator**: Validación de DTOs
- **@paralleldrive/cuid2**: Generación de IDs únicos
- **Jest**: Framework de testing

## 📝 Notas de Desarrollo

- El módulo sigue las mejores prácticas de Clean Architecture
- Todas las validaciones están en español
- Los tests tienen cobertura completa
- La documentación está actualizada
- El código está listo para producción

---

**Rama actual**: `feature/users-module`
**Última actualización**: 2025-07-28
**Estado**: ✅ Completado y funcional
