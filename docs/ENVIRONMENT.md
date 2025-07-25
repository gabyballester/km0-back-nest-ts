# Environment Configuration - KM0 Market Backend

## 📋 **CONFIGURACIÓN CORRECTA SEGÚN NESTJS**

### **✅ Mejores Prácticas Oficiales**

Según la documentación oficial de NestJS y la comunidad, la forma correcta de manejar múltiples entornos es:

1. **Un archivo `.env` base** con variables para producción
2. **Archivos específicos por entorno** que sobrescriben variables necesarias
3. **ConfigModule con `envFilePath`** que carga automáticamente según `NODE_ENV`

---

## 🏗️ **ESTRUCTURA DE ARCHIVOS**

### **Archivo Base (.env)**

```bash
# Variables base para PRODUCCIÓN
NODE_ENV=production
PORT=4000
HOST=localhost
DATABASE_URL=postgresql://user:password@host:port/database_name
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
COOKIE_SECRET=your-super-secret-cookie-key-at-least-32-characters-long
JWT_EXPIRES_IN=1d
THROTTLE_TTL=60
THROTTLE_LIMIT=100
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

### **Desarrollo (.env.development)**

```bash
# Solo sobrescribe variables específicas de desarrollo
NODE_ENV=development
DATABASE_URL=postgresql://postgres:admin@localhost:5432/km0_db_dev
LOG_LEVEL=debug
```

### **Testing (.env.test)**

```bash
# Solo sobrescribe variables específicas de testing
NODE_ENV=test
PORT=4001
DATABASE_URL=postgresql://postgres:admin@localhost:5432/km0_db_test
LOG_LEVEL=error
```

---

## ⚙️ **CONFIGURACIÓN DE NESTJS**

### **ConfigModule Setup**

```typescript
ConfigModule.forRoot({
  isGlobal: true,
  load: [envConfig],
  cache: true,
  envFilePath: [
    '.env',
    '.env.local',
    '.env.development',
    '.env.test',
  ],
});
```

### **Orden de Carga**

1. `.env` (variables base para producción)
2. `.env.local` (variables locales, no committeadas)
3. `.env.development` (si NODE_ENV=development)
4. `.env.test` (si NODE_ENV=test)

**Las variables de archivos posteriores sobrescriben las anteriores.**

---

## 🚀 **COMANDOS CONFIGURADOS**

### **Desarrollo**

```bash
npm run start:dev      # NODE_ENV=development
npm run db:dev         # NODE_ENV=development prisma db push
npm run db:studio:dev  # NODE_ENV=development prisma studio
```

### **Testing**

```bash
npm run start:test     # NODE_ENV=test
npm run db:test        # NODE_ENV=test prisma db push
npm run db:studio:test # NODE_ENV=test prisma studio
```

### **Producción**

```bash
npm run db:prod        # NODE_ENV=production prisma db push
npm run db:studio:prod # NODE_ENV=production prisma studio
```

---

## 🔧 **CONFIGURACIÓN INICIAL**

### **Paso 1: Crear archivos de entorno**

```bash
npm run setup:env
```

### **Paso 2: Configurar variables**

```bash
# Copiar ejemplos
cp env.example .env
cp env.development.example .env.development
cp env.test.example .env.test

# Editar con tus valores
nano .env
nano .env.development
nano .env.test
```

### **Paso 3: Verificar configuración**

```bash
npm run test:fast
npm run start:dev
```

---

## 🛡️ **SEGURIDAD**

### **Archivos en .gitignore**

```gitignore
.env
.env.local
.env.development
.env.test
```

### **Archivos de ejemplo**

- `env.example` - Variables base para producción
- `env.development.example` - Variables específicas de desarrollo
- `env.test.example` - Variables específicas de testing

---

## 📚 **REFERENCIAS**

### **Documentación Oficial**

- [NestJS Configuration](https://docs.nestjs.com/techniques/configuration)
- [ConfigModule API](https://docs.nestjs.com/techniques/configuration#custom-configuration-files)

### **Mejores Prácticas de la Comunidad**

- Usar `envFilePath` en lugar de múltiples archivos manuales
- ConfigModule maneja automáticamente la carga según `NODE_ENV`
- Variables específicas sobrescriben las base
- Validación con Zod en tiempo de ejecución

---

## ❌ **ANTIPATRONES EVITADOS**

### **❌ No usar dotenv-cli manualmente**

```bash
# ❌ Mal - No necesario con ConfigModule
dotenv -e .env.development -- nest start
```

### **❌ No duplicar todas las variables**

```bash
# ❌ Mal - Duplicación innecesaria
# .env.development
NODE_ENV=development
PORT=4000
JWT_SECRET=...
COOKIE_SECRET=...
DATABASE_URL=...

# ✅ Bien - Solo variables específicas
# .env.development
NODE_ENV=development
DATABASE_URL=postgresql://...
```

### **❌ No usar process.env directamente**

```typescript
// ❌ Mal
const port = process.env.PORT;

// ✅ Bien
constructor(private configService: ConfigService) {}
const port = this.configService.get<number>('PORT');
```

---

## 🎯 **VENTAJAS DE ESTA CONFIGURACIÓN**

1. **✅ Estándar de NestJS**: Sigue las mejores prácticas oficiales
2. **✅ Automático**: ConfigModule maneja la carga según `NODE_ENV`
3. **✅ DRY**: No duplicación de variables
4. **✅ Seguro**: Validación con Zod
5. **✅ Flexible**: Fácil agregar nuevos entornos
6. **✅ Mantenible**: Estructura clara y documentada
7. **✅ Simple**: Solo sobrescribir lo necesario

---

## 🔄 **FLUJO DE CARGA**

```
1. .env (variables base para producción)
   ↓
2. .env.local (variables locales, opcional)
   ↓
3. .env.{NODE_ENV} (variables específicas del entorno)
   ↓
4. Variables de entorno del sistema
   ↓
5. ConfigService.get() (acceso tipado)
```

---

## 📊 **RESUMEN DE PUERTOS**

- **Producción**: 4000 (definido en .env)
- **Desarrollo**: 4000 (heredado de .env)
- **Testing**: 4001 (sobrescrito en .env.test)
