# Changelog - KM0 Market Backend

## [0.1.0] - 2024-01-XX

### 🚀 **NUEVO: Scripts Rápidos - Regla Obligatoria**

#### ✅ Implementado

- **Scripts rápidos optimizados** para desarrollo diario
- **Documentación completa** en `/docs/SCRIPTS.md`
- **Reglas obligatorias** en `/docs/RULES.md`
- **README actualizado** con reglas prioritarias

#### ⚡ Performance Mejorada

- **Tests rápidos**: ~2s (antes: ~3.5s)
- **Linting**: ~1s (con cache)
- **Formateo**: ~0.5s
- **Startup**: ~2s

#### 📋 Scripts Disponibles

**🏃‍♂️ Scripts Rápidos (OBLIGATORIOS para desarrollo):**

```bash
npm run test:fast      # Tests unitarios sin cobertura (~2s)
npm run test:e2e:fast  # Tests e2e optimizados (~3s)
npm run lint           # ESLint + Prettier con cache (~1s)
npm run format         # Solo Prettier (~0.5s)
npm run start:dev      # Servidor desarrollo con hot reload
```

**🐌 Scripts Lentos (Solo CI/CD):**

```bash
npm run test:cov       # Tests con cobertura completa (~2.8s)
npm run test:e2e       # Tests e2e completos (~5s)
npm run build          # Build de producción
```

#### 🚨 Reglas Estrictas Implementadas

**✅ OBLIGATORIO en desarrollo:**

1. **SIEMPRE usar `npm run test:fast`** para verificar cambios
2. **SIEMPRE usar `npm run lint`** antes de commits
3. **NUNCA usar `npm run test:cov`** en desarrollo diario
4. **Mantener flujo de trabajo rápido** y eficiente

**❌ PROHIBIDO en desarrollo:**

1. `npm run test:cov` (lento, innecesario)
2. `npm run test:e2e` (lento, innecesario)
3. `npm run test:debug` (muy lento, solo debugging)

### 🔒 **NUEVO: Regla Estricta - process.env PROHIBIDO**

#### ✅ Implementado

- **Regla estricta**: `process.env` SOLO permitido en `src/config/env.config.ts`
- **Script de verificación**: `npm run check:process-env`
- **Verificación automática**: Incluido en pre-commit hooks
- **Documentación actualizada**: Reglas claras en `/docs/RULES.md` y `/docs/TESTING.md`

#### 🚨 Regla Estricta Implementada

**✅ PERMITIDO solo en:**

- `src/config/env.config.ts` (archivo de configuración)

**❌ PROHIBIDO en:**

- Cualquier otro archivo de la aplicación
- Tests (usar ConfigService)
- Cualquier manipulación de variables de entorno globales

#### 🔧 Script de Verificación

```bash
npm run check:process-env  # Verificar uso correcto de process.env
```

**Funcionalidades:**

- Escanea automáticamente todos los archivos `.ts` y `.js`
- Excluye el archivo permitido (`env.config.ts`)
- Reporta violaciones con línea exacta y contenido
- Se ejecuta automáticamente en pre-commit

#### 📚 Documentación Creada

- **[docs/SCRIPTS.md](./SCRIPTS.md)**: Guía completa de scripts rápidos
- **[docs/RULES.md](./RULES.md)**: Reglas obligatorias del proyecto
- **README.md actualizado**: Reglas prioritarias en la parte superior

#### 🔧 Configuración Optimizada

**Jest (test:fast):**

```json
{
  "maxWorkers": 4, // Paralelización máxima
  "bail": true, // Parar en primer error
  "passWithNoTests": true, // No fallar si no hay tests
  "silent": true, // Output mínimo
  "no-coverage": true // Sin cobertura (más rápido)
}
```

**ESLint (lint):**

```json
{
  "--fix": true, // Corregir automáticamente
  "--cache": true, // Cache para velocidad
  "--max-warnings": 0 // Cero warnings
}
```

#### 🎯 Beneficios Logrados

**⚡ Velocidad:**

- **Desarrollo 3x más rápido**
- **Feedback inmediato**
- **Menos tiempo de espera**

**🎯 Productividad:**

- **Flujo de trabajo fluido**
- **Menos interrupciones**
- **Desarrollo más eficiente**

**🛡️ Calidad:**

- **Tests automáticos en cada commit**
- **Linting automático**
- **Formato consistente**

#### 📊 Métricas Finales

- **Tests rápidos**: 71 tests en ~2s
- **Cobertura**: 82.08% statements, 80% functions
- **Linting**: 0 warnings, 0 errors
- **Performance**: Optimizada en todos los scripts

#### 🔄 Flujo de Desarrollo Establecido

**Antes de cada commit:**

1. `npm run test:fast` ✅
2. `npm run lint` ✅
3. `npm run format` ✅
4. Commit ✅

**Pre-push (automático):**

1. `npm run test:cov` ✅
2. `npm run test:e2e` ✅

#### 🚀 Próximos Pasos

1. **Adoptar reglas** por todo el equipo
2. **Monitorear performance** de scripts
3. **Optimizar más** si es necesario
4. **Expandir documentación** según necesidades

---

**Esta implementación establece las bases para un desarrollo rápido, eficiente y de alta calidad.**

## [Unreleased]

### Added

- Cobertura global 100% (statements, branches, functions, lines) en todos los archivos relevantes.
- Exclusión justificada de archivos puramente declarativos (ej: security.module.ts) de la cobertura.
- Documentación Swagger mejorada para endpoints de health.
- Actualización de docs/TESTING.md, README.md y SUMMARY.md para reflejar el estado real del proyecto.
