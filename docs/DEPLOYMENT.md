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

**Configuración Actualizada:**

```yaml
# render.yaml
services:
  - type: web
    name: km0-market-backend
    runtime: node
    plan: free
    buildCommand: npm install && npm run db:generate && npm run build
    startCommand: npm run start:prod
    healthCheckPath: /health
```

**Variables de Entorno Configuradas:**

- `NODE_ENV=production`
- `PORT=4000`
- `HOST=0.0.0.0`
- `JWT_SECRET` (generado automáticamente)
- `COOKIE_SECRET` (generado automáticamente)
- `DATABASE_URL` (configurado en Render)
- Variables individuales de base de datos

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

### **Producción (Render)**

```bash
# Render asigna automáticamente
PORT=4000
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

### **Producción (Render)**

```bash
NODE_ENV=production
PORT=4000
HOST=0.0.0.0
CORS_ORIGIN=https://tu-dominio.com
```

## 🛡️ **SEGURIDAD CRÍTICA DE BASE DE DATOS**

### **⚠️ ADVERTENCIA IMPORTANTE**

**NUNCA uses estos comandos en producción:**

```bash
# ❌ PELIGROSO - Puede destruir datos
prisma migrate dev
prisma migrate reset
prisma db push --force-reset
```

**✅ SIEMPRE usa estos comandos en producción:**

```bash
# ✅ SEGURO - Solo aplica migraciones existentes
prisma migrate deploy

# ✅ SEGURO - Sincroniza esquema sin destruir datos
prisma db push

# ✅ SEGURO - Script de producción con validaciones
npm run db:prod
```

### **🛡️ Script de Producción Seguro**

Nuestro script `scripts/production-deploy.js` incluye:

- ✅ **Validaciones de seguridad** automáticas
- ✅ **Detección de comandos peligrosos**
- ✅ **Manejo inteligente** de diferentes escenarios
- ✅ **Baseline automático** para bases de datos existentes

### **🚨 Variables de Seguridad**

```bash
# Para operaciones críticas en producción
SAFE_DEPLOYMENT_MODE=true npm run db:prod
```

---

## 🚀 **DEPLOYMENT EN RENDER**

### **Paso 1: Preparar el Proyecto**

```bash
# Verificar que todo funcione localmente
npm run validate:full  # Validación completa
npm run build
npm run start:prod
```

### **Paso 2: Conectar con Render**

1. **Ir a [render.com](https://render.com)**
2. **Conectar cuenta de GitHub**
3. **Seleccionar el repositorio**
4. **Render detectará automáticamente el archivo `render.yaml`**

### **Paso 3: Configurar Variables de Entorno**

En Render Dashboard → Environment Variables:

```bash
# REQUERIDAS (configuradas automáticamente desde render.yaml)
NODE_ENV=production
PORT=4000
HOST=0.0.0.0
JWT_SECRET=<generado-automáticamente>
COOKIE_SECRET=<generado-automáticamente>
DATABASE_URL=<configurado-en-render>

# OPCIONALES (con valores por defecto)
JWT_EXPIRES_IN=1d
THROTTLE_TTL=60
THROTTLE_LIMIT=100
CORS_ORIGIN=https://tu-frontend.com
LOG_LEVEL=info
```

### **Paso 4: Configurar Base de Datos**

1. **En Render Dashboard → New → PostgreSQL**
2. **Render generará automáticamente DATABASE_URL**
3. **La variable se configurará automáticamente**

### **Paso 5: Deployment Automático**

- **Render detectará cambios en GitHub automáticamente**
- **Deployment se ejecutará automáticamente desde `render.yaml`**
- **Health check en `/health` verificará que todo funcione**

## 📊 **MONITOREO**

### **Health Checks**

```bash
GET /health          # Health básico
GET /health/detailed # Health detallado con métricas
```

### **Logs en Render**

- **Dashboard → Logs**: Ver logs en tiempo real
- **Logs estructurados**: Fácil debugging
- **Métricas de performance**: CPU, memoria, requests

### **Dominio Personalizado**

1. **Render Dashboard → Settings → Domains**
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
- ✅ Usar variables de entorno de Render
- ✅ Rotar secrets regularmente
- ✅ Render encripta automáticamente las variables

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Deployment Falla**

```bash
# Verificar logs en Render Dashboard
# Verificar variables de entorno
# Verificar que el build funcione localmente
npm run build
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
# Verificar DATABASE_URL en Render
# Verificar que la base de datos esté activa
# Verificar credenciales
```

## 📈 **ESCALADO**

### **Render Auto-Scaling**

- **Automático**: Según tráfico
- **Manual**: Configurar en Dashboard
- **Métricas**: CPU, memoria, requests/segundo

### **Monitoreo**

- **Render Dashboard**: Métricas en tiempo real
- **Logs**: Estructurados y buscables
- **Alertas**: Configurables por métricas

---

## 🎯 **RESUMEN DE DEPLOYMENT**

### **Render (Recomendado Principal)**

1. ✅ **Conectar GitHub** → Deployment automático desde `render.yaml`
2. ✅ **Configurar variables** → Seguridad con variables individuales
3. ✅ **Agregar base de datos** → PostgreSQL incluido
4. ✅ **Configurar dominio** → SSL automático
5. ✅ **Monitorear** → Logs y métricas completas

### **Ventajas Finales**

- 🚀 **Deployment en 5 minutos**
- 🔒 **Seguridad automática**
- 📊 **Monitoreo completo**
- 💰 **Gratis para empezar**
- 🔧 **Fácil mantenimiento**
- 📋 **Configuración declarativa** (render.yaml)
