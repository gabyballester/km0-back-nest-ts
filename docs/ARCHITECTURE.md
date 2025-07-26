# Arquitectura del Proyecto

## Estructura de Carpetas

```
backend/
├── src/                    # Código fuente principal
│   ├── config/            # Configuración de la aplicación
│   ├── health/            # Endpoints de salud
│   ├── infrastructure/    # Capa de infraestructura
│   ├── modules/           # Módulos de la aplicación
│   └── shared/            # Utilidades compartidas
├── test/                  # Tests end-to-end
├── prisma/                # Configuración de base de datos
├── docs/                  # Documentación del proyecto
├── scripts/               # Scripts de utilidad
├── legacy/                # ⚠️ SOLO CONSULTA - Código legacy de referencia
└── dist/                  # Archivos compilados (generado)
```

## Carpeta Legacy

La carpeta `legacy/` contiene código de proyectos anteriores y ejemplos de referencia. **Esta carpeta está completamente excluida de todas las herramientas de desarrollo**:

- **Jest**: Excluida en `testPathIgnorePatterns` y `modulePathIgnorePatterns`
- **TypeScript**: Excluida en `tsconfig.json` y `tsconfig.build.json`
- **ESLint**: Excluida en `.eslintignore`
- **Prettier**: Excluida en `.prettierignore`
- **Git**: No se ignora para mantener el historial de referencia

### Propósito

- Consulta de patrones y soluciones implementadas anteriormente
- Referencia de arquitecturas y configuraciones
- Ejemplos de integración con diferentes tecnologías

### Uso

- **Solo consulta manual**: No se ejecuta, valida ni compila
- **No modificar**: Mantener como referencia histórica
- **No referenciar**: No importar código de legacy en el proyecto principal

## Configuración de Herramientas

### TypeScript

- **Target**: ES2023 (compatible con Node.js 22+)
- **Module Resolution**: Node16
- **Strict Mode**: Habilitado completamente
- **Exclusiones**: `node_modules`, `dist`, `legacy`

### Jest

- **Framework**: Jest con SWC para velocidad
- **Coverage**: 100% en archivos con lógica de negocio
- **Exclusiones**: Constantes, schemas, módulos declarativos
- **Performance**: Cache habilitado, workers optimizados

### ESLint

- **Configuración**: TypeScript + NestJS rules
- **Strict**: `max-warnings=0`
- **Exclusiones**: `node_modules`, `dist`, `legacy`, `generated`

### Prettier

- **Configuración**: Estándar de la comunidad
- **Exclusiones**: Archivos generados y legacy

## Arquitectura Hexagonal

El proyecto sigue la arquitectura hexagonal (puertos y adaptadores):

```
└── src/
    ├── modules/           # Capa de aplicación (casos de uso)
    ├── infrastructure/    # Capa de infraestructura (adaptadores)
    └── shared/            # Utilidades y constantes compartidas
```

### Principios

- **Separación de responsabilidades**: Cada capa tiene un propósito específico
- **Inversión de dependencias**: Las dependencias apuntan hacia el dominio
- **Testabilidad**: Cada componente es testeable de forma aislada
- **Mantenibilidad**: Código limpio y bien documentado

## Validación y Calidad

### Pre-commit Hook

- Formateo con Prettier
- Linting con ESLint (solo archivos staged)
- Validación rápida de tipos

### Pre-push Hook

- Validación completa de tipos
- Linting completo del proyecto
- Tests unitarios e integración
- Validación de cobertura

### Cobertura de Tests

- **Objetivo**: 100% en archivos con lógica de negocio
- **Exclusiones**: Constantes, schemas, módulos declarativos
- **Umbrales**: 80% branches, 90% functions/lines/statements

## Configuración de Entorno

### Variables de Entorno

- **Desarrollo**: `env.development.example`
- **Test**: `env.test.example`
- **Producción**: `env.example`
- **Validación**: Zod schemas en `src/config/env.schema.ts`

### Seguridad

- **Validación**: Todas las variables validadas con Zod
- **Tipado**: ConfigService con tipos estrictos
- **Documentación**: Variables documentadas en `/docs/ENVIRONMENT.md`

## Base de Datos

### Prisma ORM

- **Schema**: `prisma/schema.prisma`
- **Migrations**: Generadas automáticamente
- **Client**: Generado en `node_modules/.prisma/client`
- **Studio**: Interfaz visual para desarrollo

### Configuración

- **Desarrollo**: SQLite para desarrollo local
- **Test**: SQLite en memoria
- **Producción**: PostgreSQL (configurable)

## Deployment

### Plataforma

- **Render**: Configuración en `render.yaml`
- **Build**: Automático con validaciones
- **Health Checks**: Endpoints de salud configurados

### Variables de Producción

- **Base de datos**: PostgreSQL con SSL
- **Seguridad**: Headers de seguridad configurados
- **Logging**: Configuración de logs estructurados
