# Flujo de Trabajo con Ramas - KM0 Market Backend

## 🌿 **ESTRATEGIA DE RAMAS**

### **Ramas Principales**

- **`master`**: Rama de producción
  - Solo código validado y listo para despliegue
  - Siempre estable y funcional
  - Se mergea desde `develop` cuando está listo

- **`develop`**: Rama de desarrollo principal
  - Rama base para todas las features
  - Integración continua de funcionalidades
  - Validación automática en cada push

### **Ramas de Trabajo**

- **`fix/*`**: Ramas para correcciones
  - Ejemplo: `fix/update-coverage-documentation`
  - Para correcciones de bugs o documentación
  - Se mergean a `develop`

- **`feat/*`**: Ramas para nuevas funcionalidades
  - Ejemplo: `feat/user-authentication`
  - Para nuevas características
  - Se mergean a `develop`

- **`docs/*`**: Ramas para documentación
  - Ejemplo: `docs/api-documentation`
  - Para actualizaciones de documentación
  - Se mergean a `develop`

## 🚀 **FLUJO DE TRABAJO**

### **1. Crear Rama para Tarea**

#### **Opción A: Git Flow (Recomendado - Automatizado)**

```bash
# Asegurar que estamos en develop
git checkout develop
git pull origin develop

# Crear feature con Git Flow (automático)
git flow feature start nueva-funcionalidad

# O crear bugfix con Git Flow
git flow bugfix start correccion-bug
```

#### **Opción B: Git Nativo (Manual)**

```bash
# Asegurar que estamos en develop
git checkout develop
git pull origin develop

# Crear y cambiar a nueva rama desde develop
git checkout -b fix/nombre-de-la-tarea

# O para nuevas funcionalidades
git checkout -b feat/nueva-funcionalidad
```

### **2. Desarrollo en Rama**

```bash
# Hacer cambios en el código
# Ejecutar validaciones locales
npm run validate:staged:strict

# Commit con mensaje descriptivo
git commit -m "feat: implementar nueva funcionalidad

- ✅ Nueva funcionalidad implementada
- ✅ Tests agregados y pasando
- ✅ Documentación actualizada
- ✅ Validaciones completadas"
```

### **3. Validación Completa**

```bash
# Antes de hacer push, validar todo
npm run validate:full:strict

# Si todo está bien, hacer push
git push origin fix/nombre-de-la-tarea
```

### **4. Merge a Develop**

#### **Opción A: Git Flow (Recomendado - Automatizado)**

```bash
# Finalizar feature (merge automático a develop + rama preservada)
git flow feature finish nueva-funcionalidad

# O finalizar bugfix
git flow bugfix finish correccion-bug

# ✅ La rama feature/nueva-funcionalidad SE PRESERVA
# ✅ La rama bugfix/correccion-bug SE PRESERVA
```

#### **Opción B: Git Nativo (Manual)**

```bash
# Primero mergear a develop
git checkout develop
git merge fix/nombre-de-la-tarea

# O usar Pull Request en GitHub
# 1. Crear Pull Request a develop
# 2. Revisar cambios
# 3. Asegurar que pasan todas las validaciones
# 4. Merge a develop

# ✅ La rama fix/nombre-de-la-tarea SE PRESERVA
```

### **5. Release a Master (Cuando esté listo)**

#### **Opción A: Git Flow (Recomendado - Automatizado)**

```bash
# Crear release cuando develop esté estable
git flow release start 1.1.0

# Hacer ajustes finales si es necesario
# git add .
# git commit -m "chore: ajustes finales para release"

# Finalizar release (merge automático a master y develop + tag)
git flow release finish 1.1.0

# ✅ La rama release/1.1.0 SE PRESERVA
# ✅ Tag v1.1.0 creado automáticamente
```

#### **Opción B: Git Nativo (Manual)**

```bash
# Solo cuando develop esté estable y listo para producción
git checkout master
git merge develop

# Crear tag para la versión
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0

# O crear Pull Request de develop a master
# 1. Crear Pull Request develop → master
# 2. Revisión final
# 3. Merge a master (producción)
```

## 🛡️ **REGLAS OBLIGATORIAS**

### **✅ Antes de Merge a Develop**

1. **Validación completa pasando:**

   ```bash
   npm run validate:full:strict
   ```

2. **Tests pasando:**
   - 204 tests unitarios
   - Tests E2E
   - Cobertura según umbrales

3. **Linting sin errores:**
   - ESLint: 0 warnings, 0 errors
   - TypeScript: 0 errors
   - Prettier: formato correcto

4. **Documentación actualizada:**
   - README.md actualizado si es necesario
   - Documentación técnica actualizada
   - Swagger actualizado si hay cambios en API

### **✅ Antes de Release a Master**

1. **Develop estable:** Todas las features integradas y probadas
2. **Validación completa:** `npm run validate:full:strict`
3. **Tests de integración:** Verificar que todo funciona junto
4. **Documentación final:** Actualizada y alineada
5. **Revisión de código:** Pull Request review

### **❌ NUNCA en Master**

- Commits directos sin validación
- Código sin tests
- Cambios sin documentación
- Errores de linting o TypeScript
- Merge directo sin pasar por develop

## 📋 **EJEMPLO DE FLUJO COMPLETO**

### **Escenario: Corregir documentación de cobertura**

#### **Opción A: Git Flow (Recomendado)**

```bash
# 1. Asegurar que estamos en develop
git checkout develop
git pull origin develop

# 2. Crear bugfix con Git Flow
git flow bugfix start update-coverage-documentation

# 3. Hacer cambios
# Editar archivos .md
# Actualizar información de cobertura

# 4. Validar cambios
npm run validate:staged:strict

# 5. Commit
git commit -m "fix: actualizar documentación de cobertura

- ✅ README.md actualizado con umbrales correctos
- ✅ docs/TESTING.md corregido
- ✅ docs/CHANGELOG.md actualizado
- ✅ Información de cobertura alineada con jest.config.js"

# 6. Validación completa
npm run validate:full:strict

# 7. Finalizar bugfix (merge automático a develop)
git flow bugfix finish update-coverage-documentation

# ✅ La rama bugfix/update-coverage-documentation SE PRESERVA
# ✅ Merge automático a develop
# ✅ Push automático a origin

# 8. Cuando develop esté estable, crear release
git flow release start 1.1.0
git flow release finish 1.1.0
```

#### **Opción B: Git Nativo (Manual)**

```bash
# 1. Asegurar que estamos en develop
git checkout develop
git pull origin develop

# 2. Crear rama desde develop
git checkout -b fix/update-coverage-documentation

# 3. Hacer cambios
# Editar archivos .md
# Actualizar información de cobertura

# 4. Validar cambios
npm run validate:staged:strict

# 5. Commit
git commit -m "fix: actualizar documentación de cobertura

- ✅ README.md actualizado con umbrales correctos
- ✅ docs/TESTING.md corregido
- ✅ docs/CHANGELOG.md actualizado
- ✅ Información de cobertura alineada con jest.config.js"

# 6. Validación completa
npm run validate:full:strict

# 7. Push
git push origin fix/update-coverage-documentation

# 8. Crear Pull Request a develop
# 9. Revisar y mergear a develop
# 10. Cuando develop esté estable, crear Pull Request develop → master

# ✅ La rama fix/update-coverage-documentation SE PRESERVA
```

## 🎯 **BENEFICIOS DE ESTE FLUJO**

### **✅ Ventajas**

#### **Git Flow (Recomendado)**

1. **Comandos simplificados:** `git flow feature start/finish`
2. **Automatización:** Merge automático y limpieza
3. **Convenciones estándar:** Flujo probado y documentado
4. **Menos errores:** Automatiza el proceso de merge
5. **Tags automáticos:** Versiones etiquetadas automáticamente
6. **Ramas preservadas:** Todas las ramas se mantienen

#### **Git Nativo (Manual)**

1. **Control total:** Cada paso es manual y controlado
2. **Flexibilidad:** Puedes personalizar cada operación
3. **Aprendizaje:** Entiendes mejor cómo funciona Git
4. **Debugging:** Más fácil de debuggear problemas

#### **Comunes**

1. **Master siempre estable:** Lista para despliegue
2. **Develop como integración:** Todas las features se integran aquí
3. **Trazabilidad:** Cada cambio tiene su rama
4. **Validación obligatoria:** No se puede mergear código defectuoso
5. **Revisión de código:** Pull Requests para revisión
6. **Rollback fácil:** Si algo falla, se puede revertir
7. **Releases controlados:** Solo se mergea a master cuando está listo
8. **Desarrollo paralelo:** Múltiples features en develop
9. **Ramas preservadas:** Historial completo y acceso a versiones anteriores

## 📋 **COMANDOS DE REFERENCIA RÁPIDA**

### **🚀 Git Flow (Recomendado)**

```bash
# Crear feature
git flow feature start nombre-feature
git flow feature finish nombre-feature

# Crear bugfix
git flow bugfix start nombre-bugfix
git flow bugfix finish nombre-bugfix

# Crear release
git flow release start 1.1.0
git flow release finish 1.1.0

# Crear hotfix
git flow hotfix start nombre-hotfix
git flow hotfix finish nombre-hotfix

# Listar ramas activas
git flow feature list
git flow bugfix list
git flow release list
git flow hotfix list
```

### **🔧 Git Nativo (Manual)**

```bash
# Crear rama desde develop
git checkout develop
git pull origin develop
git checkout -b feat/nombre-feature

# Mergear a develop
git checkout develop
git merge feat/nombre-feature
git push origin develop

# Crear tag
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0
```

### **🛡️ Validaciones**

```bash
# Validación rápida (pre-commit)
npm run validate:staged:strict

# Validación completa (pre-push)
npm run validate:full:strict

# Verificar seguridad de BD
npm run db:safety
```

---

### **🛡️ Seguridad**

- **Validación automática:** Pre-commit y pre-push hooks
- **Tests obligatorios:** No se puede mergear sin tests
- **Documentación alineada:** Siempre actualizada
- **Cobertura garantizada:** Según umbrales configurados

## 📊 **MÉTRICAS DE CALIDAD**

### **Antes de Merge a Master**

- ✅ **204 tests pasando** sin errores
- ✅ **Cobertura según umbrales:** 80% branches, 90% functions/lines/statements
- ✅ **0 errores de linting** (ESLint + TypeScript)
- ✅ **Documentación actualizada** y alineada
- ✅ **Swagger actualizado** si hay cambios en API

### **Validación Automática**

- **Pre-commit:** Validación de archivos staged
- **Pre-push:** Validación completa del proyecto
- **CI/CD:** Validación automática en GitHub

## 🔄 **COMANDOS ÚTILES**

### **Gestión de Ramas**

```bash
# Ver ramas
git branch -a

# Cambiar rama
git checkout nombre-rama

# Crear y cambiar rama
git checkout -b nueva-rama

# Eliminar rama local
git branch -d nombre-rama

# Sincronizar con remoto
git fetch origin
git pull origin master
```

### **Validación**

```bash
# Validación rápida (desarrollo)
npm run validate:staged:strict

# Validación completa (antes de merge)
npm run validate:full:strict

# Solo tests
npm run test:quick

# Solo linting
npm run lint
```

## 🎯 **RESUMEN**

### **Flujo Estándar**

#### **Git Flow (Recomendado)**

1. **Crear feature/bugfix** con Git Flow desde develop
2. **Desarrollar** con validaciones locales
3. **Validar completamente** antes de finalizar
4. **Finalizar feature/bugfix** (merge automático a develop)
5. **Crear release** cuando develop esté estable
6. **Finalizar release** (merge automático a master)

#### **Git Nativo (Manual)**

1. **Crear rama desde develop** para cada tarea
2. **Desarrollar** con validaciones locales
3. **Validar completamente** antes de push
4. **Crear Pull Request a develop** para revisión
5. **Mergear a develop** cuando esté validado
6. **Release a master** cuando develop esté estable

### **Master = Producción**

- **Siempre estable** y lista para despliegue
- **Validación completa** en cada release
- **Documentación alineada** con el código
- **Tests pasando** sin excepciones

### **Develop = Integración**

- **Rama de desarrollo** principal
- **Integración continua** de features
- **Validación automática** en cada push
- **Base para nuevas** ramas de trabajo

### **🛡️ Preservación de Ramas**

**Todas las ramas se preservan automáticamente:**

- ✅ **Feature branches**: `feature/nombre-feature` se mantiene
- ✅ **Bugfix branches**: `bugfix/nombre-bugfix` se mantiene
- ✅ **Release branches**: `release/1.1.0` se mantiene
- ✅ **Hotfix branches**: `hotfix/nombre-hotfix` se mantiene

**Ventajas de preservar ramas:**

- 🔄 **Rollback fácil**: Puedes volver a cualquier rama
- 📝 **Historial completo**: Trazabilidad total del desarrollo
- 🛠️ **Cambios adicionales**: Puedes hacer más commits en ramas "finalizadas"
- 🔍 **Debugging**: Acceso a versiones específicas del código
