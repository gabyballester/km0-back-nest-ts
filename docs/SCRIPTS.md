# Scripts del Proyecto - KM0 Market Backend

## 🚀 **SCRIPTS PRINCIPALES**

### ⚡ **Desarrollo**

```bash
npm run dev            # 🚀 Desarrollo con hot reload
npm run dev:debug      # 🐛 Inicio con debug mode
```

### ⚡ **Testing Rápido**

```bash
npm run test:quick     # 🚀 Tests rápidos sin coverage (~3.5s)
npm run test:full      # 📊 Tests completos con coverage (~7s)
npm run test:watch     # 👀 Tests en modo watch
npm run test:debug     # 🐛 Tests con debug mode
```

### ⚡ **E2E Testing Rápido**

```bash
npm run test:e2e:quick # 🚀 E2E tests rápidos (~3s)
npm run test:e2e:full  # 📊 E2E tests completos
```

### ⚡ **Inicio Rápido**

```bash
npm run start:quick    # 🚀 Inicio rápido sin watch
npm run start:full     # 🔄 Inicio completo con watch
npm run start:prod     # 🏭 Inicio de producción
```

## 🛠️ **SCRIPTS DE UTILIDAD**

### 🔧 **Formateo y Linting**

```bash
npm run format         # ✨ Formatear código
npm run format:check   # ✅ Verificar formato
npm run lint           # 🔍 Linting con auto-fix
```

### 🌍 **Entornos**

```bash
npm run env:info       # ℹ️ Ver entorno actual
npm run env:dev        # 🔧 Verificar entorno desarrollo
npm run env:test       # 🧪 Verificar entorno testing
npm run env:prod       # 🏭 Verificar entorno producción
npm run test:environments # 🧪 Probar todos los entornos
```

### 🗄️ **Base de Datos**

```bash
npm run db:generate    # 🔧 Generar cliente Prisma
npm run db:push        # 📤 Sincronizar esquema
npm run db:migrate     # 🔄 Crear migración
npm run db:studio      # 🖥️ Abrir Prisma Studio
```

### 🗄️ **Base de Datos por Entorno**

```bash
npm run db:dev         # 🔧 DB desarrollo
npm run db:test        # 🧪 DB testing
npm run db:prod        # 🏭 DB producción
npm run db:studio:dev  # 🖥️ Studio desarrollo
npm run db:studio:test # 🖥️ Studio testing
npm run db:studio:prod # 🖥️ Studio producción
```

## 🚀 **SCRIPTS DE DEPLOYMENT**

### ☁️ **Plataformas**

```bash
npm run deploy:railway # 🚂 Deploy a Railway
npm run deploy:render  # 🎨 Deploy a Render
npm run deploy:vercel  # ⚡ Deploy a Vercel
```

### 🔧 **Build**

```bash
npm run build          # 🔨 Build normal
npm run build:prod     # 🏭 Build optimizado para producción
```

## 🛡️ **SCRIPTS DE VERIFICACIÓN**

### ✅ **Checks**

```bash
npm run check:process-env  # 🔍 Verificar uso de process.env
npm run check:deployment   # 🚀 Verificar configuración de deployment
```

### 🔧 **Setup**

```bash
npm run setup:env      # 🔧 Configurar archivos de entorno
npm run env:setup      # 📋 Copiar env.mirror a .env
npm run env:example    # 📋 Copiar env.example a .env
```

## 📊 **COMPARACIÓN DE VELOCIDAD**

### ⚡ **Scripts Rápidos (Desarrollo diario)**

| Script           | Tiempo | Uso                       |
| ---------------- | ------ | ------------------------- |
| `dev`            | ~3s    | Desarrollo con hot reload |
| `test:quick`     | ~3.5s  | Tests sin coverage        |
| `test:e2e:quick` | ~3s    | E2E tests rápidos         |

### 🐌 **Scripts Completos (CI/CD)**

| Script          | Tiempo | Uso                   |
| --------------- | ------ | --------------------- |
| `dev:full`      | ~5s    | Inicio con hot reload |
| `test:full`     | ~7s    | Tests con coverage    |
| `test:e2e:full` | ~15s   | E2E tests completos   |

## 🎯 **FLUJO DE TRABAJO RECOMENDADO**

### 🚀 **Desarrollo Diario**

```bash
# 1. Desarrollo con hot reload
npm run dev

# 2. Tests rápidos antes de commit
npm run test:quick

# 3. Linting y formateo
npm run lint
npm run format
```

### 🏭 **Antes de Deploy**

```bash
# 1. Tests completos
npm run test:full

# 2. Build de producción
npm run build:prod

# 3. Deploy
npm run deploy:railway
```

## 🎯 **SISTEMA DE VALIDACIÓN EN DOS FASES**

### 📋 **Estrategia de Validación Automática**

El proyecto implementa un sistema de validación en dos fases para garantizar la calidad del código:

#### ⚡ **Fase 1: Validación Rápida (Pre-commit)**

```bash
npm run validate:quick    # ~6.4s - Validación rápida para commits
```

**¿Qué ejecuta?**

- ✅ **Format** - Prettier (cached)
- ✅ **Lint** - ESLint con cache
- ✅ **Tests Unitarios Rápidos** - Sin coverage (~3.8s)
- ✅ **Tests E2E Rápidos** - Timeout reducido (~2.6s)

**¿Cuándo se ejecuta?**

- Automáticamente en cada `git commit`
- En `lint-staged` para archivos modificados
- Si falla → **STOP** (no continúa el commit)

#### 📊 **Fase 2: Validación Completa (Pre-push)**

```bash
npm run validate:full     # ~10.8s - Validación completa para push
```

**¿Qué ejecuta?**

- ✅ **Format** - Prettier (cached)
- ✅ **Lint** - ESLint con cache
- ✅ **Tests Unitarios Completos** - Con coverage (~4.3s)
- ✅ **Tests E2E Completos** - Sin timeout reducido (~2.45s)

**¿Cuándo se ejecuta?**

- Automáticamente en cada `git push`
- Si falla → **STOP** (no continúa el push)

### 🔧 **Scripts de Validación Disponibles**

| Script              | Tiempo | Propósito               | Uso        |
| ------------------- | ------ | ----------------------- | ---------- |
| `validate:quick`    | ~6.4s  | Validación rápida       | Pre-commit |
| `validate:full`     | ~10.8s | Validación completa     | Pre-push   |
| `validate:coverage` | ~4.3s  | Solo tests con coverage | Manual     |

### 🎯 **Umbrales de Cobertura**

```javascript
coverageThreshold: {
  global: {
    branches: 60,    // 60% de cobertura de ramas
    functions: 70,   // 70% de cobertura de funciones
    lines: 70,       // 70% de cobertura de líneas
    statements: 70,  // 70% de cobertura de statements
  },
}
```

### 🚀 **Flujo de Trabajo Recomendado**

#### **Para desarrollo diario:**

```bash
# 1. Hacer cambios en el código
# 2. Commit automático con validación rápida
git add .
git commit -m "feat: nueva funcionalidad"

# 3. Push automático con validación completa
git push origin feature/nueva-funcionalidad
```

#### **Para verificación manual:**

```bash
# Validación rápida (como pre-commit)
npm run validate:quick

# Validación completa (como pre-push)
npm run validate:full

# Solo verificar cobertura
npm run validate:coverage
```

### ⚠️ **Archivos Excluidos de Cobertura**

Los siguientes archivos están excluidos del cálculo de cobertura:

- `main.ts` - Punto de entrada
- `env.config.ts` - Configuración de entorno
- `env.schema.ts` - Esquemas de validación
- `env.constants.ts` - Constantes de entorno
- `security.module.ts` - Módulo de seguridad
- `environment-logger.ts` - Logger de entorno

### 🔍 **Configuración de Hooks**

Los hooks de Git están configurados en `.husky/`:

#### **Pre-commit Hook:**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
npm run pre-commit
```

#### **Pre-push Hook:**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run pre-push
```

### 📈 **Beneficios del Sistema**

1. **⚡ Velocidad**: Validación rápida en commits (~6.4s)
2. **🛡️ Seguridad**: Validación completa en push (~10.8s)
3. **🎯 Calidad**: Cobertura garantizada >70%
4. **🔄 Automatización**: Sin intervención manual
5. **🚫 Prevención**: Bloquea commits/push con errores

## 🔍 **TROUBLESHOOTING**

### ❌ **Error: cross-env not found**

```bash
npm install --save-dev cross-env
```

### ❌ **Error: Variables de entorno faltantes**

```bash
npm run setup:env
npm run env:setup
```

### ❌ **Error: Base de datos no conecta**

```bash
npm run db:dev    # Para desarrollo
npm run db:test   # Para testing
```

## 📚 **REFERENCIAS**

- [NestJS CLI](https://docs.nestjs.com/cli/overview)
- [Jest Testing](https://jestjs.io/docs/getting-started)
- [Prisma CLI](https://www.prisma.io/docs/reference/api-reference/command-reference)
- [Cross-env](https://www.npmjs.com/package/cross-env)

---

**Última actualización**: Enero 2024
**Versión**: 2.0.0
