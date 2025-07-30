# 🚀 **KM0 Market Backend**

Backend robusto para la plataforma KM0 Market construido con NestJS, Prisma ORM y PostgreSQL.

## 📋 **Características**

- ✅ **Arquitectura DDD** - Domain-Driven Design
- ✅ **Prisma ORM** - Type-safe database access
- ✅ **PostgreSQL** - Base de datos robusta
- ✅ **100% Cobertura de Tests** - Tests unitarios, integración y E2E
- ✅ **Validación Completa** - Class-validator y Zod
- ✅ **Documentación API** - Swagger/OpenAPI
- ✅ **Seguridad** - Helmet, CORS, Rate limiting
- ✅ **Multi-entorno** - Development, Testing, Production

## 🏃‍♂️ **Inicio Rápido**

### **1. Verificación Rápida**

```bash
npm run quick-check
```

### **2. Configurar Entorno**

```bash
npm run setup:env
```

### **3. Configurar Base de Datos**

```bash
# Generar cliente Prisma
npm run db:generate

# Aplicar schema a desarrollo
npm run db:dev
```

### **4. Ejecutar Desarrollo**

```bash
npm run start:dev
```

## 🏗️ **Arquitectura**

```
src/
├── modules/users/           # Módulo de usuarios
│   ├── domain/             # Entidades y reglas de negocio
│   ├── application/        # Casos de uso y DTOs
│   ├── infrastructure/     # Repositorios y servicios externos
│   └── presentation/       # Controladores y endpoints
├── infrastructure/         # Servicios de infraestructura
│   └── database/          # Configuración de base de datos
├── shared/                # Utilidades compartidas
└── health/                # Health checks
```

## 🧪 **Testing**

### **Tests Unitarios**

```bash
npm run test:full:ultra    # Tests completos con cobertura
npm run test:watch         # Tests en modo watch
```

### **Tests E2E**

```bash
npm run test:e2e:full      # Tests end-to-end
```

### **Cobertura**

- ✅ **Statements**: 100%
- ✅ **Branches**: 100%
- ✅ **Functions**: 100%
- ✅ **Lines**: 100%

## 🚀 **Entornos**

### **Desarrollo**

```bash
npm run start:dev          # Puerto 4000, hot reload
npm run db:studio:dev      # Prisma Studio
```

### **Testing**

```bash
npm run test:full:ultra    # Tests con cobertura
npm run db:studio:test     # Prisma Studio para testing
```

### **Producción**

```bash
npm run build              # Build optimizado
npm run start:prod         # Servidor de producción
```

## 📊 **Endpoints**

### **Health Checks**

- `GET /health` - Estado general
- `GET /health/database` - Estado de base de datos
- `GET /health/environment` - Variables de entorno

### **API Documentation**

- `GET /api` - Swagger UI

### **Users Module**

- `GET /users` - Listar usuarios
- `POST /users` - Crear usuario
- `GET /users/:id` - Obtener usuario
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### **Profiles Module**

- `GET /profiles` - Listar perfiles
- `POST /profiles` - Crear perfil
- `GET /profiles/:id` - Obtener perfil
- `PUT /profiles/:id` - Actualizar perfil
- `DELETE /profiles/:id` - Eliminar perfil

## 🔧 **Configuración**

### **Variables de Entorno**

#### **Desarrollo (.env.development)**

```bash
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:admin@localhost:5432/km0_db_dev
JWT_SECRET=dev-jwt-secret-key
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

#### **Testing (.env.test)**

```bash
NODE_ENV=test
PORT=4001
DATABASE_URL=postgresql://postgres:admin@localhost:5432/km0_db_test
JWT_SECRET=test-jwt-secret-key
CORS_ORIGIN=http://localhost:3001
LOG_LEVEL=error
```

#### **Producción (.env)**

```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/km0_db?sslmode=require
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
```

## 📚 **Comandos Útiles**

### **Desarrollo**

```bash
npm run start:dev          # Servidor de desarrollo
npm run db:studio:dev      # Prisma Studio
npm run test:watch         # Tests en modo watch
```

### **Testing**

```bash
npm run test:full:ultra    # Tests completos
npm run test:e2e:full      # Tests E2E
npm run type-check         # Verificar tipos TypeScript
npm run lint:check         # Verificar linting
```

### **Base de Datos**

```bash
npm run db:generate        # Generar cliente Prisma
npm run db:dev             # Aplicar schema a desarrollo
npm run db:test            # Aplicar schema a testing
npm run db:prod            # Aplicar schema a producción
```

### **Utilidades**

```bash
npm run setup:env          # Configurar archivos de entorno
npm run quick-check        # Verificación rápida del proyecto
npm run clean:unnecessary-dist  # Limpiar archivos innecesarios
```

## 🔍 **Troubleshooting**

### **Problemas Comunes**

#### **1. Error de variables de entorno**

```bash
npm run setup:env
```

#### **2. Error de base de datos**

```bash
# Verificar PostgreSQL
sudo systemctl status postgresql

# Verificar conexión
psql -U postgres -d km0_db_dev -c "SELECT 1;"
```

#### **3. Error de dependencias**

```bash
rm -rf node_modules package-lock.json
npm install
```

#### **4. Error de compilación**

```bash
npm run type-check
rm -rf dist
npm run build
```

## 📖 **Documentación**

- [Guía de Configuración](docs/SETUP_AND_RUNNING.md)
- [Estado de Testing](docs/TESTING_STATUS_FINAL.md)
- [Migración a Prisma](docs/PRISMA_MIGRATION_COMPLETE.md)

## 🛠️ **Tecnologías**

- **Framework**: NestJS 11
- **ORM**: Prisma 6
- **Database**: PostgreSQL 15
- **Testing**: Jest + Supertest
- **Validation**: Class-validator + Zod
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate limiting

## 📄 **Licencia**

UNLICENSED - Propietario

---

**Estado**: ✅ **LISTO PARA PRODUCCIÓN**

**Versión**: 0.0.1

**Última actualización**: $(date)
