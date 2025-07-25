# Environment Configuration - KM0 Market Backend

## 📋 **CONFIGURACIÓN CORRECTA SEGÚN NESTJS**

### **✅ Mejores Prácticas Oficiales**

Según la documentación oficial de NestJS y la comunidad, la forma correcta de manejar múltiples entornos es:

1. **Un archivo `.env` base** con variables comunes
2. **Archivos específicos por entorno** que sobrescriben variables necesarias
3. **ConfigModule con `envFilePath`** que carga automáticamente según `NODE_ENV`

---

## 🏗️ **ESTRUCTURA DE ARCHIVOS**

### **Archivo Base (.env)**

```bash
# Variables comunes para todos los entornos
NODE_ENV=development
PORT=4000
JWT_SECRET=your-super-secret-jwt-key
COOKIE_SECRET=your-super-secret-cookie-key
DATABASE_URL=postgresql://postgres:admin@localhost:5432/km0_db_dev
```

### **Desarrollo (.env.development)**

```bash
# Solo sobrescribe variables específicas de desarrollo
DATABASE_URL=postgresql://postgres:admin@localhost:5432/km0_db_dev
NODE_ENV=development
LOG_LEVEL=debug
```

### **Testing (.env.test)**

```bash
# Solo sobrescribe variables específicas de testing
DATABASE_URL=postgresql://postgres:admin@localhost:5432/km0_db_test
NODE_ENV=test
LOG_LEVEL=warn
```

### **Producción (.env.production)**

```bash
# Solo sobrescribe variables específicas de producción
DATABASE_URL=postgresql://gabi:...@dpg-d21b6hmmcj7s73c4atcg-a.oregon-postgres.render.com/km0_db
NODE_ENV=production
LOG_LEVEL=info
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
    '.env.production',
  ],
});
```

### **Orden de Carga**

1. `.env` (variables base)
2. `.env.local` (variables locales, no committeadas)
3. `.env.development` (si NODE_ENV=development)
4. `.env.test` (si NODE_ENV=test)
5. `.env.production` (si NODE_ENV=production)

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
cp env.production.example .env.production

# Editar con tus valores
nano .env
nano .env.development
nano .env.test
nano .env.production
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
.env.production
```

### **Archivos de ejemplo**

- `env.example` - Variables base
- `env.development.example` - Ejemplo desarrollo
- `env.test.example` - Ejemplo testing
- `env.production.example` - Ejemplo producción

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
DATABASE_URL=postgresql://...
NODE_ENV=development
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
