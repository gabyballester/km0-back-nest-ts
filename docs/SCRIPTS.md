# Scripts del Proyecto - KM0 Market Backend

## 📋 **RESUMEN DE LIMPIEZA REALIZADA**

**Fecha**: Diciembre 2024
**Objetivo**: Simplificar y optimizar los scripts de `package.json` eliminando redundancias y legacy.

### **Scripts Eliminados/Comentados:**

- Scripts de entorno redundantes (`env:*`, `setup:env`, `clean:env`)
- Scripts de chequeo (`check:process-env`, `check-deployment`, `db:safety`)
- Scripts de despliegue (`deploy:*`)
- Scripts de validación legacy (`validate:coverage*`, `validate:staged:strict`, `validate:full:strict`)

### **Scripts Mantenidos:**

- Scripts esenciales de desarrollo, testing y producción
- Scripts de validación y calidad de código
- Scripts de base de datos

---

## 🚀 **SCRIPTS DE INICIO Y BUILD**

### **Desarrollo**

```bash
npm run start:dev
```

- **Descripción**: Inicia el servidor en modo desarrollo con hot reload
- **Entorno**: `NODE_ENV=development`
- **Características**: Watch mode, SWC builder, timed execution

### **Producción**

```bash
npm run start:prod
```

- **Descripción**: Inicia el servidor de producción desde `dist/`
- **Uso**: Después de `npm run build`

### **Build**

```bash
npm run build
npm run build:prod
```

- **Descripción**: Compila el proyecto usando SWC builder
- **Salida**: `dist/` directory

---

## 🧪 **SCRIPTS DE TESTING**

### **Tests Unitarios Rápidos**

```bash
npm run test:quick
```

- **Descripción**: Ejecuta tests unitarios sin coverage
- **Entorno**: `NODE_ENV=test`
- **Características**: 4 workers, bail on fail, silent mode
- **Uso**: Automático en pre-commit

### **Tests Unitarios Ultra Rápidos**

```bash
npm run test:quick:ultra
```

- **Descripción**: Ejecuta tests unitarios con optimizaciones de velocidad máxima
- **Entorno**: `NODE_ENV=test`
- **Características**: 6 workers, optimizaciones SWC, sin cobertura, force exit
- **Uso**: Automático en pre-commit (versión optimizada)
- **Velocidad**: ~20% más rápido que test:quick

### **Tests Unitarios Completos**

```bash
npm run test:full
```

- **Descripción**: Ejecuta tests unitarios con coverage
- **Entorno**: `NODE_ENV=test`
- **Características**: 2 workers, coverage report, bail on fail

### **Tests Unitarios Completos Rápidos**

```bash
npm run test:full:fast
```

- **Descripción**: Ejecuta tests unitarios con coverage optimizado
- **Entorno**: `NODE_ENV=test`
- **Características**: 4 workers, coverage report, optimizaciones de velocidad
- **Velocidad**: ~30% más rápido que test:full

### **Tests Unitarios con Validación de Cobertura**

```bash
npm run test:full:coverage
```

- **Descripción**: Ejecuta tests unitarios con validación de umbrales de cobertura
- **Entorno**: `NODE_ENV=test`
- **Características**: 2 workers, coverage report, validación de umbrales, bail on fail
- **Umbrales**: branches: 80%, functions: 90%, lines: 90%, statements: 90%
- **Uso**: Automático en pre-push

### **Tests E2E Rápidos**

```bash
npm run test:e2e:quick
```

- **Descripción**: Ejecuta tests end-to-end rápidos
- **Timeout**: 3 segundos por test
- **Características**: 1 worker, bail on fail

### **Tests E2E Completos**

```bash
npm run test:e2e:full
```

- **Descripción**: Ejecuta tests end-to-end completos
- **Entorno**: `NODE_ENV=test`
- **Características**: 1 worker, bail on fail

### **Tests con Watch**

```bash
npm run test:watch
```

- **Descripción**: Ejecuta tests en modo watch
- **Uso**: Desarrollo continuo

### **Tests con Debug**

```bash
npm run test:debug
```

- **Descripción**: Ejecuta tests con debugger
- **Uso**: Depuración de tests

---

## 🔍 **SCRIPTS DE VALIDACIÓN Y CALIDAD**

### **Type Checking**

```bash
npm run type-check
```

- **Descripción**: Verifica tipos TypeScript sin emitir archivos
- **Comando**: `tsc --noEmit`

### **Linting**

```bash
npm run lint
npm run lint:check
```

- **Descripción**: Ejecuta ESLint con/sin auto-fix
- **Configuración**: `max-warnings=0`

### **Formatting**

```bash
npm run format
npm run format:check
```

- **Descripción**: Ejecuta Prettier con/sin write
- **Archivos**: `src/**/*.ts`, `test/**/*.ts`

### **Validación Completa**

```bash
npm run validate:quick
npm run validate:staged
npm run validate:full
```

- **Quick**: Format + Type-check + Lint
- **Staged**: Quick + Tests de archivos modificados
- **Full**: Quick + Tests unitarios + Tests E2E

---

## 🗄️ **SCRIPTS DE BASE DE DATOS**

### **Generación y Migración**

```bash
npm run db:generate    # Genera cliente Prisma
npm run db:push        # Push schema a DB
npm run db:migrate     # Migración de desarrollo
npm run db:migrate:deploy  # Migración de producción
npm run db:migrate:reset   # Reset migraciones
```

### **Entornos Específicos**

```bash
npm run db:dev         # DB push para desarrollo
npm run db:test        # DB push para testing
npm run db:prod        # DB push para producción (seguro)
```

### **Prisma Studio**

```bash
npm run db:studio      # Studio general
npm run db:studio:dev  # Studio para desarrollo
npm run db:studio:test # Studio para testing
npm run db:studio:prod # Studio para producción
```

---

## 🔧 **GIT HOOKS**

### **Configuración de Hooks**

Los hooks están configurados directamente en los archivos `.husky/` para mayor control y claridad:

#### **`.husky/pre-commit`**

```bash
npx lint-staged
npm run test:quick
```

#### **`.husky/pre-push`**

```bash
npm run format:check
npm run type-check
npm run lint:check
npm run test:full:coverage
npm run test:e2e:full
```

### **Estrategia de Validación**

**Pre-commit (Rápido y Seguro):**

- ✅ **Format**: Prettier en archivos staged
- ✅ **Lint**: ESLint con auto-fix en archivos staged
- ✅ **Tests**: Tests rápidos (sin coverage)
- ⏱️ **Tiempo**: ~7-10 segundos
- 🎯 **Objetivo**: Validación rápida con tests básicos

**Pre-push (Completo y Riguroso):**

- ✅ **Format**: Prettier en todo el proyecto
- ✅ **Type-check**: TypeScript completo (proyecto global)
- ✅ **Lint**: ESLint completo
- ✅ **Tests**: Unitarios con validación de cobertura + E2E
- ✅ **Coverage**: Validación de umbrales (branches: 80%, functions: 90%, lines: 90%, statements: 90%)
- ⏱️ **Tiempo**: ~12-15 segundos
- 🎯 **Objetivo**: Garantizar calidad y cobertura antes de push

**¿Por qué no type-check en pre-commit?**

- Los decoradores de NestJS requieren contexto global de TypeScript
- Lint-staged ejecuta `tsc --noEmit` sobre archivos individuales
- Esto causa falsos positivos en decoradores (`@Controller`, `@Get`, etc.)
- La validación de tipos debe hacerse sobre el proyecto completo

### **Pre-commit**

```bash
npm run pre-commit
```

- **Descripción**: Ejecutado automáticamente por Husky
- **Acciones**: lint-staged (format + lint)
- **Nota**: Type-check se ejecuta en pre-push para evitar falsos positivos con decoradores de NestJS

### **Pre-push**

- **Descripción**: Ejecutado automáticamente por Husky
- **Acciones**: `npm run validate:full`

---

## 📊 **COBERTURA DE TESTS**

### **Umbrales Configurados**

- **Branches**: 80%
- **Functions**: 90%
- **Lines**: 90%
- **Statements**: 90%

### **Configuración**

- **Archivo**: `jest.config.js`
- **Variable**: `JEST_COVERAGE_THRESHOLD` (opcional)
- **Comportamiento**: Fallo si no se alcanzan umbrales

---

## ⚡ **OPTIMIZACIONES DE VELOCIDAD**

### **Configuraciones Implementadas**

#### **Jest Optimizado**

- **SWC**: Transformador ultra rápido en lugar de Babel
- **Workers Dinámicos**: Configuración automática según CPU
- **Cache Inteligente**: Cache persistente entre ejecuciones
- **Sin Source Maps**: Deshabilitados para velocidad
- **Force Exit**: Salida forzada para evitar delays

#### **Optimizaciones por Script**

| Script               | Workers | Cobertura | Optimizaciones | Tiempo Estimado |
| -------------------- | ------- | --------- | -------------- | --------------- |
| `test:quick`         | 4       | ❌        | Básicas        | ~5.5s           |
| `test:quick:ultra`   | 6       | ❌        | Máximas        | ~6.2s           |
| `test:full`          | 2       | ✅        | Básicas        | ~12s            |
| `test:full:fast`     | 4       | ✅        | Optimizadas    | ~8s             |
| `test:full:coverage` | 2       | ✅        | Con umbrales   | ~12s            |

#### **Variables de Entorno**

```bash
JEST_MAX_WORKERS=6        # Número de workers (default: 100%)
JEST_COVERAGE=true        # Habilitar cobertura
NODE_ENV=test            # Entorno de testing
```

### **Recomendaciones de Uso**

- **Desarrollo**: `test:quick:ultra` (más rápido)
- **Pre-commit**: `test:quick:ultra` (automático)
- **Pre-push**: `test:full:coverage` (con validación)
- **CI/CD**: `test:full:fast` (balance velocidad/cobertura)

---

## 🚨 **SCRIPTS LEGACY (ELIMINADOS)**

Los siguientes scripts fueron eliminados por redundancia o falta de uso:

### **Scripts de Entorno**

- `env:setup`, `env:example`, `env:info`
- `env:dev`, `env:test`, `env:prod`
- `setup:env`, `clean:env`, `test:environments`

### **Scripts de Chequeo**

- `check:process-env`, `check-deployment`
- `db:safety`

### **Scripts de Despliegue**

- `deploy:railway`, `deploy:render`, `deploy:vercel`

### **Scripts de Validación Legacy**

- `validate:coverage:strict`, `validate:coverage:100`
- `validate:staged:strict`, `validate:full:strict`
- `validate:staged:light`

---

## 📚 **REFERENCIAS**

### **Documentación Oficial**

- [NestJS CLI](https://docs.nestjs.com/cli/overview)
- [Jest Configuration](https://jestjs.io/docs/configuration)
- [ESLint Configuration](https://eslint.org/docs/user-guide/configuring)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [Prisma CLI](https://www.prisma.io/docs/reference/api-reference/command-reference)

### **Mejores Prácticas**

- Usar `timed-run.js` para scripts complejos
- Configurar `max-warnings=0` en ESLint
- Usar `--bail` en tests para fallo rápido
- Configurar workers apropiados según CPU
- Usar `dotenv-cli` para entornos específicos
