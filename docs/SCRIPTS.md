# Scripts Rápidos - Uso Obligatorio

## 🚀 Regla Principal: **SIEMPRE usar scripts rápidos**

### ❌ **NUNCA usar scripts lentos en desarrollo diario**

- `npm run test` (lento, con cobertura)
- `npm run test:cov` (muy lento, cobertura completa)
- `npm run test:e2e` (lento, tests end-to-end)

### ✅ **SIEMPRE usar scripts rápidos en desarrollo**

- `npm run test:fast` (rápido, sin cobertura)
- `npm run test:e2e:fast` (rápido, e2e optimizado)
- `npm run lint` (rápido, con cache)

### 🔧 Scripts de Utilidad

```bash
npm run env:setup      # Configurar .env desde env.mirror
npm run env:example    # Configurar .env desde env.example
npm run format:check   # Verificar formato sin cambiar
npm run check:process-env # Verificar uso correcto de process.env
```

## 📋 Scripts Disponibles

### 🏃‍♂️ **Scripts Rápidos (Obligatorios para desarrollo)**

| Script              | Tiempo | Uso                           | Comando                     |
| ------------------- | ------ | ----------------------------- | --------------------------- |
| `test:fast`         | ~2s    | Tests unitarios sin cobertura | `npm run test:fast`         |
| `test:e2e:fast`     | ~3s    | Tests e2e optimizados         | `npm run test:e2e:fast`     |
| `lint`              | ~1s    | ESLint + Prettier con cache   | `npm run lint`              |
| `format`            | ~0.5s  | Solo Prettier                 | `npm run format`            |
| `start:dev`         | ~2s    | Servidor desarrollo           | `npm run start:dev`         |
| `check:process-env` | ~0.1s  | Verificar uso de process.env  | `npm run check:process-env` |

### �� **Scripts Lentos (Solo para CI/CD y commits importantes)**

| Script       | Tiempo | Uso                 | Cuándo usar          |
| ------------ | ------ | ------------------- | -------------------- |
| `test:cov`   | ~2.8s  | Tests con cobertura | Pre-push, CI/CD      |
| `test:e2e`   | ~5s    | Tests e2e completos | Pre-push, CI/CD      |
| `test:debug` | ~10s   | Tests con debugger  | Debugging específico |

## 🎯 Flujo de Desarrollo Optimizado

### **1. Desarrollo Diario (Obligatorio)**

```bash
# ✅ Hacer cambios en código
# ✅ Ejecutar tests rápidos
npm run test:fast

# ✅ Verificar linting
npm run lint

# ✅ Formatear código
npm run format

# ✅ Iniciar servidor
npm run start:dev
```

### **2. Pre-commit (Automático)**

```bash
# Husky ejecuta automáticamente:
npm run format    # Formatear
npm run lint      # Linting
npm run test:fast # Tests rápidos
```

### **3. Pre-push (Automático)**

```bash
# Husky ejecuta automáticamente:
npm run test:cov  # Tests con cobertura
npm run test:e2e  # Tests e2e completos
```

### **4. CI/CD (Automático)**

```bash
# Pipeline ejecuta:
npm run test:cov  # Tests con cobertura
npm run test:e2e  # Tests e2e completos
npm run build     # Build de producción
```

## ⚡ Optimizaciones Implementadas

### **test:fast**

```json
{
  "maxWorkers": 4, // Paralelización máxima
  "bail": true, // Parar en primer error
  "passWithNoTests": true, // No fallar si no hay tests
  "silent": true, // Output mínimo
  "no-coverage": true // Sin cobertura (más rápido)
}
```

### **test:e2e:fast**

```json
{
  "maxWorkers": 1, // Tests e2e secuenciales
  "bail": true, // Parar en primer error
  "testTimeout": 3000 // Timeout reducido
}
```

### **lint**

```json
{
  "--fix": true, // Corregir automáticamente
  "--cache": true, // Cache para velocidad
  "--max-warnings": 0 // Cero warnings
}
```

## 📊 Comparación de Velocidad

### **Tests Unitarios**

- **test:fast**: ~2.7s (71 tests, sin cobertura)
- **test:cov**: ~2.8s (71 tests, con cobertura)
- **test**: ~3.5s (71 tests, configuración estándar)

### **Tests E2E**

- **test:e2e:fast**: ~3s (timeout reducido)
- **test:e2e**: ~5s (timeout completo)

### **Linting**

- **lint**: ~1s (con cache)
- **lint sin cache**: ~3s

## 🚨 Reglas Estrictas

### **✅ OBLIGATORIO en desarrollo:**

1. **Siempre usar `npm run test:fast`** para verificar cambios
2. **Siempre usar `npm run lint`** antes de commits
3. **Siempre usar `npm run format`** para formatear código
4. **Nunca usar `npm run test:cov`** en desarrollo diario

### **✅ PERMITIDO solo en:**

1. **Pre-push hooks** (automático)
2. **CI/CD pipelines** (automático)
3. **Debugging específico** (cuando sea necesario)

### **❌ PROHIBIDO en desarrollo:**

1. `npm run test:cov` (lento, innecesario)
2. `npm run test:e2e` (lento, innecesario)
3. `npm run test:debug` (muy lento, solo debugging)

## 🔧 Configuración de Husky

### **Pre-commit Hook**

```json
{
  "lint-staged": {
    "*.ts": [
      "npm run format",
      "npm run lint",
      "npm run test:fast",
      "npm run check:process-env"
    ]
  }
}
```

### **Pre-push Hook**

```bash
npm run test:cov
npm run test:e2e
```

## 📈 Beneficios de Scripts Rápidos

### **⚡ Velocidad**

- **Desarrollo 3x más rápido**
- **Feedback inmediato**
- **Menos tiempo de espera**

### **🎯 Productividad**

- **Flujo de trabajo fluido**
- **Menos interrupciones**
- **Desarrollo más eficiente**

### **🛡️ Calidad**

- **Tests automáticos en cada commit**
- **Linting automático**
- **Formato consistente**
- **Verificación de process.env automática**

## 🎯 Comandos de Referencia Rápida

```bash
# ✅ Desarrollo diario (OBLIGATORIO)
npm run test:fast    # Tests rápidos
npm run lint         # Linting rápido
npm run format       # Formatear
npm run start:dev    # Servidor desarrollo
npm run check:process-env # Verificar process.env

# ❌ Solo para CI/CD
npm run test:cov     # Tests con cobertura
npm run test:e2e     # Tests e2e completos
npm run build        # Build producción
```

## 🚀 Recordatorio Diario

**Antes de cada commit:**

1. `npm run test:fast` ✅
2. `npm run lint` ✅
3. `npm run format` ✅
4. `npm run check:process-env` ✅
5. Commit ✅

**NUNCA:**

- `npm run test:cov` en desarrollo ❌
- `npm run test:e2e` en desarrollo ❌
- Commits sin tests rápidos ❌
- Usar `process.env` fuera de `env.config.ts` ❌
