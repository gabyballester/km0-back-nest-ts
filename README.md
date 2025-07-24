# KM0 Market Backend

Backend API para KM0 Market construido con NestJS, optimizado para velocidad máxima, calidad y cobertura de código garantizada.

## 🚀 Características

- **⚡ Velocidad**: SWC para compilación ~30% más rápida
- **📊 Cobertura**: 100% en todas las métricas de testing
- **🔒 Calidad**: Pre-commit hooks que bloquean commits sin cobertura suficiente
- **🛡️ TypeScript**: Tipado estricto sin `any`
- **🧪 Testing**: Jest con SWC y umbrales estrictos
- **📝 Linting**: ESLint + Prettier con reglas estrictas
- **🔧 Automatización**: Husky + lint-staged + commitlint

## 📋 Prerrequisitos

- Node.js 18+
- npm 9+
- Git

## 🛠️ Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd backend

# Instalar dependencias
npm install

# Verificar configuración
npm run lint
npm run test:cov
```

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

## 📊 Métricas Actuales

```
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |
 app.controller.ts |     100 |      100 |     100 |     100 |
 app.module.ts     |     100 |      100 |     100 |     100 |
 app.service.ts    |     100 |      100 |     100 |     100 |
-------------------|---------|----------|---------|---------|-------------------
```

## 🔧 Scripts de Desarrollo

```bash
# Desarrollo
npm run start:dev              # Servidor con SWC y watch optimizado
npm run build                  # Build con SWC sin typeCheck

# Calidad de código
npm run lint                   # ESLint con cache
npm run format                 # Prettier con cache

# Testing
npm run test:cov              # Tests con cobertura optimizada
npm run test:watch            # Tests en modo watch optimizado
npm run test:debug            # Tests con debugger
```

## 🔒 Pre-commit Hooks

Los hooks se ejecutan automáticamente en cada commit:

- ✅ **Tests con cobertura** (`npm run test:cov`)
- ✅ **Linting y formateo** (`npx lint-staged`)
- ✅ **Validación de mensajes** (Conventional Commits)

## 📝 Convenciones de Código

### TypeScript

- **Tipado estricto**: No usar `any`
- **Tipos explícitos**: En todas las funciones
- **Interfaces**: Para contratos de servicios

### NestJS

- **Logger**: Usar `Logger` de NestJS (no `console`)
- **Dependency Injection**: Usar interfaces, no clases concretas
- **Decorators**: Seguir convenciones de NestJS

### Commits

```bash
# Formato: type(scope): description
git commit -m "feat(auth): add JWT authentication"
git commit -m "fix(api): resolve user validation bug"
git commit -m "test(service): add comprehensive unit tests"
```

## 🏗️ Arquitectura

```
src/
├── modules/           # Módulos de la aplicación
├── common/           # Utilidades compartidas
├── config/           # Configuraciones
├── types/            # Tipos TypeScript
└── main.ts          # Punto de entrada
```

## 🚀 Despliegue

### Desarrollo

```bash
npm run start:dev
```

### Producción

```bash
npm run build:prod
npm run start:prod
```

## 📚 Documentación

- [Guía de Testing](./docs/TESTING.md) - Configuración completa de testing
- [Guía de Contribución](./docs/CONTRIBUTING.md) - Flujo de desarrollo
- [NestJS Documentation](https://docs.nestjs.com/) - Framework oficial

## 🔍 Troubleshooting

### Problemas Comunes

1. **Hooks no funcionan**

   ```bash
   npm run prepare
   ```

2. **Tests lentos**

   ```bash
   npm run test
   ```

3. **Cobertura baja**

   ```bash
   npm run test:cov
   ```

4. **Linting errors**

   ```bash
   npm run lint
   ```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Ver [CONTRIBUTING.md](./docs/CONTRIBUTING.md) para detalles completos.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Documentación**: [docs/](./docs/)
- **NestJS**: [Documentación oficial](https://docs.nestjs.com/)

---

**Desarrollado con ❤️ usando NestJS, TypeScript y SWC**
