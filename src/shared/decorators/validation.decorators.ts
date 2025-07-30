import { applyDecorators } from '@nestjs/common';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  TEXT_VALIDATION_RULES,
  VALIDATION_MESSAGES,
  LANGUAGE_OPTIONS,
} from '@/shared/constants/validation-class-validator';

/**
 * Decoradores de validación personalizados
 * Centraliza la lógica de validación para reutilización
 */

/**
 * Decorador para validar email
 */
export function IsValidEmail(required = true) {
  const decorators = [
    IsEmail({}, { message: VALIDATION_MESSAGES.INVALID_EMAIL }),
    MaxLength(TEXT_VALIDATION_RULES.MAX_EMAIL_LENGTH, {
      message: VALIDATION_MESSAGES.EMAIL_TOO_LONG,
    }),
  ];

  if (required) {
    decorators.unshift(
      IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED_EMAIL }),
    );
  } else {
    decorators.unshift(IsOptional());
  }

  return applyDecorators(...decorators);
}

/**
 * Decorador para validar contraseña
 */
export function IsValidPassword(required = true) {
  const decorators = [
    IsString({ message: 'La contraseña debe ser una cadena de texto' }),
    MinLength(TEXT_VALIDATION_RULES.MIN_PASSWORD_LENGTH, {
      message: VALIDATION_MESSAGES.PASSWORD_TOO_SHORT,
    }),
    MaxLength(TEXT_VALIDATION_RULES.MAX_PASSWORD_LENGTH, {
      message: VALIDATION_MESSAGES.PASSWORD_TOO_LONG,
    }),
    Matches(TEXT_VALIDATION_RULES.PASSWORD_PATTERN, {
      message: VALIDATION_MESSAGES.PASSWORD_PATTERN,
    }),
  ];

  if (required) {
    decorators.unshift(
      IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED_PASSWORD }),
    );
  } else {
    decorators.unshift(IsOptional());
  }

  return applyDecorators(...decorators);
}

/**
 * Decorador para validar nombres (firstName, lastName)
 */
export function IsValidName(required = true) {
  const decorators = [
    IsString({ message: 'Debe ser una cadena de texto' }),
    MinLength(TEXT_VALIDATION_RULES.MIN_NAME_LENGTH, {
      message: VALIDATION_MESSAGES.NAME_TOO_SHORT,
    }),
    MaxLength(TEXT_VALIDATION_RULES.MAX_NAME_LENGTH, {
      message: VALIDATION_MESSAGES.NAME_TOO_LONG,
    }),
    Matches(TEXT_VALIDATION_RULES.NAME_PATTERN, {
      message: VALIDATION_MESSAGES.NAME_PATTERN,
    }),
  ];

  if (required) {
    decorators.unshift(IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED }));
  } else {
    decorators.unshift(IsOptional());
  }

  return applyDecorators(...decorators);
}

/**
 * Decorador para validar teléfono
 */
export function IsValidPhone() {
  return applyDecorators(
    IsOptional(),
    IsString({ message: 'El teléfono debe ser una cadena de texto' }),
    MaxLength(TEXT_VALIDATION_RULES.MAX_PHONE_LENGTH, {
      message: VALIDATION_MESSAGES.PHONE_TOO_LONG,
    }),
    Matches(TEXT_VALIDATION_RULES.PHONE_PATTERN, {
      message: VALIDATION_MESSAGES.INVALID_PHONE,
    }),
  );
}

/**
 * Decorador para validar código postal
 */
export function IsValidPostalCode() {
  return applyDecorators(
    IsOptional(),
    IsString({ message: 'El código postal debe ser una cadena de texto' }),
    MaxLength(TEXT_VALIDATION_RULES.MAX_POSTAL_CODE_LENGTH, {
      message: VALIDATION_MESSAGES.POSTAL_CODE_TOO_LONG,
    }),
    Matches(TEXT_VALIDATION_RULES.POSTAL_CODE_PATTERN, {
      message: VALIDATION_MESSAGES.INVALID_POSTAL_CODE,
    }),
  );
}

/**
 * Decorador para validar ciudad
 */
export function IsValidCity() {
  return applyDecorators(
    IsOptional(),
    IsString({ message: 'La ciudad debe ser una cadena de texto' }),
    MaxLength(TEXT_VALIDATION_RULES.MAX_CITY_LENGTH, {
      message: VALIDATION_MESSAGES.CITY_TOO_LONG,
    }),
  );
}

/**
 * Decorador para validar idioma
 */
export function IsValidLanguage() {
  return applyDecorators(
    IsOptional(),
    IsEnum(LANGUAGE_OPTIONS, {
      message: VALIDATION_MESSAGES.INVALID_LANGUAGE,
    }),
  );
}

/**
 * Decorador para validar UUID
 */
export function IsValidUUID(required = true) {
  const decorators = [
    IsString({ message: 'Debe ser una cadena de texto' }),
    Matches(TEXT_VALIDATION_RULES.UUID_PATTERN, {
      message: 'Debe ser un UUID válido',
    }),
  ];

  if (required) {
    decorators.unshift(IsNotEmpty({ message: 'Este campo es requerido' }));
  } else {
    decorators.unshift(IsOptional());
  }

  return applyDecorators(...decorators);
}

/**
 * Decorador para validar URL
 */
export function IsValidURL() {
  return applyDecorators(
    IsOptional(),
    IsString({ message: 'Debe ser una cadena de texto' }),
    Matches(TEXT_VALIDATION_RULES.URL_PATTERN, {
      message: 'Debe ser una URL válida',
    }),
  );
}

/**
 * Decorador para validar username
 */
export function IsValidUsername(required = true) {
  const decorators = [
    IsString({ message: 'El username debe ser una cadena de texto' }),
    MinLength(TEXT_VALIDATION_RULES.MIN_USERNAME_LENGTH, {
      message: `El username debe tener al menos ${TEXT_VALIDATION_RULES.MIN_USERNAME_LENGTH} caracteres`,
    }),
    MaxLength(TEXT_VALIDATION_RULES.MAX_USERNAME_LENGTH, {
      message: `El username no puede tener más de ${TEXT_VALIDATION_RULES.MAX_USERNAME_LENGTH} caracteres`,
    }),
    Matches(TEXT_VALIDATION_RULES.USERNAME_PATTERN, {
      message:
        'El username solo puede contener letras, números y guiones bajos',
    }),
  ];

  if (required) {
    decorators.unshift(IsNotEmpty({ message: 'El username es requerido' }));
  } else {
    decorators.unshift(IsOptional());
  }

  return applyDecorators(...decorators);
}

/**
 * Decoradores de Swagger personalizados
 */

/**
 * Decorador de Swagger para email
 */
export function ApiEmail(required = true) {
  return required
    ? ApiProperty({
        description: 'Email del usuario',
        example: 'usuario@ejemplo.com',
      })
    : ApiPropertyOptional({
        description: 'Email del usuario',
        example: 'usuario@ejemplo.com',
      });
}

/**
 * Decorador de Swagger para contraseña
 */
export function ApiPassword(required = true) {
  return required
    ? ApiProperty({
        description:
          'Contraseña del usuario (mínimo 8 caracteres, debe incluir mayúscula, minúscula y número)',
        example: 'Password123',
        minLength: TEXT_VALIDATION_RULES.MIN_PASSWORD_LENGTH,
      })
    : ApiPropertyOptional({
        description:
          'Contraseña del usuario (mínimo 8 caracteres, debe incluir mayúscula, minúscula y número)',
        example: 'Password123',
        minLength: TEXT_VALIDATION_RULES.MIN_PASSWORD_LENGTH,
      });
}

/**
 * Decorador de Swagger para nombre
 */
export function ApiName(required = true, fieldName = 'nombre') {
  return required
    ? ApiProperty({
        description: `${fieldName} del usuario`,
        example: 'John',
        maxLength: TEXT_VALIDATION_RULES.MAX_NAME_LENGTH,
      })
    : ApiPropertyOptional({
        description: `${fieldName} del usuario`,
        example: 'John',
        maxLength: TEXT_VALIDATION_RULES.MAX_NAME_LENGTH,
      });
}

/**
 * Decorador de Swagger para teléfono
 */
export function ApiPhone() {
  return ApiPropertyOptional({
    description: 'Número de teléfono del usuario',
    example: '+1234567890',
    maxLength: TEXT_VALIDATION_RULES.MAX_PHONE_LENGTH,
  });
}

/**
 * Decorador de Swagger para código postal
 */
export function ApiPostalCode() {
  return ApiPropertyOptional({
    description: 'Código postal del usuario',
    example: '28001',
    maxLength: TEXT_VALIDATION_RULES.MAX_POSTAL_CODE_LENGTH,
  });
}

/**
 * Decorador de Swagger para ciudad
 */
export function ApiCity() {
  return ApiPropertyOptional({
    description: 'Ciudad del usuario',
    example: 'Madrid',
    maxLength: TEXT_VALIDATION_RULES.MAX_CITY_LENGTH,
  });
}

/**
 * Decorador de Swagger para idioma
 */
export function ApiLanguage() {
  return ApiPropertyOptional({
    description: 'Idioma preferido del usuario',
    example: 'es',
    default: 'es',
    enum: LANGUAGE_OPTIONS,
  });
}

/**
 * Decoradores de seguridad y robustez adicionales
 */

/**
 * Decorador para validar contraseña fuerte (alta seguridad)
 */
export function IsStrongPassword(required = true) {
  const decorators = [
    IsString({ message: 'La contraseña debe ser una cadena de texto' }),
    MinLength(12, {
      message: 'La contraseña debe tener al menos 12 caracteres',
    }),
    MaxLength(TEXT_VALIDATION_RULES.MAX_PASSWORD_LENGTH, {
      message: VALIDATION_MESSAGES.PASSWORD_TOO_LONG,
    }),
    // Patrón más estricto: mayúscula, minúscula, número, carácter especial
    Matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
      {
        message:
          'La contraseña debe incluir al menos una minúscula, una mayúscula, un número y un carácter especial',
      },
    ),
  ];

  if (required) {
    decorators.unshift(
      IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED_PASSWORD }),
    );
  } else {
    decorators.unshift(IsOptional());
  }

  return applyDecorators(...decorators);
}

/**
 * Decorador para validar token JWT
 */
export function IsValidJWT() {
  return applyDecorators(
    IsNotEmpty({ message: 'El token JWT es requerido' }),
    IsString({ message: 'El token debe ser una cadena de texto' }),
    Matches(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, {
      message: 'El token JWT debe tener un formato válido',
    }),
  );
}

/**
 * Decorador para validar ID de base de datos (UUID o número)
 */
export function IsValidDatabaseId(required = true) {
  const decorators = [
    IsString({ message: 'El ID debe ser una cadena de texto' }),
    // Acepta UUID o números enteros positivos
    Matches(
      /^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|[1-9]\d*)$/i,
      {
        message: 'El ID debe ser un UUID válido o un número entero positivo',
      },
    ),
  ];

  if (required) {
    decorators.unshift(IsNotEmpty({ message: 'El ID es requerido' }));
  } else {
    decorators.unshift(IsOptional());
  }

  return applyDecorators(...decorators);
}

/**
 * Decorador para validar IP address
 */
export function IsValidIPAddress() {
  return applyDecorators(
    IsOptional(),
    IsString({ message: 'La dirección IP debe ser una cadena de texto' }),
    Matches(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      {
        message: 'La dirección IP debe tener un formato válido (IPv4)',
      },
    ),
  );
}

/**
 * Decorador para validar MAC address
 */
export function IsValidMACAddress() {
  return applyDecorators(
    IsOptional(),
    IsString({ message: 'La dirección MAC debe ser una cadena de texto' }),
    Matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, {
      message: 'La dirección MAC debe tener un formato válido',
    }),
  );
}

/**
 * Decorador para validar código de verificación (OTP)
 */
export function IsValidOTP() {
  return applyDecorators(
    IsNotEmpty({ message: 'El código de verificación es requerido' }),
    IsString({ message: 'El código debe ser una cadena de texto' }),
    MinLength(4, { message: 'El código debe tener al menos 4 dígitos' }),
    MaxLength(8, { message: 'El código no puede tener más de 8 dígitos' }),
    Matches(/^[0-9]+$/, {
      message: 'El código solo puede contener números',
    }),
  );
}

/**
 * Decorador para validar fecha de nacimiento
 */
export function IsValidBirthDate() {
  return applyDecorators(
    IsOptional(),
    IsString({ message: 'La fecha debe ser una cadena de texto' }),
    Matches(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'La fecha debe tener formato YYYY-MM-DD',
    }),
  );
}

/**
 * Decorador para validar código de país ISO
 */
export function IsValidCountryCode() {
  return applyDecorators(
    IsOptional(),
    IsString({ message: 'El código de país debe ser una cadena de texto' }),
    MinLength(2, { message: 'El código debe tener 2 caracteres' }),
    MaxLength(3, { message: 'El código debe tener 3 caracteres' }),
    Matches(/^[A-Z]{2,3}$/, {
      message: 'El código debe contener solo letras mayúsculas',
    }),
  );
}

/**
 * Decorador para validar moneda ISO
 */
export function IsValidCurrency() {
  return applyDecorators(
    IsOptional(),
    IsString({ message: 'El código de moneda debe ser una cadena de texto' }),
    MinLength(3, { message: 'El código debe tener 3 caracteres' }),
    MaxLength(3, { message: 'El código debe tener 3 caracteres' }),
    Matches(/^[A-Z]{3}$/, {
      message: 'El código debe contener exactamente 3 letras mayúsculas',
    }),
  );
}

/**
 * Decorador para validar número de tarjeta de crédito (formato básico)
 */
export function IsValidCreditCard() {
  return applyDecorators(
    IsOptional(),
    IsString({ message: 'El número de tarjeta debe ser una cadena de texto' }),
    Matches(/^[0-9]{13,19}$/, {
      message: 'El número de tarjeta debe tener entre 13 y 19 dígitos',
    }),
  );
}

/**
 * Decorador para validar CVV
 */
export function IsValidCVV() {
  return applyDecorators(
    IsOptional(),
    IsString({ message: 'El CVV debe ser una cadena de texto' }),
    MinLength(3, { message: 'El CVV debe tener al menos 3 dígitos' }),
    MaxLength(4, { message: 'El CVV no puede tener más de 4 dígitos' }),
    Matches(/^[0-9]+$/, {
      message: 'El CVV solo puede contener números',
    }),
  );
}

/**
 * Decorador para validar fecha de expiración de tarjeta
 */
export function IsValidCardExpiry() {
  return applyDecorators(
    IsOptional(),
    IsString({
      message: 'La fecha de expiración debe ser una cadena de texto',
    }),
    Matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, {
      message: 'La fecha debe tener formato MM/YY',
    }),
  );
}

/**
 * Decorador para validar código de descuento
 */
export function IsValidDiscountCode() {
  return applyDecorators(
    IsOptional(),
    IsString({
      message: 'El código de descuento debe ser una cadena de texto',
    }),
    MinLength(3, { message: 'El código debe tener al menos 3 caracteres' }),
    MaxLength(20, { message: 'El código no puede tener más de 20 caracteres' }),
    Matches(/^[A-Z0-9_-]+$/, {
      message:
        'El código solo puede contener letras mayúsculas, números, guiones y guiones bajos',
    }),
  );
}

/**
 * Decorador para validar coordenadas geográficas
 */
export function IsValidCoordinates() {
  return applyDecorators(
    IsOptional(),
    IsString({ message: 'Las coordenadas deben ser una cadena de texto' }),
    Matches(
      /^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?),\s*-?((1[0-7][0-9]|[1-9]?[0-9])(\.[0-9]+)?|180(\.0+)?)$/,
      {
        message:
          'Las coordenadas deben tener formato válido (latitud,longitud)',
      },
    ),
  );
}

/**
 * Decoradores de Swagger para seguridad y robustez
 */

/**
 * Decorador de Swagger para contraseña fuerte
 */
export function ApiStrongPassword(required = true) {
  return required
    ? ApiProperty({
        description:
          'Contraseña fuerte del usuario (mínimo 12 caracteres, debe incluir mayúscula, minúscula, número y carácter especial)',
        example: 'StrongP@ssw0rd123',
        minLength: 12,
      })
    : ApiPropertyOptional({
        description:
          'Contraseña fuerte del usuario (mínimo 12 caracteres, debe incluir mayúscula, minúscula, número y carácter especial)',
        example: 'StrongP@ssw0rd123',
        minLength: 12,
      });
}

/**
 * Decorador de Swagger para token JWT
 */
export function ApiJWT() {
  return ApiProperty({
    description: 'Token JWT de autenticación',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  });
}

/**
 * Decorador de Swagger para ID de base de datos
 */
export function ApiDatabaseId(required = true) {
  return required
    ? ApiProperty({
        description: 'ID único del registro (UUID o número entero positivo)',
        example: '123e4567-e89b-12d3-a456-426614174000',
      })
    : ApiPropertyOptional({
        description: 'ID único del registro (UUID o número entero positivo)',
        example: '123e4567-e89b-12d3-a456-426614174000',
      });
}

/**
 * Decorador de Swagger para dirección IP
 */
export function ApiIPAddress() {
  return ApiPropertyOptional({
    description: 'Dirección IP del cliente',
    example: '192.168.1.1',
  });
}

/**
 * Decorador de Swagger para dirección MAC
 */
export function ApiMACAddress() {
  return ApiPropertyOptional({
    description: 'Dirección MAC del dispositivo',
    example: '00:1B:44:11:3A:B7',
  });
}

/**
 * Decorador de Swagger para código OTP
 */
export function ApiOTP() {
  return ApiProperty({
    description: 'Código de verificación de un solo uso (OTP)',
    example: '123456',
    minLength: 4,
    maxLength: 8,
  });
}

/**
 * Decorador de Swagger para fecha de nacimiento
 */
export function ApiBirthDate() {
  return ApiPropertyOptional({
    description: 'Fecha de nacimiento del usuario',
    example: '1990-01-01',
  });
}

/**
 * Decorador de Swagger para código de país
 */
export function ApiCountryCode() {
  return ApiPropertyOptional({
    description: 'Código de país ISO (2 o 3 caracteres)',
    example: 'ES',
  });
}

/**
 * Decorador de Swagger para código de moneda
 */
export function ApiCurrency() {
  return ApiPropertyOptional({
    description: 'Código de moneda ISO (3 caracteres)',
    example: 'EUR',
  });
}

/**
 * Decorador de Swagger para tarjeta de crédito
 */
export function ApiCreditCard() {
  return ApiPropertyOptional({
    description: 'Número de tarjeta de crédito (sin espacios)',
    example: '4111111111111111',
  });
}

/**
 * Decorador de Swagger para CVV
 */
export function ApiCVV() {
  return ApiPropertyOptional({
    description: 'Código de seguridad de la tarjeta',
    example: '123',
    minLength: 3,
    maxLength: 4,
  });
}

/**
 * Decorador de Swagger para fecha de expiración
 */
export function ApiCardExpiry() {
  return ApiPropertyOptional({
    description: 'Fecha de expiración de la tarjeta',
    example: '12/25',
  });
}

/**
 * Decorador de Swagger para código de descuento
 */
export function ApiDiscountCode() {
  return ApiPropertyOptional({
    description: 'Código de descuento o promoción',
    example: 'SAVE20',
    minLength: 3,
    maxLength: 20,
  });
}

/**
 * Decorador de Swagger para coordenadas
 */
export function ApiCoordinates() {
  return ApiPropertyOptional({
    description: 'Coordenadas geográficas (latitud,longitud)',
    example: '40.4168,-3.7038',
  });
}
