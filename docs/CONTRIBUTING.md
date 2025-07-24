# Guía de Contribución

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm 9+
- Git

### Instalación

```bash
git clone <repository-url>
cd backend
npm install
```

## 📋 Flujo de Desarrollo

### 1. Configuración Inicial

```bash
# Instalar hooks de Git (automático con npm install)
npm run prepare

# Verificar configuración
npm run lint
npm run test:cov
```

### 2. Desarrollo Diario

```bash
# Tests optimizados durante desarrollo
npm run test

# Verificar calidad antes de commit
npm run lint
npm run test:cov
```

### 3. Pre-commit (Automático)

Los hooks se ejecutan automáticamente:

- ✅ Tests con cobertura
- ✅ Verificación de umbrales
- ✅ Linting y formateo
- ✅ Validación de mensajes de commit

## 🧪 Testing

### Scripts Optimizados

```bash
# Testing (Ultra-rápido)
npm run test                   # Tests unitarios optimizados
npm run test:cov              # Tests con cobertura optimizada
npm run test:watch            # Watch mode optimizado
npm run test:e2e              # Tests e2e optimizados
```

### Umbrales de Cobertura

- **Statements**: 75%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 75%

**⚠️ Los commits se bloquean automáticamente si no se cumplen estos umbrales.**

## 📝 Convenciones de Código

### TypeScript

- **Tipado estricto**: No usar `any`
- **Tipos explícitos**: En todas las funciones
- **Interfaces**: Para contratos de servicios
- **Enums**: Para valores constantes

### NestJS

- **Logger**: Usar `Logger` de NestJS (no `console`)
- **Decorators**: Seguir convenciones de NestJS
- **Dependency Injection**: Usar interfaces, no clases concretas
- **Guards/Interceptors**: Para validación y transformación

### Estructura de Archivos

```
src/
├── modules/           # Módulos de la aplicación
├── common/           # Utilidades compartidas
├── config/           # Configuraciones
├── types/            # Tipos TypeScript
└── main.ts          # Punto de entrada
```

## 🔧 Herramientas de Calidad

### ESLint

- **Configuración estricta** para TypeScript
- **Reglas específicas** para NestJS
- **Auto-fix** disponible con `npm run lint`

### Prettier

- **Formato automático** al guardar
- **Configuración consistente** en todo el proyecto
- **Integración** con ESLint

### Husky Hooks

```bash
# pre-commit
npm run test:cov
npx lint-staged

# pre-push
npm run test:cov

# commit-msg
npx commitlint --edit $1
```

## 📤 Proceso de Commit

### 1. Preparar Cambios

```bash
# Verificar estado
git status

# Añadir archivos
git add .

# Verificar calidad
npm run lint
npm run test:cov
```

### 2. Commit con Mensaje Convencional

```bash
# Formato: type(scope): description
git commit -m "feat(auth): add JWT authentication"

# Tipos disponibles:
# feat: nueva funcionalidad
# fix: corrección de bug
# docs: documentación
# style: formato (no afecta código)
# refactor: refactorización
# test: añadir tests
# chore: tareas de mantenimiento
```

### 3. Push (Automático)

```bash
git push origin feature/nombre-feature
```

## 🚫 Errores Comunes

### Cobertura Insuficiente

```bash
❌ Cobertura insuficiente en branches: 48.05% (mínimo requerido: 80%)

# Solución: Añadir más tests
npm run test:cov  # Ver qué falta cubrir
```

### ESLint Errors

```bash
❌ @typescript-eslint/no-explicit-any: 'any' is not allowed

# Solución: Usar tipos específicos
const data: UserData = response.data;  // ✅
const data: any = response.data;       // ❌
```

### Commit Rechazado

```bash
❌ Invalid commit message format

# Solución: Usar formato convencional
git commit -m "feat: add user authentication"  # ✅
git commit -m "added auth"                      # ❌
```

## 🔍 Debugging

### Tests

```bash
# Debug tests específicos
npm run test:debug

# Watch mode
npm run test:watch

# Tests específicos
npm test -- --testNamePattern="AppService"
```

### Linting

```bash
# Ver errores específicos
npm run lint -- --format=compact

# Auto-fix
npm run lint
```

### Cobertura

```bash
# Ver reporte detallado
npm run test:cov
```

## 📊 Métricas de Calidad

### Monitoreo Continuo

- **Cobertura**: Mínimo 75-80% en todas las métricas
- **Linting**: 0 errores, 0 warnings
- **Tests**: Todos pasando
- **Performance**: Tests < 2 segundos

### Reportes

```bash
# Generar reporte de cobertura
npm run test:cov

# Ver en navegador
open coverage/lcov-report/index.html
```

## 🤝 Pull Requests

### Checklist Antes de PR

- [ ] Tests pasando (`npm run test:cov`)
- [ ] Cobertura suficiente (verificación automática)
- [ ] Linting limpio (`npm run lint`)
- [ ] Documentación actualizada
- [ ] Mensajes de commit convencionales

### Template de PR

```markdown
## Descripción

Breve descripción de los cambios

## Tipo de Cambio

- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## Tests

- [ ] Tests unitarios añadidos/actualizados
- [ ] Tests de integración añadidos/actualizados
- [ ] Cobertura mantenida/mejorada

## Checklist

- [ ] Código sigue las convenciones del proyecto
- [ ] Documentación actualizada
- [ ] No hay warnings de linting
```

## 🆘 Soporte

### Problemas Comunes

1. **Hooks no funcionan**: `npm run prepare`
2. **Tests lentos**: Usar `npm run test`
3. **Cobertura baja**: Revisar `npm run test:cov`

### Recursos

- [Testing Guide](./TESTING.md)
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Última actualización**: $(date)
**Versión**: 2.0.0
**Mantenido por**: Equipo de desarrollo
