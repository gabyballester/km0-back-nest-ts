# 🛡️ Guía de Mejores Prácticas de Seguridad

## **Manejo Seguro de Credenciales y Secretos**

---

## 🚨 **REGLAS FUNDAMENTALES**

### **❌ NUNCA hacer:**

- Hardcodear credenciales reales en código o documentación
- Commitear archivos `.env` con credenciales reales
- Usar credenciales de producción como ejemplos
- Documentar URLs de conexión completas con credenciales
- Compartir credenciales por chat, email o mensajes

### **✅ SIEMPRE hacer:**

- Usar variables de entorno para credenciales
- Usar placeholders en documentación
- Configurar secretos en plataformas de deployment
- Implementar pre-commit hooks de seguridad
- Rotar credenciales regularmente

---

## 📁 **Estructura de Archivos Segura**

### **Archivos de Ejemplo (CORRECTO):**

```bash
# .env.example
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
JWT_SECRET=your-jwt-secret-here
COOKIE_SECRET=your-cookie-secret-here
API_KEY=your-api-key-here
```

### **Archivos Reales (NUNCA COMMITEAR):**

```bash
# .env (NO COMMITEAR)
DATABASE_URL=postgresql://gabi:realpassword@realhost.com/realdb
JWT_SECRET=8f7d3b2a1e9c6f5d4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0
```

---

## 🔧 **Configuración de Entorno**

### **Desarrollo Local:**

```bash
# 1. Copiar archivo de ejemplo
cp .env.example .env

# 2. Configurar credenciales locales
DATABASE_URL=postgresql://postgres:admin@localhost:5432/km0_db_dev
JWT_SECRET=dev-secret-key-for-development-only
```

### **Producción (Render.com):**

```yaml
# render.yaml
services:
  - type: web
    envVars:
      - key: DATABASE_URL
        sync: false  # Configurar manualmente en dashboard
      - key: JWT_SECRET
        generateValue: true
```

---

## 🛡️ **Pre-commit Hooks de Seguridad**

### **Instalación:**

```bash
npm install --save-dev pre-commit
```

### **Configuración (.pre-commit-config.yaml):**

```yaml
repos:
  - repo: local
    hooks:
      - id: check-secrets
        name: Check for secrets
        entry: bash -c 'grep -r "password\|secret\|key" --include="*.ts" --include="*.js" --include="*.md" . | grep -v "example\|placeholder" && exit 1 || exit 0'
        language: system
```

### **Patrones a Detectar:**

```bash
# Patrones peligrosos
postgresql://.*:.*@.*
mongodb://.*:.*@.*
redis://.*:.*@.*
password.*=.*[a-zA-Z0-9]{8,}
secret.*=.*[a-zA-Z0-9]{8,}
api_key.*=.*[a-zA-Z0-9]{8,}
```

---

## 📚 **Documentación Segura**

### **❌ INCORRECTO:**

```markdown
# Configuración de Base de Datos
DATABASE_URL=postgresql://gabi:JrqKcqtJtm8KgeMJ0xzVDCn5FIv3rDWA@dpg-d21b6hmmcj7s73c4atcg-a.oregon-postgres.render.com/km0_db
```

### **✅ CORRECTO:**

```markdown
# Configuración de Base de Datos
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Ejemplo para desarrollo local:
# DATABASE_URL=postgresql://postgres:admin@localhost:5432/km0_db_dev
```

---

## 🔄 **Proceso de Deployment Seguro**

### **1. Configurar Variables de Entorno:**

```bash
# En Render.com Dashboard
DATABASE_URL=postgresql://user:realpassword@realhost.com/realdb
JWT_SECRET=real-jwt-secret-here
```

### **2. Validar Configuración:**

```bash
# Script de validación
npm run validate:env
```

### **3. Rotar Credenciales:**

```bash
# Proceso mensual
1. Generar nuevas credenciales
2. Actualizar en plataforma de deployment
3. Actualizar en base de datos
4. Verificar funcionamiento
```

---

## 🚨 **Checklist de Seguridad**

### **Antes de cada commit:**

- [ ] ¿Hay credenciales hardcodeadas?
- [ ] ¿Hay URLs de BD con credenciales?
- [ ] ¿Hay archivos `.env` en el commit?
- [ ] ¿La documentación usa placeholders?
- [ ] ¿Los ejemplos son ficticios?

### **Antes de cada deployment:**

- [ ] ¿Las variables de entorno están configuradas?
- [ ] ¿Las credenciales están actualizadas?
- [ ] ¿Los secretos están protegidos?
- [ ] ¿El acceso está restringido?

---

## 🛠️ **Herramientas Recomendadas**

### **Detección de Secretos:**

- **git-secrets**: Detectar credenciales en commits
- **truffleHog**: Buscar secretos en historial de Git
- **SonarQube**: Análisis de seguridad de código

### **Gestión de Secretos:**

- **HashiCorp Vault**: Gestión centralizada de secretos
- **AWS Secrets Manager**: Para proyectos en AWS
- **Azure Key Vault**: Para proyectos en Azure

### **Monitoreo:**

- **GitGuardian**: Monitoreo continuo de secretos
- **Snyk**: Detección de vulnerabilidades
- **Dependabot**: Actualizaciones de dependencias

---

## 📞 **Procedimientos de Emergencia**

### **Si se detectan credenciales expuestas:**

1. **Inmediato**: Cambiar credenciales en todas las plataformas
2. **Análisis**: Identificar alcance de la exposición
3. **Limpieza**: Eliminar credenciales del historial de Git
4. **Documentación**: Registrar incidente y lecciones aprendidas
5. **Prevención**: Implementar medidas para evitar recurrencia

### **Contactos de Emergencia:**

- **DevOps Lead**: [Contacto]
- **Security Team**: [Contacto]
- **Database Admin**: [Contacto]

---

**Documento creado:** 27 de Julio de 2025
**Última actualización:** 27 de Julio de 2025
**Próxima revisión:** 27 de Agosto de 2025
