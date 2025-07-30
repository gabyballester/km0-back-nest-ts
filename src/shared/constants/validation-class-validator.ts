/**
 * Constantes de validación usando class-validator
 * Centraliza las reglas de validación para reutilización en DTOs
 */

/**
 * Reglas de validación para campos de texto
 */
export const TEXT_VALIDATION_RULES = {
  // Longitudes mínimas y máximas
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  MIN_EMAIL_LENGTH: 5,
  MAX_EMAIL_LENGTH: 254,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_PHONE_LENGTH: 20,
  MAX_CITY_LENGTH: 100,
  MAX_POSTAL_CODE_LENGTH: 10,

  // Patrones regex
  NAME_PATTERN: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  USERNAME_PATTERN: /^[a-zA-Z0-9_]{3,50}$/,
  EMAIL_PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE_PATTERN: /^\+?[1-9]\d{1,14}$/,
  POSTAL_CODE_PATTERN: /^[0-9]{5}(-[0-9]{4})?$/,
  URL_PATTERN:
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  UUID_PATTERN:
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
} as const;

/**
 * Mensajes de error de validación
 */
export const VALIDATION_MESSAGES = {
  // Campos requeridos
  REQUIRED: 'Este campo es requerido',
  REQUIRED_EMAIL: 'El email es requerido',
  REQUIRED_PASSWORD: 'La contraseña es requerida',
  REQUIRED_FIRST_NAME: 'El nombre es requerido',
  REQUIRED_LAST_NAME: 'El apellido es requerido',
  REQUIRED_USER_ID: 'El userId es requerido',

  // Validación de email
  INVALID_EMAIL: 'El email debe ser válido',
  EMAIL_TOO_LONG: 'El email no puede exceder 254 caracteres',

  // Validación de contraseña
  PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 8 caracteres',
  PASSWORD_TOO_LONG: 'La contraseña no puede exceder 128 caracteres',
  PASSWORD_PATTERN:
    'La contraseña debe incluir al menos una minúscula, una mayúscula y un número',

  // Validación de nombres
  NAME_TOO_SHORT: 'Debe tener al menos 2 caracteres',
  NAME_TOO_LONG: 'No puede tener más de 50 caracteres',
  NAME_PATTERN: 'Solo puede contener letras y espacios',

  // Validación de teléfono
  PHONE_TOO_LONG: 'El teléfono no puede tener más de 20 caracteres',
  INVALID_PHONE: 'Debe ser un número de teléfono válido',

  // Validación de código postal
  POSTAL_CODE_TOO_LONG: 'El código postal no puede tener más de 10 caracteres',
  INVALID_POSTAL_CODE: 'Debe ser un código postal válido',

  // Validación de ciudad
  CITY_TOO_LONG: 'La ciudad no puede tener más de 100 caracteres',

  // Validación de idioma
  INVALID_LANGUAGE: 'El idioma debe ser uno de: es, en, fr, de, it, pt',
} as const;

/**
 * Opciones de validación para idiomas
 */
export const LANGUAGE_OPTIONS = ['es', 'en', 'fr', 'de', 'it', 'pt'] as const;

/**
 * Tipos de validación para reutilización
 */
export type LanguageOption = (typeof LANGUAGE_OPTIONS)[number];

/**
 * Decoradores de validación personalizados para reutilización
 */
export const VALIDATION_DECORATORS = {
  // Email
  EMAIL: {
    message: VALIDATION_MESSAGES.INVALID_EMAIL,
    maxLength: TEXT_VALIDATION_RULES.MAX_EMAIL_LENGTH,
    maxLengthMessage: VALIDATION_MESSAGES.EMAIL_TOO_LONG,
  },

  // Contraseña
  PASSWORD: {
    minLength: TEXT_VALIDATION_RULES.MIN_PASSWORD_LENGTH,
    maxLength: TEXT_VALIDATION_RULES.MAX_PASSWORD_LENGTH,
    pattern: TEXT_VALIDATION_RULES.PASSWORD_PATTERN,
    minLengthMessage: VALIDATION_MESSAGES.PASSWORD_TOO_SHORT,
    maxLengthMessage: VALIDATION_MESSAGES.PASSWORD_TOO_LONG,
    patternMessage: VALIDATION_MESSAGES.PASSWORD_PATTERN,
  },

  // Nombre
  NAME: {
    minLength: TEXT_VALIDATION_RULES.MIN_NAME_LENGTH,
    maxLength: TEXT_VALIDATION_RULES.MAX_NAME_LENGTH,
    pattern: TEXT_VALIDATION_RULES.NAME_PATTERN,
    minLengthMessage: VALIDATION_MESSAGES.NAME_TOO_SHORT,
    maxLengthMessage: VALIDATION_MESSAGES.NAME_TOO_LONG,
    patternMessage: VALIDATION_MESSAGES.NAME_PATTERN,
  },

  // Teléfono
  PHONE: {
    maxLength: TEXT_VALIDATION_RULES.MAX_PHONE_LENGTH,
    pattern: TEXT_VALIDATION_RULES.PHONE_PATTERN,
    maxLengthMessage: VALIDATION_MESSAGES.PHONE_TOO_LONG,
    patternMessage: VALIDATION_MESSAGES.INVALID_PHONE,
  },

  // Código postal
  POSTAL_CODE: {
    maxLength: TEXT_VALIDATION_RULES.MAX_POSTAL_CODE_LENGTH,
    pattern: TEXT_VALIDATION_RULES.POSTAL_CODE_PATTERN,
    maxLengthMessage: VALIDATION_MESSAGES.POSTAL_CODE_TOO_LONG,
    patternMessage: VALIDATION_MESSAGES.INVALID_POSTAL_CODE,
  },

  // Ciudad
  CITY: {
    maxLength: TEXT_VALIDATION_RULES.MAX_CITY_LENGTH,
    maxLengthMessage: VALIDATION_MESSAGES.CITY_TOO_LONG,
  },

  // Idioma
  LANGUAGE: {
    options: LANGUAGE_OPTIONS,
    message: VALIDATION_MESSAGES.INVALID_LANGUAGE,
  },
} as const;
