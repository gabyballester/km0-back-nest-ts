# 🌍 Configuración de Variables de Entorno

## **Manejo Seguro de Archivos .env**

---

## 📁 **Estructura de Archivos de Entorno**

### **Archivos que SÍ se commitean:**

- `.env.example` - Ejemplo con placeholders
- `.env.development.example` - Ejemplo para desarrollo
- `.env.test.example` - Ejemplo para tests

### **Archivos que NO se commitean:**

- `.env` - Variables de entorno locales (REALES)
- `.env.local` - Variables locales específicas
- `.env.production` - Variables de producción
- `.env.staging` - Variables de staging

---

## 🚨 **Reglas Fundamentales**

### **❌ NUNCA hacer:**

- Commitear archivos `.env` con credenciales reales
- Hardcodear credenciales en archivos de configuración
- Usar credenciales de producción en desarrollo

### **✅ SIEMPRE hacer:**

- Usar `.env.example` como plantilla
- Configurar `.env` localmente sin commitear
- Usar variables de entorno en producción

---

## 🔧 **Configuración Inicial**

### **1. Crear archivo .env.example:**

```bash
# .env.example (SE COMMITEA)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
JWT_SECRET=your-jwt-secret-here
COOKIE_SECRET=your-cookie-secret-here
API_KEY=your-api-key-here
```

### **2. Configurar .env local:**

```bash
# .env (NO SE COMMITEA)
DATABASE_URL=postgresql://postgres:admin@localhost:5432/km0_db_dev
JWT_SECRET=dev-secret-key-for-development-only
COOKIE_SECRET=dev-cookie-secret-for-development-only
```

---

## 📋 **Proceso de Setup**

### **Para nuevos desarrolladores:**

```bash
# 1. Clonar repositorio
git clone <repository>

# 2. Copiar archivo de ejemplo
cp .env.example .env

# 3. Configurar variables locales
# Editar .env con credenciales de desarrollo

# 4. Instalar dependencias
npm install

# 5. Ejecutar aplicación
npm run start:dev
```

### **Para diferentes entornos:**

```bash
# Desarrollo
cp .env.development.example .env

# Test
cp .env.test.example .env

# Producción (en servidor)
# Configurar variables de entorno en plataforma de deployment
```

---

## 🛡️ **Seguridad**

### **Archivos en .gitignore:**

```gitignore
# Variables de entorno
.env
.env.local
.env.production
.env.staging

# Archivos de configuración local
config/local.js
config/production.js
```

### **Verificación de seguridad:**

```bash
# Verificar que .env no está en el repositorio
git status

# Verificar que no hay credenciales hardcodeadas
npm run security-check
```

---

## 🔄 **Variables por Entorno**

### **Desarrollo Local:**

```bash
NODE_ENV=development
DATABASE_URL=postgresql://postgres:admin@localhost:5432/km0_db_dev
JWT_SECRET=dev-secret-key-for-development-only
COOKIE_SECRET=dev-cookie-secret-for-development-only
```

### **Test:**

```bash
NODE_ENV=test
DATABASE_URL=postgresql://postgres:admin@localhost:5432/km0_db_test
JWT_SECRET=test-secret-key-for-testing-only
COOKIE_SECRET=test-cookie-secret-for-testing-only
```

### **Producción (Render.com):**

```bash
NODE_ENV=production
DATABASE_URL=${DATABASE_URL}  # Configurado en dashboard
JWT_SECRET=${JWT_SECRET}      # Generado automáticamente
COOKIE_SECRET=${COOKIE_SECRET} # Generado automáticamente
```

---

## 🚨 **Troubleshooting**

### **Error: "Cannot find module 'dotenv'":**

```bash
npm install dotenv
```

### **Error: "DATABASE_URL is not defined":**

```bash
# Verificar que .env existe
ls -la .env

# Verificar que está siendo cargado
# En main.ts debe estar: require('dotenv').config()
```

### **Error: "Connection refused":**

```bash
# Verificar que la base de datos está corriendo
# Verificar credenciales en .env
# Verificar que el puerto es correcto
```

---

## 📚 **Mejores Prácticas**

1. **Nunca commitear `.env`** con credenciales reales
2. **Usar placeholders** en archivos de ejemplo
3. **Validar variables** al inicio de la aplicación
4. **Documentar** todas las variables requeridas
5. **Rotar credenciales** regularmente

---

**Documento creado:** 27 de Julio de 2025
**Última actualización:** 27 de Julio de 2025
**Próxima revisión:** 27 de Agosto de 2025
