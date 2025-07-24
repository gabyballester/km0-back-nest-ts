# Reglas del Proyecto - KM0 Market Backend

## 🚨 **REGLAS OBLIGATORIAS**

### ⚡ **1. Scripts Rápidos - USO OBLIGATORIO**

**✅ SIEMPRE usar en desarrollo diario:**

```bash
npm run test:fast    # Tests rápidos (~2.7s)
npm run lint         # Linting rápido (~1s)
npm run format       # Formatear (~0.5s)
npm run start:dev    # Servidor desarrollo
```

**❌ NUNCA usar en desarrollo diario:**

```bash
npm run test:cov     # Lento, solo para CI/CD
npm run test:e2e     # Lento, solo para CI/CD
npm run test:debug   # Muy lento, solo debugging
```

**📖 Documentación completa:** [docs/SCRIPTS.md](./SCRIPTS.md)

### 🏗️ **2. Arquitectura Modular + Clean Architecture**

**✅ Estructura obligatoria:**

```
src/
├── shared/           # Recursos compartidos
├── modules/          # Módulos de negocio
├── infrastructure/   # Capa de infraestructura
└── config/          # Configuración
```

**✅ Principios obligatorios:**

- Separación de responsabilidades
- Inyección de dependencias por interfaz
- No acceso directo a infraestructura desde presentación
- Tests para cada capa

**📖 Documentación completa:** [docs/ARCHITECTURE.md](./ARCHITECTURE.md)

### 🧪 **3. Testing - ConfigService Obligatorio**

**✅ SIEMPRE usar ConfigService:**

```typescript
// ✅ Bien
beforeEach(async () => {
  const module = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [() => ({ NODE_ENV: 'production' })],
      }),
    ],
    controllers: [MyController],
  }).compile();

  controller = module.get<MyController>(MyController);
  configService = module.get<ConfigService>(ConfigService);
});
```

**❌ NUNCA usar process.env:**

```typescript
// ❌ Mal
beforeEach(() => {
  process.env.NODE_ENV = 'production';
});
```

### 🔧 **4. Configuración - Variables de Entorno**

**✅ OBLIGATORIO:**

- Usar `ConfigService` en lugar de `process.env` en TODO el código
- `process.env` SOLO se permite en `src/config/env.config.ts`
- Validar con Zod en `env.schema.ts`
- Usar constantes centralizadas en `env.constants.ts`
- Documentar nuevas variables en `/docs`

**❌ PROHIBIDO:**

- Acceso directo a `process.env` en cualquier archivo excepto `env.config.ts`
- Variables hardcodeadas
- Configuración sin validación
- Uso de `process.env` en tests (usar ConfigService)

**✅ Ejemplos correctos:**

```typescript
// ✅ Bien - En cualquier archivo de la aplicación
constructor(private readonly configService: ConfigService) {}

getPort(): number {
  return this.configService.get<number>('PORT');
}

// ✅ Bien - En tests
beforeEach(async () => {
  const module = await Test.createTestingModule({
    imports: [ConfigModule.forRoot({
      load: [() => ({ PORT: 4000 })]
    })],
    controllers: [MyController],
  }).compile();

  controller = module.get<MyController>(MyController);
  configService = module.get<ConfigService>(ConfigService);
});
```

**❌ Ejemplos incorrectos:**

```typescript
// ❌ Mal - En cualquier archivo excepto env.config.ts
const port = process.env.PORT;

// ❌ Mal - En tests
beforeEach(() => {
  process.env.PORT = '4000';
});
```

### 📝 **5. TypeScript - Tipado Estricto**

**✅ OBLIGATORIO:**

- Tipado explícito en todas las funciones
- No usar `any` (excepto casos muy específicos)
- Interfaces para contratos de servicios
- Tipos de retorno explícitos

**❌ PROHIBIDO:**

- Variables sin tipar
- Uso de `any` sin justificación
- Tipos implícitos

### 🎯 **6. Naming Conventions**

**✅ OBLIGATORIO:**

- Nombres en inglés para código
- Documentación en español
- Nombres descriptivos y claros
- Variables no usadas con `_` prefix

**✅ Ejemplos:**

```typescript
// ✅ Bien
const _unusedVariable = 'value';
const userRepository: IUserRepository;
const createUserDto: CreateUserDto;

// ❌ Mal
const unused = 'value';
const repo: UserRepository;
const dto: any;
```

### 🛡️ **7. Calidad de Código**

**✅ OBLIGATORIO:**

- ESLint sin warnings
- Prettier para formato
- Tests pasando antes de commits
- Cobertura mínima: 80% statements, 75% functions

**❌ PROHIBIDO:**

- Commits con errores de linting
- Código sin formatear
- Tests fallando
- Cobertura insuficiente

### 📚 **8. Documentación**

**✅ OBLIGATORIO:**

- Documentar cambios importantes
- Mantener README actualizado
- Comentarios en código complejo
- Actualizar documentación de testing

**✅ Archivos de documentación:**

- `README.md` - Visión general
- `docs/SCRIPTS.md` - Scripts rápidos
- `docs/ARCHITECTURE.md` - Arquitectura
- `docs/TESTING.md` - Testing
- `docs/RULES.md` - Reglas del proyecto

### 🔄 **9. Flujo de Desarrollo**

**✅ OBLIGATORIO:**

1. **Desarrollo**: Usar scripts rápidos
2. **Pre-commit**: Tests rápidos + linting
3. **Pre-push**: Tests completos + e2e
4. **CI/CD**: Build + tests completos

**✅ Comandos diarios:**

```bash
# Desarrollo
npm run test:fast
npm run lint
npm run format
npm run start:dev

# Antes de commit
git add .
npm run test:fast
npm run lint
git commit -m "feat: descripción"
```

### 🚀 **10. Performance**

**✅ OBLIGATORIO:**

- Tests rápidos (< 3s)
- Linting rápido (< 1s)
- Build optimizado (< 5s)
- Startup rápido (< 3s)

**✅ Optimizaciones:**

- SWC para compilación
- Jest con maxWorkers
- ESLint con cache
- Prettier con cache

## 📋 **CHECKLIST DE DESARROLLO**

### Antes de cada commit

- [ ] `npm run test:fast` ✅
- [ ] `npm run lint` ✅
- [ ] `npm run format` ✅
- [ ] Cobertura suficiente ✅
- [ ] Documentación actualizada ✅

### Antes de cada push

- [ ] `npm run test:cov` ✅
- [ ] `npm run test:e2e` ✅
- [ ] Build exitoso ✅
- [ ] Reglas cumplidas ✅

### Antes de cada PR

- [ ] Tests completos ✅
- [ ] Documentación actualizada ✅
- [ ] Código revisado ✅
- [ ] Performance verificada ✅

## 🚨 **SANCIONES**

### Violaciones Graves

- **Uso de `npm run test:cov` en desarrollo** → Advertencia
- **Acceso directo a `process.env`** → Corrección obligatoria
- **Commits sin tests rápidos** → Rechazo de commit
- **Cobertura insuficiente** → Bloqueo de push

### Violaciones Menores

- **Código sin formatear** → Auto-corrección
- **Warnings de ESLint** → Corrección obligatoria
- **Documentación desactualizada** → Actualización requerida

## 📞 **SOPORTE**

### Dónde consultar

- **Scripts rápidos**: [docs/SCRIPTS.md](./SCRIPTS.md)
- **Arquitectura**: [docs/ARCHITECTURE.md](./ARCHITECTURE.md)
- **Testing**: [docs/TESTING.md](./TESTING.md)
- **Reglas generales**: Este archivo

### Contacto

- **Issues**: GitHub Issues
- **Discusiones**: GitHub Discussions
- **Documentación**: Carpeta `/docs`

---

**Estas reglas son OBLIGATORIAS y se aplican a todos los desarrolladores del proyecto.**
