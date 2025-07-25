# Scripts y Comandos - KM0 Market Backend

## 📋 **RESUMEN DE SCRIPTS DISPONIBLES**

### **🚀 Scripts de Inicio**

```bash
npm run start:quick    # 🚀 Inicio rápido sin watch
npm run start:full     # 🔄 Inicio completo con watch
npm run start:prod     # 🏭 Inicio de producción
```

### **🧪 Scripts de Testing**

```bash
npm run test:quick     # ⚡ Tests rápidos sin coverage
npm run test:full      # 📊 Tests completos con coverage
npm run test:watch     # 👀 Tests en modo watch
npm run test:debug     # 🐛 Tests en modo debug
npm run test:e2e:quick # ⚡ E2E tests rápidos
npm run test:e2e:full  # 📊 E2E tests completos
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
npm run validate:coverage # 📈 Validación con coverage
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

## 🚀 **SCRIPTS DE INICIO**

### **Inicio Rápido**

```bash
npm run start:quick
```

- **Descripción**: Inicia la aplicación en modo desarrollo sin watch
- **Tiempo**: ~2-3 segundos
- **Uso**: Para pruebas rápidas y desarrollo

### **Inicio Completo**

```bash
npm run start:full
```

- **Descripción**: Inicia la aplicación con hot reload y watch
- **Tiempo**: ~3-4 segundos
- **Uso**: Para desarrollo continuo

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
npm run validate:staged
```

- **Descripción**: Valida archivos staged antes del commit
- **Incluye**: format, type-check, lint, test:quick
- **Tiempo**: ~5-6 segundos

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
