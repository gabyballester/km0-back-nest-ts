# Solución para Carpetas `dist` Anidadas

## 🚨 **Problema**

Durante el desarrollo, SWC (Speedy Web Compiler) genera carpetas `dist` anidadas en diferentes ubicaciones del proyecto, como:

```
src/modules/users/infrastructure/services/dist/user-domain.service.js
src/modules/users/presentation/dist/user.controller.js
```

Esto es problemático porque:

- Contamina la estructura del proyecto
- Puede causar conflictos de importación
- Dificulta el mantenimiento del código
- No es una práctica estándar

## ✅ **Solución Implementada**

### **1. Script de Limpieza Mejorado**

Se ha creado un script robusto (`scripts/clean-dist.js`) que:

- **Elimina carpetas `dist` anidadas** recursivamente
- **Limpia archivos `.js` y `.js.map`** compilados en `src/`
- **Limpia cache de Jest y TypeScript**
- **Proporciona feedback detallado** del proceso

### **2. Integración Automática**

El script se ejecuta automáticamente después de `start:dev`:

```json
"start:dev": "node scripts/timed-run.js \"dotenv -e .env.development -- cross-env NODE_ENV=development npx nest start --watch --preserveWatchOutput && npm run clean:dist\" \"🔄 Inicio completo con watch (Development)\""
```

### **3. Comando Manual**

Para limpiar manualmente:

```bash
npm run clean:dist
```

## 🔧 **Configuración Técnica**

### **SWC Configuration (`.swcrc`)**

```json
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "decorators": true,
      "dynamicImport": true
    },
    "transform": {
      "legacyDecorator": true,
      "decoratorMetadata": true
    },
    "target": "es2020",
    "loose": false,
    "externalHelpers": false,
    "keepClassNames": true
  },
  "module": {
    "type": "commonjs",
    "strict": false,
    "strictMode": true,
    "lazy": false,
    "noInterop": false
  },
  "sourceMaps": false,
  "minify": false,
  "exclude": ["node_modules/"]
}
```

### **NestJS CLI Configuration (`nest-cli.json`)**

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "webpack": false
  }
}
```

### **Git Ignore (`.gitignore`)**

```gitignore
# Compiled output
dist/
**/dist/
*.js.map
*.d.ts.map

# Dependencies
node_modules/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
```

## 📋 **Uso**

### **Desarrollo Normal**

```bash
npm run start:dev
```

El script automáticamente:

1. Inicia el servidor de desarrollo
2. Limpia las carpetas `dist` anidadas
3. Mantiene el proyecto limpio

### **Limpieza Manual**

```bash
# Limpiar carpetas dist
npm run clean:dist

# Limpiar y reconstruir
npm run clean:dist && npm run build
```

### **Verificación**

```bash
# Verificar que no hay carpetas dist anidadas
find . -name "dist" -type d 2>/dev/null | grep -v node_modules

# Verificar que no hay archivos .js en src
find src -name "*.js" -type f 2>/dev/null
```

## 🎯 **Beneficios**

1. **Proyecto Limpio**: No más carpetas `dist` anidadas
2. **Desarrollo Fluido**: Limpieza automática durante el desarrollo
3. **Mantenimiento Fácil**: Scripts automatizados
4. **Consistencia**: Estructura de proyecto estándar
5. **Performance**: Mejor rendimiento sin archivos innecesarios

## 🔍 **Monitoreo**

Para verificar que la solución funciona:

1. **Ejecutar desarrollo**: `npm run start:dev`
2. **Verificar estructura**: No debe haber carpetas `dist` en `src/`
3. **Verificar compilación**: `npm run build` debe funcionar
4. **Verificar tests**: `npm run test:quick:ultra` debe pasar

## 🚀 **Mantenimiento**

- El script se ejecuta automáticamente en desarrollo
- Para producción, usar `npm run build` que genera solo la carpeta `dist` principal
- Revisar periódicamente que no se generen carpetas `dist` anidadas
- Actualizar `.gitignore` si se detectan nuevos patrones de archivos compilados

---

**Estado**: ✅ **IMPLEMENTADO Y FUNCIONANDO**

**Última actualización**: Julio 2024
**Responsable**: Sistema de automatización del proyecto
