# Flujo de Trabajo con Ramas - KM0 Market Backend

## 🌿 **ESTRATEGIA DE RAMAS**

### **Ramas Principales**

- **`master`**: Rama principal para despliegue
  - Solo se usa para mergear cuando todo está correcto
  - Siempre debe estar lista para despliegue
  - Contiene solo código validado y probado

- **`fix/*`**: Ramas para correcciones
  - Ejemplo: `fix/update-coverage-documentation`
  - Para correcciones de bugs o documentación

- **`feat/*`**: Ramas para nuevas funcionalidades
  - Ejemplo: `feat/user-authentication`
  - Para nuevas características

- **`docs/*`**: Ramas para documentación
  - Ejemplo: `docs/api-documentation`
  - Para actualizaciones de documentación

## 🚀 **FLUJO DE TRABAJO**

### **1. Crear Rama para Tarea**

```bash
# Crear y cambiar a nueva rama
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

### **4. Merge a Master**

```bash
# Solo cuando todo esté correcto
git checkout master
git merge fix/nombre-de-la-tarea

# O usar Pull Request en GitHub
# 1. Crear Pull Request
# 2. Revisar cambios
# 3. Asegurar que pasan todas las validaciones
# 4. Merge a master
```

## 🛡️ **REGLAS OBLIGATORIAS**

### **✅ Antes de Merge a Master**

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

### **❌ NUNCA en Master**

- Commits directos sin validación
- Código sin tests
- Cambios sin documentación
- Errores de linting o TypeScript

## 📋 **EJEMPLO DE FLUJO COMPLETO**

### **Escenario: Corregir documentación de cobertura**

```bash
# 1. Crear rama
git checkout -b fix/update-coverage-documentation

# 2. Hacer cambios
# Editar archivos .md
# Actualizar información de cobertura

# 3. Validar cambios
npm run validate:staged:strict

# 4. Commit
git commit -m "fix: actualizar documentación de cobertura

- ✅ README.md actualizado con umbrales correctos
- ✅ docs/TESTING.md corregido
- ✅ docs/CHANGELOG.md actualizado
- ✅ Información de cobertura alineada con jest.config.js"

# 5. Validación completa
npm run validate:full:strict

# 6. Push
git push origin fix/update-coverage-documentation

# 7. Crear Pull Request en GitHub
# 8. Revisar y mergear a master
```

## 🎯 **BENEFICIOS DE ESTE FLUJO**

### **✅ Ventajas**

1. **Master siempre estable:** Lista para despliegue
2. **Trazabilidad:** Cada cambio tiene su rama
3. **Validación obligatoria:** No se puede mergear código defectuoso
4. **Revisión de código:** Pull Requests para revisión
5. **Rollback fácil:** Si algo falla, se puede revertir

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

1. **Crear rama** para cada tarea
2. **Desarrollar** con validaciones locales
3. **Validar completamente** antes de push
4. **Crear Pull Request** para revisión
5. **Mergear a master** solo cuando todo esté correcto

### **Master = Despliegue**

- **Siempre estable** y lista para producción
- **Validación completa** en cada merge
- **Documentación alineada** con el código
- **Tests pasando** sin excepciones
