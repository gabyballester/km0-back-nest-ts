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

```bash
# Primero mergear a develop
git checkout develop
git merge fix/nombre-de-la-tarea

# O usar Pull Request en GitHub
# 1. Crear Pull Request a develop
# 2. Revisar cambios
# 3. Asegurar que pasan todas las validaciones
# 4. Merge a develop
```

### **5. Release a Master (Cuando esté listo)**

```bash
# Solo cuando develop esté estable y listo para producción
git checkout master
git merge develop

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
```

## 🎯 **BENEFICIOS DE ESTE FLUJO**

### **✅ Ventajas**

1. **Master siempre estable:** Lista para despliegue
2. **Develop como integración:** Todas las features se integran aquí
3. **Trazabilidad:** Cada cambio tiene su rama
4. **Validación obligatoria:** No se puede mergear código defectuoso
5. **Revisión de código:** Pull Requests para revisión
6. **Rollback fácil:** Si algo falla, se puede revertir
7. **Releases controlados:** Solo se mergea a master cuando está listo
8. **Desarrollo paralelo:** Múltiples features en develop

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
