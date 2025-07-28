# Alias de Importación

Este documento describe los alias de importación configurados en el proyecto para evitar rutas relativas y mejorar la legibilidad del código.

## Configuración

Los alias están configurados en los siguientes archivos:

- `tsconfig.json` - Configuración principal de TypeScript
- `tsconfig.build.json` - Configuración para builds de producción
- `jest.config.js` - Configuración para tests unitarios
- `test/jest-e2e.json` - Configuración para tests E2E

## Alias Disponibles

| Alias                | Ruta                   | Descripción                                    |
| -------------------- | ---------------------- | ---------------------------------------------- |
| `@/*`                | `src/*`                | Ruta base para todos los archivos del proyecto |
| `@/config/*`         | `src/config/*`         | Configuraciones del proyecto                   |
| `@/shared/*`         | `src/shared/*`         | Utilidades y constantes compartidas            |
| `@/modules/*`        | `src/modules/*`        | Módulos de la aplicación                       |
| `@/infrastructure/*` | `src/infrastructure/*` | Capa de infraestructura                        |
| `@/health/*`         | `src/health/*`         | Endpoints de salud                             |
| `@/test/*`           | `test/*`               | Archivos de testing                            |
| `@/docs/*`           | `docs/*`               | Documentación                                  |
| `@/scripts/*`        | `scripts/*`            | Scripts de utilidad                            |

## Ejemplos de Uso

### Antes (Rutas Relativas)

```typescript
import { UserService } from '../../application/services/user.service';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
import { ENV_VALUES } from '../../../shared/constants/environment';
```

### Después (Con Alias)

```typescript
import { UserService } from '@/modules/users/application/services/user.service';
import { UserRepository } from '@/modules/users/infrastructure/repositories/user.repository';
import { ENV_VALUES } from '@/shared/constants/environment';
```

## Ventajas

1. **Legibilidad**: Las rutas son más claras y fáciles de entender
2. **Mantenibilidad**: Al mover archivos, solo hay que actualizar el alias, no todas las rutas relativas
3. **Consistencia**: Todas las importaciones siguen el mismo patrón
4. **IDE Support**: Mejor autocompletado y navegación en IDEs
5. **Refactoring**: Más fácil refactorizar y reorganizar código

## Scripts Disponibles

### Actualizar Imports Automáticamente

```bash
npm run update:imports
```

Este script actualiza automáticamente todos los imports relativos a alias en el proyecto.

### Verificar Tipos

```bash
npm run type-check
```

Verifica que todos los alias estén configurados correctamente.

## Convenciones

1. **Siempre usar alias**: Evitar rutas relativas en favor de alias
2. **Usar el alias más específico**: Preferir `@/modules/users/` sobre `@/` cuando sea posible
3. **Consistencia**: Usar el mismo alias para el mismo tipo de archivo
4. **Documentación**: Actualizar este documento cuando se agreguen nuevos alias

## Troubleshooting

### Error: Cannot find module

Si aparece un error de "Cannot find module", verificar:

1. Que el alias esté configurado en `tsconfig.json`
2. Que la ruta del archivo sea correcta
3. Que el archivo exista en la ubicación especificada

### Error en Tests

Si los tests fallan con errores de importación:

1. Verificar que `jest.config.js` tenga la configuración de `moduleNameMapper`
2. Verificar que `test/jest-e2e.json` tenga la configuración para tests E2E

### Error en Build

Si el build falla:

1. Verificar que `tsconfig.build.json` tenga los alias configurados
2. Verificar que no haya imports circulares

## Mantenimiento

- Revisar periódicamente que todos los imports usen alias
- Actualizar este documento cuando se agreguen nuevos alias
- Ejecutar `npm run update:imports` después de reorganizar archivos
- Verificar que `npm run type-check` pase sin errores
