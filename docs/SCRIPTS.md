# Scripts y Comandos - KM0 Market Backend

## 📋 **RESUMEN DE SCRIPTS DISPONIBLES**

### **🚀 Scripts de Inicio**

```bash
npm run start:dev      # 🔄 Inicio desarrollo con hot reload (recomendado)
npm run start:prod     # 🏭 Inicio de producción
```

### **🧪 Scripts de Testing**

```bash
npm run test:quick     # ⚡ Tests rápidos sin coverage (~3.5s)
npm run test:full      # 📊 Tests completos con coverage (~5.3s)
npm run test:watch     # 👀 Tests en modo watch
npm run test:debug     # 🐛 Tests en modo debug
npm run test:e2e:quick # ⚡ E2E tests rápidos (~3s)
npm run test:e2e:full  # 📊 E2E tests completos (~2.6s)
```

### **🔧 Scripts de Entorno**

```bash
npm run env:info       # ℹ️ Ver entorno actual
npm run env:dev        # 🔧 Verificar entorno desarrollo
npm run env:test       # 🧪 Verificar entorno testing
npm run env:prod       # 🏭 Verificar entorno producción
npm run setup:env      # 🔧 Configurar archivos de entorno
npm run env:setup      # 📋 Copiar env.mirror a .env
npm run env:example    # 📋 Copiar env.example a .env
npm run test:environments # 🧪 Probar todos los entornos
```

### **🗄️ Scripts de Base de Datos**

```bash
npm run db:generate    # 🔧 Generar cliente Prisma
npm run db:push        # 📤 Sincronizar esquema
npm run db:migrate     # 🔄 Crear migración
npm run db:studio      # 🖥️ Abrir Prisma Studio
```

### **🌍 Scripts de Entorno por Base de Datos**

```bash
npm run db:dev         # 🔧 DB desarrollo
npm run db:test        # 🧪 DB testing
npm run db:prod        # 🏭 DB producción
npm run db:studio:dev  # 🖥️ Studio desarrollo
npm run db:studio:test # 🖥️ Studio testing
npm run db:studio:prod # 🖥️ Studio producción
```

### **🔍 Scripts de Validación**

```bash
npm run validate:quick # ⚡ Validación rápida
npm run validate:full  # 📊 Validación completa
npm run validate:coverage # 📈 Validación con coverage (90%)
npm run validate:coverage:strict # 📈 Validación con coverage (umbrales configurados)
npm run validate:coverage:100 # 📈 Validación con coverage (100% - aspiración máxima)
npm run validate:staged:strict # 🔒 Validación staged estricta (pre-commit)
npm run validate:full:strict # 🔒 Validación completa estricta (pre-push)
npm run type-check     # 🔍 Verificación de tipos
npm run lint           # 🧹 Linting y auto-fix
npm run format         # ✨ Formateo de código
```

### **🏗️ Scripts de Build**

```bash
npm run build          # 🏗️ Build de producción
npm run build:dev      # 🔧 Build de desarrollo
```

---

## 🛡️ **ESTRATEGIA DE VALIDACIÓN Y CALIDAD**

### **Pre-commit (Archivos Staged)**

```bash
npm run validate:staged:strict
```

- ✅ **Formato**: Prettier en archivos staged
- ✅ **Type-check**: TypeScript en archivos staged
- ✅ **ESLint**: Linting estricto con auto-fix
- ✅ **Tests rápidos**: Solo archivos modificados
- ✅ **Cobertura global**: Verificación según umbrales configurados
- ⏱️ **Tiempo**: ~5-6 segundos

### **Pre-push (Proyecto Completo)**

```bash
npm run validate:full:strict
```

- ✅ **Formato**: Prettier en todo el proyecto
- ✅ **Type-check**: TypeScript completo
- ✅ **ESLint**: Linting estricto sin auto-fix
- ✅ **Tests completos**: Con cobertura según umbrales configurados
- ✅ **Tests E2E**: Validación end-to-end
- ⏱️ **Tiempo**: ~8-10 segundos

### **📊 Umbrales de Cobertura (Fuente de Verdad)**

Los umbrales de cobertura están configurados en `jest.config.js` y son la **fuente de verdad** para las validaciones:

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

**Scripts disponibles:**

- `npm run validate:coverage:strict` - Usa umbrales configurados
- `npm run validate:coverage:100` - Aspiración al 100% (validación especial)

### **🎯 Beneficios de esta Estrategia**

- **Velocidad**: Pre-commit rápido, pre-push completo
- **Calidad**: Cobertura según umbrales garantizada
- **Seguridad**: Bloqueo de commits/push con errores
- **Consistencia**: Mismos estándares en todo el equipo
- **Flexibilidad**: Umbrales configurables según necesidades del proyecto

---

## 🚀 **SCRIPTS DE INICIO**

### **Inicio de Desarrollo (Recomendado)**

```bash
npm run start:dev
```

- **Descripción**: Inicia la aplicación con hot reload y watch
- **Tiempo**: ~3-4 segundos
- **Uso**: Para desarrollo continuo (recomendado por la comunidad y documentación oficial de NestJS)

### **Inicio de Producción**

```bash
npm run start:prod
```

- **Descripción**: Inicia la aplicación desde el build de producción
- **Tiempo**: ~1-2 segundos
- **Uso**: Para pruebas de producción local

---

## 🧪 **SCRIPTS DE TESTING**

### **Tests Rápidos**

```bash
npm run test:quick
```

- **Descripción**: Ejecuta tests unitarios sin coverage
- **Tiempo**: ~2-3 segundos
- **Uso**: Para validaciones rápidas en pre-commit

### **Tests Completos**

```bash
npm run test:full
```

- **Descripción**: Ejecuta tests unitarios con coverage completo
- **Tiempo**: ~4-5 segundos
- **Uso**: Para validaciones completas en pre-push

### **Tests E2E**

```bash
npm run test:e2e:quick  # Rápidos
npm run test:e2e:full   # Completos
```

- **Descripción**: Ejecuta tests end-to-end
- **Tiempo**: ~2-3 segundos (quick) / ~5-6 segundos (full)
- **Uso**: Para validar integración completa

---

## 🔧 **SCRIPTS DE ENTORNO**

### **Configuración de Entornos**

```bash
npm run setup:env
```

- **Descripción**: Crea archivos de entorno desde ejemplos
- **Archivos creados**: `.env`, `.env.development`, `.env.test`
- **Estrategia**: `.env` = producción, archivos específicos = sobrescrituras

### **Información de Entorno**

```bash
npm run env:info       # Entorno actual
npm run env:dev        # Verificar desarrollo
npm run env:test       # Verificar testing
npm run env:prod       # Verificar producción
```

### **Estructura de Archivos de Entorno**

```
.env                    # Variables base para PRODUCCIÓN
.env.development        # Sobrescribe variables para desarrollo
.env.test              # Sobrescribe variables para testing
```

### **Puertos por Entorno**

- **Producción**: 4000 (definido en .env)
- **Desarrollo**: 4000 (heredado de .env)
- **Testing**: 4001 (sobrescrito en .env.test)

---

## 🗄️ **SCRIPTS DE BASE DE DATOS**

### **Operaciones Básicas**

```bash
npm run db:generate    # Genera cliente Prisma
npm run db:push        # Sincroniza esquema con DB
npm run db:migrate     # Crea y aplica migraciones
npm run db:studio      # Abre interfaz visual de Prisma
```

### **Operaciones por Entorno**

```bash
npm run db:dev         # Sincroniza DB desarrollo
npm run db:test        # Sincroniza DB testing
npm run db:prod        # Sincroniza DB producción
```

### **Prisma Studio por Entorno**

```bash
npm run db:studio:dev  # Studio para desarrollo
npm run db:studio:test # Studio para testing
npm run db:studio:prod # Studio para producción
```

---

## 🔍 **SCRIPTS DE VALIDACIÓN**

### **Validación Rápida**

```bash
npm run validate:quick
```

- **Secuencia**: format → type-check → lint
- **Tiempo**: ~3-4 segundos
- **Uso**: Pre-commit hooks

### **Validación Completa**

```bash
npm run validate:full
```

- **Secuencia**: format → type-check → lint → test:full → test:e2e:full
- **Tiempo**: ~15-20 segundos
- **Uso**: Pre-push hooks

### **Validación de Coverage**

```bash
npm run validate:coverage
```

- **Descripción**: Valida que el coverage esté por encima del umbral
- **Umbral**: 100% (statements, branches, functions, lines)
- **Uso**: CI/CD pipelines

---

## 🏗️ **SCRIPTS DE BUILD**

### **Build de Producción**

```bash
npm run build
```

- **Descripción**: Compila la aplicación para producción
- **Tiempo**: ~2-3 segundos
- **Output**: `dist/` directory

### **Build de Desarrollo**

```bash
npm run build:dev
```

- **Descripción**: Compila la aplicación para desarrollo
- **Tiempo**: ~1-2 segundos
- **Output**: `dist/` directory con source maps

---

## 🔄 **HOOKS DE GIT**

### **Pre-commit**

```bash
npm run validate:staged:light
```

- **Descripción**: Valida archivos staged antes del commit
- **Incluye**: format, type-check, lint, test:quick
- **Tiempo**: ~4-5 segundos

### **Pre-push**

```bash
npm run validate:full
```

- **Descripción**: Valida todo el proyecto antes del push
- **Incluye**: format, type-check, lint, test:full, test:e2e:full
- **Tiempo**: ~15-20 segundos

---

## 📊 **MÉTRICAS DE PERFORMANCE**

### **Tiempos Promedio**

- **Inicio rápido**: 2-3s
- **Inicio completo**: 3-4s
- **Tests rápidos**: 2-3s
- **Tests completos**: 4-5s
- **E2E tests**: 2-6s
- **Validación rápida**: 3-4s
- **Validación completa**: 15-20s
- **Build**: 2-3s

### **Optimizaciones Implementadas**

- **SWC**: Compilador rápido para TypeScript
- **Jest**: Configuración optimizada con maxWorkers
- **ESLint**: Cache habilitado
- **Prettier**: Cache habilitado
- **Prisma**: Generación optimizada

---

## 🛠️ **CONFIGURACIÓN AVANZADA**

### **Variables de Entorno**

```bash
NODE_ENV=development|test|production
PORT=4000|4001
DATABASE_URL=postgresql://...
JWT_SECRET=...
```

### **Archivos de Configuración**

- `jest.config.js` - Configuración de Jest
- `eslint.config.mjs` - Configuración de ESLint
- `tsconfig.json` - Configuración de TypeScript
- `nest-cli.json` - Configuración de NestJS

### **Scripts Personalizados**

- `scripts/timed-run.js` - Medición de tiempo de ejecución
- `scripts/setup-env.js` - Configuración de entornos
- `scripts/test-environments.js` - Prueba de entornos
- `scripts/check-process-env.js` - Validación de process.env

---

## 🚨 **TROUBLESHOOTING**

### **Problemas Comunes**

#### **Error: Port already in use**

```bash
# Solución: Cambiar puerto en .env
PORT=4001
```

#### **Error: Database connection failed**

```bash
# Solución: Verificar DATABASE_URL en .env correspondiente
npm run db:dev    # Para desarrollo
npm run db:test   # Para testing
```

#### **Error: Environment validation failed**

```bash
# Solución: Verificar variables de entorno
npm run env:info
npm run setup:env
```

#### **Error: Tests failing**

```bash
# Solución: Ejecutar tests individualmente
npm run test:quick
npm run test:full
```

---

## 📚 **REFERENCIAS**

- [NestJS CLI](https://docs.nestjs.com/cli/overview)
- [Jest Configuration](https://jestjs.io/docs/configuration)
- [ESLint Configuration](https://eslint.org/docs/user-guide/configuring)
- [Prisma CLI](https://www.prisma.io/docs/reference/api-reference/command-reference)
- [Cross-env](https://www.npmjs.com/package/cross-env)

---

**Última actualización**: Julio 2024
**Versión**: 2.0.0
