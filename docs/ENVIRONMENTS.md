# Entornos en NestJS - Guía Completa

## 📋 Resumen

Este documento describe cómo configurar y usar los diferentes entornos (development, production, test) en nuestra aplicación NestJS, incluyendo la visualización del entorno actual por consola.

## 🎯 Objetivos

- Configurar 3 entornos: `development`, `production`, `test`
- Mostrar información clara del entorno por consola
- Validar variables de entorno con Zod
- Proporcionar scripts de inicio específicos por entorno
- Crear un logger personalizado para información del entorno

## 🚀 Scripts Disponibles

### Scripts de Inicio por Entorno

```bash
# Desarrollo (con hot reload)
npm run start:dev

# Producción (desde build)
npm run start:prod

# Test (para testing)
npm run start:test

# Debug (desarrollo con debug)
npm run start:debug
```

### Scripts de Información de Entorno

```bash
# Verificar entorno actual
npm run env:info

# Verificar entorno específico
npm run env:dev
npm run env:test
npm run env:prod

# Probar todos los entornos
npm run test:environments
```

## 🔧 Configuración de Entornos

### Variables de Entorno Requeridas

```env
NODE_ENV=development|production|test
PORT=4000|4001
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

### Configuración por Entorno

#### Development

- Hot reload habilitado
- Logging verbose
- Debug mode activo
- Source maps habilitados

#### Production

- Performance optimizada
- Seguridad mejorada
- Logging mínimo
- Error tracking habilitado

#### Test

- Base de datos de test
- Logging suprimido
- Ejecución rápida
- Servicios mock activos

## 📊 Salida por Consola

### Al Iniciar la Aplicación

```
🎯 ========================================
🚀 NESTJS APPLICATION STARTUP
========================================
🌍 Environment: DEVELOPMENT
📅 Timestamp: 2024-01-15T10:30:00.000Z
🔄 Process ID: 12345
📦 Node Version: v18.17.0
💻 Platform: win32 (x64)
========================================

🔧 DEVELOPMENT MODE
   • Hot reload enabled
   • Verbose logging
   • Debug mode active
   • Source maps enabled

✅ ========================================
🚀 APPLICATION STARTED SUCCESSFULLY
========================================
🌐 Server: http://localhost:3000
🌍 Environment: DEVELOPMENT
📊 Health: http://localhost:3000/health
📚 API Docs: http://localhost:3000/api
========================================
```

## 🛠️ Implementación Técnica

### 1. Configuración de Entorno (`src/config/env.config.ts`)

```typescript
import { registerAs } from '@nestjs/config';
import { z } from 'zod';

// Schema de validación
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
});

// Validación y logging automático
export const validateEnv = () => {
  const env = envSchema.parse(process.env);

  console.log('🚀 ========================================');
  console.log(`🌍 Environment: ${env.NODE_ENV.toUpperCase()}`);
  console.log(`🔧 Port: ${env.PORT}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log('========================================');

  return env;
};
```

### 2. Logger Personalizado (`src/shared/utils/environment-logger.ts`)

```typescript
export class EnvironmentLogger extends Logger {
  logEnvironmentInfo(): void {
    // Muestra información detallada del entorno
    console.log('🎯 ========================================');
    console.log('🚀 NESTJS APPLICATION STARTUP');
    console.log(`🌍 Environment: ${this.environment.toUpperCase()}`);
    // ... más información
  }
}
```

### 3. Main.ts Configurado

```typescript
async function bootstrap() {
  const envLogger = EnvironmentLogger.getInstance();

  try {
    envLogger.logEnvironmentInfo();
    const app = await NestFactory.create(AppModule);
    const port = configService.get<number>('env.port', 3000);
    await app.listen(port);
    envLogger.logApplicationStart(port);
  } catch (error) {
    envLogger.logStartupError(error as Error);
    process.exit(1);
  }
}
```

## 🧪 Testing de Entornos

### Script de Prueba Automatizada

```bash
npm run test:environments
```

Este script:

1. Prueba cada entorno individualmente
2. Verifica la información mostrada por consola
3. Valida que los comandos de inicio funcionen
4. Muestra un resumen de los resultados

### Verificación Manual

```bash
# Verificar entorno actual
npm run env:info

# Verificar entorno específico
npm run env:dev
npm run env:test
npm run env:prod
```

## 🔍 Troubleshooting

### Problemas Comunes

1. **NODE_ENV no definido**

   ```bash
   # Solución: Usar cross-env
   cross-env NODE_ENV=development npm run start
   ```

2. **Variables de entorno faltantes**

   ```bash
   # Verificar con el script de validación
   npm run check:process-env
   ```

3. **Puerto ocupado**

   ```bash
   # Cambiar puerto en .env
   PORT=4001
   ```

### Logs de Error

Si la aplicación falla al iniciar, verás:

```
❌ ========================================
💥 APPLICATION STARTUP FAILED
========================================
🌍 Environment: DEVELOPMENT
📅 Timestamp: 2024-01-15T10:30:00.000Z
❌ Error: Environment validation failed
📚 Stack: [stack trace]
========================================
```

## 📚 Referencias

- [NestJS Configuration](https://docs.nestjs.com/techniques/configuration)
- [Zod Validation](https://zod.dev/)
- [Cross-env](https://www.npmjs.com/package/cross-env)
- [Node.js Environment Variables](https://nodejs.org/api/process.html#processenv)

## 🔄 Mantenimiento

### Actualizar Configuración

1. Modificar `src/config/env.config.ts` para nuevas variables
2. Actualizar `env.schema.ts` si es necesario
3. Probar con `npm run test:environments`
4. Actualizar esta documentación

### Agregar Nuevos Entornos

1. Agregar el entorno al schema de Zod
2. Actualizar el EnvironmentLogger
3. Crear scripts específicos en package.json
4. Actualizar la documentación

---

**Última actualización**: Julio 2024
**Versión**: 2.0.0
