# Swagger Documentation - KM0 Market Backend

## 🌐 **DOCUMENTACIÓN DE API**

### **Acceso a Swagger UI**

- **Desarrollo:** `http://localhost:4000/api`
- **Producción:** `https://km0-market.onrender.com/api`

### **Configuración de Swagger**

La documentación de API está configurada en `src/main.ts` con las siguientes características:

```typescript
const config = new DocumentBuilder()
  .setTitle('KM0 Market API')
  .setDescription(
    'API para el marketplace KM0 - Conectando productores locales con consumidores',
  )
  .setVersion('1.0')
  .addTag('health', 'Endpoints de monitoreo y health checks')
  .addTag('auth', 'Autenticación y autorización')
  .addTag('users', 'Gestión de usuarios')
  .addTag('products', 'Gestión de productos')
  .addTag('orders', 'Gestión de pedidos')
  .addServer(`http://localhost:${port}`, 'Servidor de desarrollo')
  .addServer('https://km0-market.onrender.com', 'Servidor de producción')
  .build();
```

### **Características de Swagger UI**

- **Persistencia de autorización:** Las credenciales se mantienen entre sesiones
- **Expansión de documentos:** Configurada como 'none' para mejor organización
- **Filtros:** Búsqueda y filtrado de endpoints
- **Duración de requests:** Muestra el tiempo de respuesta
- **Título personalizado:** "KM0 Market API Documentation"

## 📋 **ENDPOINTS DOCUMENTADOS**

### **🏥 Health Endpoints**

#### **GET /health**

- **Descripción:** Health check básico de la aplicación
- **Respuesta 200:** Aplicación saludable
- **Respuesta 503:** Aplicación no saludable
- **Documentación:** Completamente documentada con ejemplos

#### **GET /health/detailed**

- **Descripción:** Health check detallado con información del sistema
- **Incluye:**
  - Estado de la base de datos
  - Información del sistema (memoria, CPU)
  - Versión de Node.js y plataforma
  - Estado de servicios críticos

### **🔐 Auth Endpoints** _(Pendiente de implementación)_

- **POST /auth/login**
- **POST /auth/register**
- **POST /auth/logout**
- **GET /auth/profile**

### **👥 Users Endpoints** _(Pendiente de implementación)_

- **GET /users**
- **GET /users/:id**
- **POST /users**
- **PUT /users/:id**
- **DELETE /users/:id**

### **🛍️ Products Endpoints** _(Pendiente de implementación)_

- **GET /products**
- **GET /products/:id**
- **POST /products**
- **PUT /products/:id**
- **DELETE /products/:id**

### **📦 Orders Endpoints** _(Pendiente de implementación)_

- **GET /orders**
- **GET /orders/:id**
- **POST /orders**
- **PUT /orders/:id**
- **DELETE /orders/:id**

## 🎯 **DECORADORES DE SWAGGER**

### **Decoradores Utilizados**

```typescript
@ApiTags('health')                    // Agrupa endpoints por categoría
@ApiOperation({                       // Describe la operación
  summary: 'Health Check Básico',
  description: 'Verifica el estado básico...'
})
@ApiResponse({                        // Documenta respuestas exitosas
  status: 200,
  description: 'Aplicación saludable',
  schema: { /* esquema de respuesta */ }
})
@ApiInternalServerErrorResponse({     // Documenta errores
  description: 'Error interno del servidor'
})
```

### **Ejemplo de Implementación**

```typescript
@Get()
@ApiOperation({
  summary: 'Health Check Básico',
  description: 'Verifica el estado básico de la aplicación y la conexión a la base de datos',
})
@ApiResponse({
  status: 200,
  description: 'Aplicación saludable',
  schema: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'healthy' },
      timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
      environment: { type: 'string', example: 'production' },
      uptime: { type: 'number', example: 123.456 },
    },
  },
})
getHealth(): HealthResponse {
  // Implementación del endpoint
}
```

## 🛠️ **CONFIGURACIÓN TÉCNICA**

### **Dependencias**

```json
{
  "@nestjs/swagger": "^11.2.0",
  "swagger-ui-express": "^5.0.1"
}
```

### **Setup en main.ts**

```typescript
// Configurar Swagger
const config = new DocumentBuilder()
  .setTitle('KM0 Market API')
  .setDescription('API para el marketplace KM0...')
  .setVersion('1.0')
  .addTag('health', 'Endpoints de monitoreo y health checks')
  .addServer(`http://localhost:${port}`, 'Servidor de desarrollo')
  .addServer('https://km0-market.onrender.com', 'Servidor de producción')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document, {
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'none',
    filter: true,
    showRequestDuration: true,
  },
  customSiteTitle: 'KM0 Market API Documentation',
});
```

## 📊 **ESTADO ACTUAL**

### **✅ Implementado**

- **Configuración completa** de Swagger
- **Documentación de health endpoints** con ejemplos
- **Esquemas de respuesta** detallados
- **Servidores configurados** (desarrollo y producción)
- **UI personalizada** con características avanzadas

### **🔄 Pendiente**

- **Documentación de auth endpoints** (cuando se implementen)
- **Documentación de users endpoints** (cuando se implementen)
- **Documentación de products endpoints** (cuando se implementen)
- **Documentación de orders endpoints** (cuando se implementen)

## 🎯 **MEJORES PRÁCTICAS**

### **✅ Documentación Obligatoria**

- **Todos los endpoints** deben estar documentados en Swagger
- **Esquemas de respuesta** detallados con ejemplos
- **Códigos de error** documentados
- **Descripciones claras** y útiles

### **✅ Organización**

- **Tags** para agrupar endpoints relacionados
- **Versiones** para control de cambios
- **Servidores** para diferentes entornos
- **Ejemplos** realistas de uso

### **✅ Mantenimiento**

- **Documentación actualizada** con cada cambio
- **Tests alineados** con la documentación
- **Validación automática** en CI/CD
- **Revisión en code reviews**
