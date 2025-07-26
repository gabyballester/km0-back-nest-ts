# Deployment Guide - KM0 Market Backend

## 🚀 **PLATAFORMAS GRATUITAS RECOMENDADAS**

### **🥇 RENDER (RECOMENDACIÓN PRINCIPAL - GRATUITO)**

**Ventajas:**

- ✅ **750 horas/mes GRATIS** (suficiente para desarrollo)
- ✅ Deployment automático desde GitHub
- ✅ Base de datos PostgreSQL incluida
- ✅ Variables de entorno fáciles de configurar
- ✅ SSL automático y dominio personalizado
- ✅ Muy estable y confiable
- ✅ Excelente para NestJS
- ✅ Se despierta automáticamente después de inactividad

**Precios:**

- **Gratis**: 750 horas/mes (sleep después de 15 min inactivo)
- **Pro**: $7/mes (siempre activo)

**🔗 [render.com](https://render.com)**

---

### **🥉 VERCEL (PARA APIS SIMPLES)**

**Ventajas:**

- ✅ Deployment ultra-rápido
- ✅ Edge functions disponibles
- ✅ Excelente performance
- ✅ Integración perfecta con frontend

**Limitaciones:**

- ⚠️ Serverless functions (no ideal para NestJS completo)
- ⚠️ Timeout de 10 segundos en plan gratuito
- ⚠️ Mejor para APIs simples

**🔗 [vercel.com](https://vercel.com)**

---

## 🌐 **CONFIGURACIÓN DE PUERTOS**

### **Desarrollo Local**

```bash
# Frontend (React/Vue/Angular)
http://localhost:3000

# Backend (NestJS)
http://localhost:4000
```

### **Producción (Railway/Render)**

```bash
# Railway/Render asignan automáticamente
PORT=3000  # o el puerto que asigne la plataforma
HOST=0.0.0.0
```

## 🔧 **VARIABLES DE ENTORNO**

### **Desarrollo (.env)**

```bash
NODE_ENV=development
PORT=4000
HOST=localhost
CORS_ORIGIN=http://localhost:3000
```

### **Producción (Railway/Render)**

```bash
NODE_ENV=production
PORT=3000  # o el puerto que asigne el hosting
HOST=0.0.0.0
CORS_ORIGIN=https://tu-dominio.com
```

## 🚀 **DEPLOYMENT EN RAILWAY**

### **Paso 1: Preparar el Proyecto**

```bash
# Verificar que todo funcione localmente
npm run validate:full:strict  # Validación completa
npm run build:prod
npm run start:prod
```

### **Paso 2: Conectar con Railway**

1. **Ir a [railway.app](https://railway.app)**
2. **Conectar cuenta de GitHub**
3. **Seleccionar el repositorio**
4. **Railway detectará automáticamente que es un proyecto Node.js**

### **Paso 3: Configurar Variables de Entorno**

En Railway Dashboard → Variables:

```bash
# REQUERIDAS
NODE_ENV=production
JWT_SECRET=tu-super-secret-jwt-key-at-least-32-characters-long
COOKIE_SECRET=tu-super-secret-cookie-key-at-least-32-characters-long
DATABASE_URL=postgresql://username:password@host:port/database

# OPCIONALES (con valores por defecto)
PORT=3000
HOST=0.0.0.0
JWT_EXPIRES_IN=1d
THROTTLE_TTL=60
THROTTLE_LIMIT=100
CORS_ORIGIN=https://tu-frontend.com
LOG_LEVEL=info
```

### **Paso 4: Configurar Base de Datos**

1. **En Railway Dashboard → New → Database → PostgreSQL**
2. **Railway generará automáticamente DATABASE_URL**
3. **Copiar DATABASE_URL a las variables de entorno**

### **Paso 5: Deployment Automático**

- **Railway detectará cambios en GitHub automáticamente**
- **Deployment se ejecutará automáticamente**
- **Health check en `/health` verificará que todo funcione**

## 📊 **MONITOREO**

### **Health Checks**

```bash
GET /health          # Health básico
GET /health/detailed # Health detallado con métricas
```

### **Logs en Railway**

- **Dashboard → Logs**: Ver logs en tiempo real
- **Logs estructurados**: Fácil debugging
- **Métricas de performance**: CPU, memoria, requests

### **Dominio Personalizado**

1. **Railway Dashboard → Settings → Domains**
2. **Agregar dominio personalizado**
3. **Configurar DNS según instrucciones**
4. **SSL automático incluido**

## 🔒 **SEGURIDAD**

### **Headers de Seguridad**

- ✅ Helmet (CSP, HSTS, XSS Protection)
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ JWT con cookies seguras

### **Variables Sensibles**

- ❌ Nunca committear `.env` o `env.mirror`
- ✅ Usar variables de entorno de Railway
- ✅ Rotar secrets regularmente
- ✅ Railway encripta automáticamente las variables

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Deployment Falla**

```bash
# Verificar logs en Railway Dashboard
# Verificar variables de entorno
# Verificar que el build funcione localmente
npm run build:prod
```

### **Health Check Falla**

```bash
# Verificar que /health responda localmente
curl http://localhost:4000/health

# Verificar variables de entorno requeridas
NODE_ENV, JWT_SECRET, COOKIE_SECRET, DATABASE_URL
```

### **Base de Datos No Conecta**

```bash
# Verificar DATABASE_URL en Railway
# Verificar que la base de datos esté activa
# Verificar credenciales
```

## 📈 **ESCALADO**

### **Railway Auto-Scaling**

- **Automático**: Según tráfico
- **Manual**: Configurar en Dashboard
- **Métricas**: CPU, memoria, requests/segundo

### **Monitoreo**

- **Railway Dashboard**: Métricas en tiempo real
- **Logs**: Estructurados y buscables
- **Alertas**: Configurables por métricas

---

## 🎯 **RESUMEN DE DEPLOYMENT**

### **Railway (Recomendado)**

1. ✅ **Conectar GitHub** → Deployment automático
2. ✅ **Configurar variables** → Seguridad
3. ✅ **Agregar base de datos** → PostgreSQL
4. ✅ **Configurar dominio** → SSL automático
5. ✅ **Monitorear** → Logs y métricas

### **Ventajas Finales**

- 🚀 **Deployment en 5 minutos**
- 🔒 **Seguridad automática**
- 📊 **Monitoreo completo**
- 💰 **Gratis para empezar**
- 🔧 **Fácil mantenimiento**
