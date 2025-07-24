# Deployment Guide

## 🌐 **Configuración de Puertos**

### **Desarrollo Local**

```bash
# Frontend (React/Vue/Angular)
http://localhost:3000

# Backend (NestJS)
http://localhost:4000
```

### **Producción**

```bash
# Frontend (nginx/apache)
https://tu-dominio.com

# Backend (NestJS)
https://api.tu-dominio.com
# o
https://tu-dominio.com/api
```

## 🔧 **Variables de Entorno**

### **Desarrollo (.env)**

```bash
NODE_ENV=development
PORT=4000
HOST=localhost
CORS_ORIGIN=http://localhost:3000
```

### **Producción (Render/Railway/etc.)**

```bash
NODE_ENV=production
PORT=3000  # o el puerto que asigne el hosting
HOST=0.0.0.0
CORS_ORIGIN=https://tu-dominio.com
```

## 🚀 **Deployment**

### **1. Build de Producción**

```bash
npm run build:prod
```

### **2. Variables de Entorno Requeridas**

- `JWT_SECRET` - Clave secreta de 32+ caracteres
- `COOKIE_SECRET` - Clave secreta de 32+ caracteres
- `DATABASE_URL` - URL de conexión a PostgreSQL

### **3. Comando de Inicio**

```bash
npm run start:prod
```

## 📊 **Monitoreo**

### **Health Checks**

```bash
GET /health          # Health básico
GET /health/detailed # Health detallado con métricas
```

### **Logs**

```bash
# Nivel de log configurable
LOG_LEVEL=info  # error, warn, info, debug
```

## 🔒 **Seguridad**

### **Headers de Seguridad**

- ✅ Helmet (CSP, HSTS, XSS Protection)
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ JWT con cookies seguras

### **Variables Sensibles**

- ❌ Nunca committear `.env` o `env.mirror`
- ✅ Usar variables de entorno del hosting
- ✅ Rotar secrets regularmente
