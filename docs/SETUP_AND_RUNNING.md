# 🚀 **GUÍA DE CONFIGURACIÓN Y EJECUCIÓN**

## 📋 **Prerrequisitos**

- **Node.js**: >= 22.0.0
- **PostgreSQL**: >= 15.0
- **npm**: >= 9.0.0

## 🔧 **Configuración Inicial**

### **1. Configurar Variables de Entorno**

El proyecto necesita archivos de entorno para funcionar. Ejecuta el siguiente comando para crearlos automáticamente:

```bash
npm run setup:env
```

Esto creará:

- `.env` - Variables comunes
- `.env.development` - Variables de desarrollo
- `.env.test` - Variables de testing

### **2. Configurar Base de Datos**

Asegúrate de que PostgreSQL esté ejecutándose y crea las bases de datos:

```sql
-- Conectar a PostgreSQL como superusuario
psql -U postgres

-- Crear bases de datos
CREATE DATABASE km0_db_dev;
CREATE DATABASE km0_db_test;
CREATE DATABASE km0_db;
```

### **3. Generar Cliente de Prisma**

```bash
npm run db:generate
```

### **4. Aplicar Schema a Base de Datos**

```bash
# Para desarrollo
npm run db:dev

# Para testing
npm run db:test

# Para producción
npm run db:prod
```

## 🏃‍♂️ **Ejecutar Entornos**

### **Entorno de Desarrollo**

```bash
npm run start:dev
```

**Características:**

- ✅ Hot reload automático
- ✅ Logging detallado (debug)
- ✅ Rate limiting permisivo
- ✅ CORS configurado para localhost:3000
- ✅ Puerto: 4000

**Verificar funcionamiento:**

```bash
curl http://localhost:4000/health
```

### **Build de Producción**

```bash
# Compilar el proyecto
npm run build

# Verificar que no hay errores de TypeScript
npm run type-check

# Verificar linting
npm run lint:check

# Ejecutar en modo producción
npm run start:prod
```

**Características:**

- ✅ Código optimizado y minificado
- ✅ Logging reducido (info)
- ✅ Rate limiting estricto
- ✅ Sin archivos de test en dist
- ✅ Puerto: 4000 (configurable)

### **Entorno de Testing**

```bash
# Ejecutar tests unitarios rápidos
npm run test:quick:ultra

# Ejecutar tests completos con cobertura
npm run test:full:ultra

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests E2E
npm run test:e2e:full
```

**Características:**

- ✅ Base de datos separada (km0_db_test)
- ✅ Logging mínimo (error)
- ✅ Rate limiting reducido
- ✅ Puerto: 4001
- ✅ Cobertura 100%

## 📊 **Verificación de Estado**

### **Health Check**

```bash
# Verificar estado general
curl http://localhost:4000/health

# Verificar base de datos
curl http://localhost:4000/health/database

# Verificar entorno
curl http://localhost:4000/health/environment
```

### **Endpoints Disponibles**

```bash
# Documentación API
curl http://localhost:4000/api

# Usuarios
curl http://localhost:4000/users

# Perfiles
curl http://localhost:4000/profiles
```

## 🔍 **Troubleshooting**

### **Problemas Comunes**

#### **1. Error: "Cannot find module"**

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

#### **2. Error de conexión a base de datos**

```bash
# Verificar que PostgreSQL esté ejecutándose
sudo systemctl status postgresql

# Verificar conexión
psql -U postgres -d km0_db_dev -c "SELECT 1;"
```

#### **3. Error de variables de entorno**

```bash
# Verificar archivos .env
ls -la .env*

# Regenerar archivos de entorno
npm run setup:env
```

#### **4. Error de compilación TypeScript**

```bash
# Verificar errores
npm run type-check

# Limpiar cache
rm -rf dist
npm run build
```

### **Logs Útiles**

```bash
# Ver logs en tiempo real
tail -f logs/app.log

# Ver logs de desarrollo
npm run start:dev 2>&1 | tee dev.log
```

## 🧪 **Pruebas Exhaustivas**

### **Suite de Tests Completa**

```bash
# 1. Tests unitarios con cobertura
npm run test:full:ultra

# 2. Tests E2E
npm run test:e2e:full

# 3. Verificación de tipos
npm run type-check

# 4. Verificación de linting
npm run lint:check

# 5. Verificación de formato
npm run format:check
```

### **Verificación de Cobertura**

La cobertura debe ser 100% en:

- ✅ Statements
- ✅ Branches
- ✅ Functions
- ✅ Lines

### **Verificación de Calidad**

```bash
# Verificar dependencias
npm run check:dependencies

# Verificar configuración de puertos
npm run check:ports

# Verificar archivos dist
npm run check:dist
```

## 🚀 **Despliegue**

### **Preparación para Producción**

```bash
# 1. Build de producción
npm run build

# 2. Verificar archivos generados
ls -la dist/

# 3. Verificar que no hay archivos de test
npm run clean:unnecessary-dist

# 4. Verificar configuración de seguridad
npm run db:safety:check
```

### **Variables de Entorno de Producción**

Asegúrate de configurar en tu plataforma de despliegue:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/km0_db?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-change-in-production
COOKIE_SECRET=your-super-secret-cookie-key-change-in-production
THROTTLE_TTL=60
THROTTLE_LIMIT=100
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
```

## 📚 **Comandos Útiles**

### **Desarrollo**

```bash
npm run start:dev          # Servidor de desarrollo
npm run db:studio:dev      # Prisma Studio para desarrollo
npm run test:watch         # Tests en modo watch
```

### **Testing**

```bash
npm run test:full:ultra    # Tests completos con cobertura
npm run test:e2e:full      # Tests end-to-end
npm run db:studio:test     # Prisma Studio para testing
```

### **Producción**

```bash
npm run build              # Build de producción
npm run start:prod         # Servidor de producción
npm run db:studio:prod     # Prisma Studio para producción
```

### **Utilidades**

```bash
npm run setup:env          # Configurar archivos de entorno
npm run db:generate        # Generar cliente Prisma
npm run clean:unnecessary-dist  # Limpiar archivos innecesarios
npm run check:dependencies # Verificar dependencias
```

---

**Estado**: ✅ **LISTO PARA EJECUTAR**

**Última actualización**: $(date)

**Versión**: 0.0.1
