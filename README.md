# KM0 Market Backend

## 🚀 **REGLAS OBLIGATORIAS DE DESARROLLO**

### ⚡ **Scripts Rápidos - USO OBLIGATORIO**

**✅ SIEMPRE usar en desarrollo:**

```bash
npm run test:quick   # Tests rápidos (~3.5s)
npm run lint         # Linting rápido (~1s)
npm run format       # Formatear (~0.5s)
npm run start:dev    # Servidor desarrollo con hot reload
```

**❌ NUNCA usar en desarrollo:**

```bash
npm run test:full    # Lento, solo para CI/CD
npm run test:e2e:full # Lento, solo para CI/CD
```

### 🛡️ **Sistema de Validación Automática**

**Pre-commit (Archivos Staged):**

- ✅ Formato, Type-check, ESLint, Tests rápidos
- ✅ Cobertura según umbrales configurados
- ⏱️ Tiempo: ~5-6 segundos

**Pre-push (Proyecto Completo):**

- ✅ Validación completa + Tests E2E
- ✅ Cobertura según umbrales configurados
- ⏱️ Tiempo: ~8-10 segundos

**📖 Ver documentación completa:** [docs/SCRIPTS.md](./docs/SCRIPTS.md)

## 🏗️ Arquitectura Modular + Clean Architecture

### 📁 Estructura del Proyecto

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
│   ├── users/                # Gestión de usuarios
│   ├── products/             # Gestión de productos
│   ├── orders/               # Gestión de pedidos
│   └── security/             # Seguridad (rate limiting, etc.)
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

**📖 Ver documentación completa:** [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm o yarn
- PostgreSQL (para producción)

### Documentación de API

- **Swagger UI**: `http://localhost:4000/api` (desarrollo)
- **Swagger UI**: `https://km0-market.onrender.com/api` (producción)

### Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
npm run env:setup

# Ejecutar tests rápidos (OBLIGATORIO)
npm run test:quick

# Iniciar servidor desarrollo con hot reload
npm run start:dev
```

### Variables de Entorno

```bash
# Copiar configuración de ejemplo
npm run env:example

# O usar configuración de desarrollo
npm run env:setup
```

## 🚀 Deployment Rápido

### Render (Recomendado - Gratuito)

**Deployment en 5 minutos:**

1. **Ir a [render.com](https://render.com)**
2. **Conectar cuenta de GitHub**
3. **Seleccionar este repositorio**
4. **Render detectará automáticamente que es NestJS**
5. **Configurar variables de entorno en el dashboard**
6. **¡Listo! Deployment automático en cada push**

**Variables de entorno requeridas:**

```bash
NODE_ENV=production
JWT_SECRET=tu-super-secret-jwt-key-at-least-32-characters-long
COOKIE_SECRET=tu-super-secret-cookie-key-at-least-32-characters-long
DATABASE_URL=postgresql://username:password@host:port/database
```

**📖 Ver guía completa:** [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

### Alternativas

- **Render**: [render.com](https://render.com) - Excelente alternativa
- **Vercel**: [vercel.com](https://vercel.com) - Para APIs simples
- **DigitalOcean**: [digitalocean.com](https://digitalocean.com) - Profesional

## 📊 Métricas del Proyecto

### ⚡ Performance

- **Tests rápidos**: ~3.5s (204 tests)
- **Linting**: ~1s (con cache)
- **Build**: ~3s (SWC)
- **Startup**: ~2s (desarrollo)

### 🛡️ Calidad

- **Cobertura**: 100% statements, 100% branches, 100% functions, 100% lines
- **Umbrales configurados**: 80% branches, 90% functions/lines/statements
- **Linting**: 0 warnings, 0 errors
- **TypeScript**: Strict mode habilitado
- **Prettier**: Formato consistente
- **Validación automática**: Pre-commit y pre-push hooks

### 🏗️ Arquitectura

- **Módulos**: 2 módulos implementados (health, security)
- **Tests**: 204 tests pasando
- **Documentación**: Completa y actualizada con Swagger

## 🎯 Scripts Disponibles

### 🏃‍♂️ Scripts Rápidos (Desarrollo Diario)

```bash
npm run test:quick     # Tests unitarios sin cobertura (~3.5s)
npm run test:e2e:quick # Tests e2e optimizados (~3s)
npm run lint           # ESLint + Prettier con cache (~1s)
npm run format         # Solo Prettier (~0.5s)
npm run start:dev      # Servidor desarrollo con hot reload (recomendado)
```

### 🐌 Scripts Lentos (CI/CD)

```bash
npm run test:full      # Tests con cobertura completa (~5.3s)
npm run test:e2e:full  # Tests e2e completos (~2.6s)
npm run build          # Build de producción
npm run start:prod     # Servidor de producción
```

### 🔧 Scripts de Utilidad

```bash
npm run env:setup      # Configurar .env desde env.mirror
npm run env:example    # Configurar .env desde env.example
npm run format:check   # Verificar formato sin cambiar
```

## 🧪 Testing

### Estrategia de Testing

- **Tests unitarios**: Cada módulo tiene sus propios tests
- **Tests de integración**: ConfigService, módulos
- **Tests e2e**: End-to-end para flujos críticos
- **Cobertura**: Umbrales realistas y alcanzables

### Mejores Prácticas

- **ConfigService**: Usar en lugar de `process.env`
- **Factories**: Generar datos de prueba consistentes
- **Mocks**: Solo cuando sea necesario
- **Velocidad**: Priorizar tests rápidos

**📖 Ver documentación completa:** [docs/TESTING.md](./docs/TESTING.md)

## 🏆 Cobertura y Calidad

### 📊 **Umbrales de Cobertura (Fuente de Verdad)**

Los umbrales están configurados en `jest.config.js` y son la **fuente de verdad**:

```javascript
coverageThreshold: {
  global: {
    branches: 80,    // 80% de cobertura de ramas
    functions: 90,   // 90% de cobertura de funciones
    lines: 90,       // 90% de cobertura de líneas
    statements: 90,  // 90% de cobertura de statements
  },
}
```

### 🎯 **Estado Actual**

- **Cobertura real:** 100% en todas las métricas
- **Umbrales mínimos:** 80% branches, 90% functions/lines/statements
- **Archivos excluidos:** Solo archivos declarativos/configuración
- **Validación automática:** Pre-commit y pre-push hooks

### 📈 **Estrategia de Calidad**

- **Umbrales realistas:** Configurables según necesidades del proyecto
- **Aspiración al 100%:** Script especial disponible (`npm run validate:coverage:100`)
- **Validación automática:** Bloqueo de commits/push con errores
- **Documentación alineada:** Siempre actualizada con el estado real

---

**Desarrollado con ❤️ usando NestJS, TypeScript y SWC**

## 📚 Documentación

- **[Scripts Rápidos](./docs/SCRIPTS.md)**: Uso obligatorio de scripts optimizados
- **[Arquitectura](./docs/ARCHITECTURE.md)**: Estructura modular y principios
- **[Testing](./docs/TESTING.md)**: Estrategia y mejores prácticas
- **[Deployment](./docs/DEPLOYMENT.md)**: Configuración de producción
- **[Swagger API](./docs/SWAGGER.md)**: Documentación de API y configuración

## 🚨 Reglas Importantes

### ⚡ Desarrollo Diario

1. **SIEMPRE usar `npm run test:quick`** para verificar cambios
2. **SIEMPRE usar `npm run lint`** antes de commits
3. **NUNCA usar `npm run test:full`** en desarrollo
4. **Mantener cobertura alta** pero realista

### 🏗️ Arquitectura

1. **Seguir estructura modular** para nuevos features
2. **Usar ConfigService** en lugar de `process.env`
3. **Documentar cambios** importantes
4. **Mantener tests actualizados**

### 🛡️ Calidad

1. **TypeScript balanceado** - Seguridad con practicidad
2. **ESLint con warnings permitidos** - Flexibilidad en desarrollo
3. **Prettier** para formato consistente
4. **Tests pasando** antes de commits

## 🤝 Contribución

1. **Fork** el repositorio
2. **Crear branch** para feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Seguir reglas** de scripts rápidos
4. **Ejecutar tests** rápidos antes de commits
5. **Commit** cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
6. **Push** al branch (`git push origin feature/nueva-funcionalidad`)
7. **Crear Pull Request**

## 📄 Licencia

Este proyecto es privado y no está licenciado para uso público.
