# 📊 Guía de Cobertura de Tests - Mejores Prácticas

## 🎯 **Principios Fundamentales**

### **¿Qué DEBE ser testeado?**

#### ✅ **Archivos que SÍ necesitan tests:**

1. **Lógica de Negocio**
   - Servicios con reglas de negocio complejas
   - Validaciones de datos
   - Transformaciones de datos
   - Cálculos y algoritmos

2. **Entidades y Modelos**
   - Clases con métodos y validaciones
   - Getters/setters con lógica
   - Métodos de transformación

3. **DTOs con Validaciones**
   - DTOs con decoradores de validación
   - Transformaciones de datos
   - Lógica de mapeo

4. **Utilidades y Helpers**
   - Funciones con lógica compleja
   - Validaciones
   - Transformaciones de datos

5. **Middleware con Lógica**
   - Middleware con validaciones
   - Transformaciones de requests/responses
   - Lógica de autenticación/autorización

#### ❌ **Archivos que NO necesitan tests:**

1. **Archivos de Configuración**
   - `main.ts` - Punto de entrada
   - `app.module.ts` - Configuración de módulos
   - `*.config.ts` - Archivos de configuración
   - `*.schema.ts` - Schemas de validación

2. **Archivos Declarativos**
   - Interfaces TypeScript
   - Tipos y enums
   - Constantes estáticas
   - Re-exports simples

3. **Archivos de Setup**
   - Health check endpoints básicos
   - Endpoints de configuración
   - Archivos de inicialización

4. **Archivos de Presentación (se testean en E2E)**
   - Controladores (se testean en E2E)
   - Middleware básico de logging
   - Guards simples

5. **Archivos de Infraestructura (se testean en integración)**
   - Repositorios (se testean en integración)
   - Adaptadores de base de datos
   - Schemas de base de datos

---

## 📋 **Configuración Recomendada**

### **Exclusiones de Cobertura**

```javascript
// jest.config.js
coveragePathIgnorePatterns: [
  // Archivos de configuración
  '/main.ts$',
  '/app.module.ts$',
  '/app.controller.ts$',
  '/app.service.ts$',
  '/env.config.ts$',
  '/env.schema.ts$',

  // Health check (endpoints básicos)
  '/health/',

  // Archivos de base de datos
  '/infrastructure/database/database.module.ts$',
  '/infrastructure/database/prisma.service.ts$',
  '/infrastructure/database/interfaces/',
  '/infrastructure/database/adapters/',
  '/infrastructure/database/schemas/',
  '/infrastructure/database/factory/',

  // Archivos de presentación (se testean en E2E)
  '/modules/*/presentation/',

  // Archivos de repositorios (se testean en integración)
  '/modules/*/infrastructure/repositories/',

  // Constantes y tipos
  '/shared/constants/',
  '/shared/types/',

  // Archivos de ejemplo
  '/modules/example/',

  // Archivos de build
  '/dist/',
  '/node_modules/',
],
```

### **Umbrales Recomendados**

```javascript
coverageThreshold: {
  global: {
    branches: 80,    // Decisiones condicionales
    functions: 90,   // Funciones ejecutadas
    lines: 90,       // Líneas de código
    statements: 90,  // Declaraciones ejecutadas
  },
},
```

---

## 🔍 **Criterios de Decisión**

### **¿Testear o No Testear?**

#### **SÍ testear si el archivo:**

1. **Contiene lógica de negocio**

   ```typescript
   // ✅ Testear - Lógica de validación
   export class UserService {
     validateUser(user: User): boolean {
       return user.email.includes('@') && user.age > 18;
     }
   }
   ```

2. **Tiene múltiples caminos de ejecución**

   ```typescript
   // ✅ Testear - Diferentes ramas
   export function calculateDiscount(amount: number, isVIP: boolean): number {
     if (isVIP) return amount * 0.8;
     if (amount > 100) return amount * 0.9;
     return amount;
   }
   ```

3. **Interactúa con servicios externos**

   ```typescript
   // ✅ Testear - Con mocks
   export class EmailService {
     async sendEmail(to: string, subject: string): Promise<void> {
       // Lógica de envío
     }
   }
   ```

4. **Transforma datos**

   ```typescript
   // ✅ Testear - Transformaciones
   export function mapUserToDTO(user: User): UserDTO {
     return {
       id: user.id,
       fullName: `${user.firstName} ${user.lastName}`,
       isActive: user.status === 'active',
     };
   }
   ```

#### **NO testear si el archivo:**

1. **Solo contiene constantes**

   ```typescript
   // ❌ No testear - Solo constantes
   export const API_ENDPOINTS = {
     USERS: '/api/users',
     PRODUCTS: '/api/products',
   };
   ```

2. **Es un wrapper simple**

   ```typescript
   // ❌ No testear - Wrapper simple
   export class ConfigService {
     get(key: string): string {
       return process.env[key];
     }
   }
   ```

3. **Solo re-exporta otros módulos**

   ```typescript
   // ❌ No testear - Re-exports
   export { UserService } from './user.service';
   export { ProductService } from './product.service';
   ```

4. **No tiene lógica propia**

   ```typescript
   // ❌ No testear - Solo configuración
   @Module({
     imports: [DatabaseModule],
     providers: [UserService],
     exports: [UserService],
   })
   export class UserModule {}
   ```

---

## 📊 **Estrategia de Testing por Capas**

### **1. Tests Unitarios**

- **Qué testear**: Lógica de negocio, servicios, utilidades
- **Cobertura objetivo**: 90%+ statements, 80%+ branches
- **Archivos incluidos**: Services, DTOs, Entities, Utils

### **2. Tests de Integración**

- **Qué testear**: Repositorios, adaptadores de base de datos
- **Cobertura objetivo**: 85%+ statements, 75%+ branches
- **Archivos incluidos**: Repositories, Database adapters

### **3. Tests E2E**

- **Qué testear**: Endpoints, flujos completos
- **Cobertura objetivo**: 70%+ statements
- **Archivos incluidos**: Controllers, Middleware

---

## 🎯 **Mejores Prácticas de la Comunidad**

### **1. Enfoque en Valor**

- **Priorizar**: Lógica de negocio crítica
- **Evitar**: Tests de configuración y setup
- **Balance**: Cobertura útil vs. tiempo de desarrollo

### **2. Exclusión Inteligente**

- **Configuración**: Excluir archivos puramente declarativos
- **Presentación**: Testear en E2E, no en unitarios
- **Infraestructura**: Testear en integración

### **3. Umbrales Realistas**

- **Statements**: 90% (cubre la mayoría del código)
- **Branches**: 80% (cubre decisiones importantes)
- **Functions**: 90% (cubre funcionalidad)
- **Lines**: 90% (cubre líneas ejecutadas)

### **4. Documentación Clara**

- **Justificar**: Por qué se excluyen archivos
- **Documentar**: Estrategia de testing
- **Mantener**: Lista actualizada de exclusiones

---

## 📈 **Métricas de Calidad**

### **Indicadores de Éxito**

- **Cobertura real**: >90% en archivos testeados
- **Tiempo de tests**: <5 segundos para unitarios
- **Mantenibilidad**: Tests fáciles de entender y mantener
- **Valor**: Tests que detectan regresiones reales

### **Señales de Alerta**

- **Cobertura artificial**: Incluir archivos sin lógica
- **Tests frágiles**: Tests que fallan por cambios menores
- **Tiempo excesivo**: Tests que tardan demasiado
- **Falsos positivos**: Tests que no detectan problemas reales

---

## 🔧 **Configuración de Ejemplo**

### **Jest Config Optimizado**

```javascript
module.exports = {
  // Configuración de cobertura
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coveragePathIgnorePatterns: [
    // Archivos de configuración
    '/main.ts$',
    '/app.module.ts$',
    '/env.config.ts$',

    // Health check
    '/health/',

    // Infraestructura (se testea en integración)
    '/infrastructure/database/',

    // Presentación (se testea en E2E)
    '/modules/*/presentation/',

    // Constantes
    '/shared/constants/',

    // Build
    '/dist/',
    '/node_modules/',
  ],

  // Umbrales realistas
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },

  // Optimizaciones de velocidad
  maxWorkers: '50%',
  testTimeout: 5000,
  cache: true,
};
```

---

## 📚 **Referencias**

### **Documentación Oficial**

- [Jest Configuration](https://jestjs.io/docs/configuration)
- [Jest Coverage](https://jestjs.io/docs/configuration#collectcoveragefrom-array)
- [Jest Coverage Threshold](https://jestjs.io/docs/configuration#coveragethreshold-object)

### **Mejores Prácticas de la Comunidad**

- [Testing Best Practices](https://github.com/jestjs/jest#readme)
- [Coverage Guidelines](https://github.com/jestjs/jest/issues?q=coverage)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)

---

**Última actualización**: Julio 2024
**Versión**: 1.0.0
**Mantenido por**: Equipo de desarrollo
