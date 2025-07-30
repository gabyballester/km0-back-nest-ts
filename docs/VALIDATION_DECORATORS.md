# Decoradores de Validación - Documentación Completa

## 📋 **Descripción General**

Este documento describe todos los decoradores de validación personalizados disponibles en el proyecto, diseñados para garantizar **máxima seguridad y robustez** en todas las validaciones de datos.

## 🎯 **Principios de Diseño**

- ✅ **Centralización**: Todos los patrones regex están centralizados
- ✅ **Reutilización**: Decoradores reutilizables en cualquier DTO
- ✅ **Consistencia**: Validaciones uniformes en toda la aplicación
- ✅ **Seguridad**: Validaciones estrictas para datos sensibles
- ✅ **Documentación**: Swagger automático para todos los campos

---

## 🔐 **Decoradores de Seguridad**

### **Contraseñas**

#### `@IsValidPassword(required = true)`

Validación estándar de contraseña (mínimo 8 caracteres).

```typescript
@ApiPassword(true)
@IsValidPassword(true)
password: string;
```

#### `@IsStrongPassword(required = true)`

Validación de contraseña fuerte (mínimo 12 caracteres, carácter especial obligatorio).

```typescript
@ApiStrongPassword(true)
@IsStrongPassword(true)
password: string;
```

**Requisitos:**

- Mínimo 12 caracteres
- Al menos 1 mayúscula
- Al menos 1 minúscula
- Al menos 1 número
- Al menos 1 carácter especial (@$!%\*?&)

### **Autenticación**

#### `@IsValidJWT()`

Validación de token JWT.

```typescript
@ApiJWT()
@IsValidJWT()
token: string;
```

#### `@IsValidOTP()`

Validación de código de verificación (OTP).

```typescript
@ApiOTP()
@IsValidOTP()
otpCode: string;
```

---

## 🆔 **Decoradores de Identificación**

### **IDs y UUIDs**

#### `@IsValidUUID(required = true)`

Validación de UUID estándar.

```typescript
@ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
@IsValidUUID(true)
id: string;
```

#### `@IsValidDatabaseId(required = true)`

Validación de ID de base de datos (UUID o número entero positivo).

```typescript
@ApiDatabaseId(true)
@IsValidDatabaseId(true)
id: string;
```

---

## 📧 **Decoradores de Contacto**

### **Email**

#### `@IsValidEmail(required = true)`

Validación completa de email.

```typescript
@ApiEmail(true)
@IsValidEmail(true)
email: string;
```

### **Teléfono**

#### `@IsValidPhone()`

Validación de teléfono internacional.

```typescript
@ApiPhone()
@IsValidPhone()
phone?: string;
```

---

## 👤 **Decoradores de Usuario**

### **Nombres**

#### `@IsValidName(required = true)`

Validación de nombres (solo letras y espacios).

```typescript
@ApiName(true, 'nombre')
@IsValidName(true)
firstName: string;
```

### **Username**

#### `@IsValidUsername(required = true)`

Validación de nombre de usuario.

```typescript
@ApiProperty({ example: 'john_doe123' })
@IsValidUsername(true)
username: string;
```

### **Fecha de Nacimiento**

#### `@IsValidBirthDate()`

Validación de fecha de nacimiento.

```typescript
@ApiBirthDate()
@IsValidBirthDate()
birthDate?: string;
```

---

## 🌍 **Decoradores de Ubicación**

### **Código Postal**

#### `@IsValidPostalCode()`

Validación de código postal (formato US/EU).

```typescript
@ApiPostalCode()
@IsValidPostalCode()
postalCode?: string;
```

### **Ciudad**

#### `@IsValidCity()`

Validación de ciudad.

```typescript
@ApiCity()
@IsValidCity()
city?: string;
```

### **Código de País**

#### `@IsValidCountryCode()`

Validación de código de país ISO.

```typescript
@ApiCountryCode()
@IsValidCountryCode()
countryCode?: string;
```

### **Coordenadas**

#### `@IsValidCoordinates()`

Validación de coordenadas geográficas.

```typescript
@ApiCoordinates()
@IsValidCoordinates()
coordinates?: string;
```

---

## 💳 **Decoradores de Pagos**

### **Tarjeta de Crédito**

#### `@IsValidCreditCard()`

Validación básica de número de tarjeta.

```typescript
@ApiCreditCard()
@IsValidCreditCard()
cardNumber?: string;
```

#### `@IsValidCVV()`

Validación de código de seguridad.

```typescript
@ApiCVV()
@IsValidCVV()
cvv?: string;
```

#### `@IsValidCardExpiry()`

Validación de fecha de expiración.

```typescript
@ApiCardExpiry()
@IsValidCardExpiry()
expiryDate?: string;
```

---

## 🌐 **Decoradores de Red**

### **Dirección IP**

#### `@IsValidIPAddress()`

Validación de dirección IPv4.

```typescript
@ApiIPAddress()
@IsValidIPAddress()
ipAddress?: string;
```

### **Dirección MAC**

#### `@IsValidMACAddress()`

Validación de dirección MAC.

```typescript
@ApiMACAddress()
@IsValidMACAddress()
macAddress?: string;
```

---

## 🔗 **Decoradores de Enlaces**

### **URL**

#### `@IsValidURL()`

Validación de URL.

```typescript
@ApiProperty({ example: 'https://example.com' })
@IsValidURL()
url?: string;
```

---

## 💰 **Decoradores de Negocio**

### **Moneda**

#### `@IsValidCurrency()`

Validación de código de moneda ISO.

```typescript
@ApiCurrency()
@IsValidCurrency()
currency?: string;
```

### **Código de Descuento**

#### `@IsValidDiscountCode()`

Validación de código de descuento.

```typescript
@ApiDiscountCode()
@IsValidDiscountCode()
discountCode?: string;
```

---

## 🌐 **Decoradores de Internacionalización**

### **Idioma**

#### `@IsValidLanguage()`

Validación de código de idioma.

```typescript
@ApiLanguage()
@IsValidLanguage()
language?: string;
```

---

## 📝 **Decoradores de Swagger**

Todos los decoradores de validación tienen su correspondiente decorador de Swagger:

- `@ApiEmail(required)` - Documentación de email
- `@ApiPassword(required)` - Documentación de contraseña
- `@ApiStrongPassword(required)` - Documentación de contraseña fuerte
- `@ApiName(required, fieldName)` - Documentación de nombres
- `@ApiPhone()` - Documentación de teléfono
- `@ApiPostalCode()` - Documentación de código postal
- `@ApiCity()` - Documentación de ciudad
- `@ApiLanguage()` - Documentación de idioma
- `@ApiJWT()` - Documentación de token JWT
- `@ApiDatabaseId(required)` - Documentación de ID
- `@ApiIPAddress()` - Documentación de IP
- `@ApiMACAddress()` - Documentación de MAC
- `@ApiOTP()` - Documentación de OTP
- `@ApiBirthDate()` - Documentación de fecha de nacimiento
- `@ApiCountryCode()` - Documentación de código de país
- `@ApiCurrency()` - Documentación de moneda
- `@ApiCreditCard()` - Documentación de tarjeta
- `@ApiCVV()` - Documentación de CVV
- `@ApiCardExpiry()` - Documentación de expiración
- `@ApiDiscountCode()` - Documentación de descuento
- `@ApiCoordinates()` - Documentación de coordenadas

---

## 🚀 **Ejemplos de Uso**

### **DTO de Registro de Usuario (Alta Seguridad)**

```typescript
export class SecureUserRegistrationDto {
  @ApiEmail(true)
  @IsValidEmail(true)
  email: string;

  @ApiStrongPassword(true)
  @IsStrongPassword(true)
  password: string;

  @ApiName(true, 'nombre')
  @IsValidName(true)
  firstName: string;

  @ApiName(true, 'apellido')
  @IsValidName(true)
  lastName: string;

  @ApiPhone()
  @IsValidPhone()
  phone?: string;

  @ApiBirthDate()
  @IsValidBirthDate()
  birthDate?: string;

  @ApiCountryCode()
  @IsValidCountryCode()
  countryCode?: string;
}
```

### **DTO de Pago**

```typescript
export class PaymentDto {
  @ApiCreditCard()
  @IsValidCreditCard()
  cardNumber: string;

  @ApiCVV()
  @IsValidCVV()
  cvv: string;

  @ApiCardExpiry()
  @IsValidCardExpiry()
  expiryDate: string;

  @ApiCurrency()
  @IsValidCurrency()
  currency: string;
}
```

### **DTO de Verificación**

```typescript
export class VerificationDto {
  @ApiJWT()
  @IsValidJWT()
  token: string;

  @ApiOTP()
  @IsValidOTP()
  otpCode: string;

  @ApiIPAddress()
  @IsValidIPAddress()
  clientIP?: string;
}
```

---

## 🔧 **Configuración del Pipe de Validación**

El proyecto está configurado con un pipe de validación global en `main.ts`:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Elimina propiedades no permitidas
    forbidNonWhitelisted: true, // Rechaza requests con propiedades extra
    transform: true, // Transforma automáticamente tipos
    transformOptions: {
      enableImplicitConversion: true, // Conversión implícita de tipos
    },
  }),
);
```

---

## 📊 **Patrones Regex Centralizados**

Todos los patrones están definidos en `src/shared/constants/validation-class-validator.ts`:

```typescript
export const TEXT_VALIDATION_RULES = {
  // Patrones regex centralizados
  NAME_PATTERN: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  EMAIL_PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE_PATTERN: /^\+?[1-9]\d{1,14}$/,
  POSTAL_CODE_PATTERN: /^[0-9]{5}(-[0-9]{4})?$/,
  // ... más patrones
} as const;
```

---

## ✅ **Beneficios de Seguridad**

1. **Validación Estricta**: Todos los campos tienen validaciones robustas
2. **Prevención de Ataques**: Validación de formatos previene inyecciones
3. **Consistencia**: Mismas reglas en toda la aplicación
4. **Documentación Automática**: Swagger siempre actualizado
5. **Mantenibilidad**: Cambios centralizados en un lugar
6. **Reutilización**: Decoradores disponibles para cualquier DTO

---

## 🎯 **Mejores Prácticas**

1. **Siempre usar decoradores personalizados** en lugar de regex directos
2. **Combinar validación + documentación** con decoradores correspondientes
3. **Usar contraseñas fuertes** para datos sensibles
4. **Validar IDs** para prevenir inyecciones
5. **Documentar todos los campos** con decoradores de Swagger
6. **Mantener patrones centralizados** para consistencia

---

## 📚 **Referencias**

- [Class Validator Documentation](https://github.com/typestack/class-validator)
- [NestJS Validation](https://docs.nestjs.com/techniques/validation)
- [Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
