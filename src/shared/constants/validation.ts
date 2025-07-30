/**
 * Validation-related constants
 * Centralized constants for validation rules and error messages
 */

/**
 * Validation Rules
 * Standard validation rules used throughout the application
 */
export const VALIDATION_RULES = {
  // String Lengths
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  MIN_EMAIL_LENGTH: 5,
  MAX_EMAIL_LENGTH: 254,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 1000,

  // Numeric Limits
  MIN_PRICE: 0,
  MAX_PRICE: 999999.99,
  MIN_QUANTITY: 0,
  MAX_QUANTITY: 999999,
  MIN_RATING: 1,
  MAX_RATING: 5,

  // Array Limits
  MIN_ARRAY_LENGTH: 1,
  MAX_ARRAY_LENGTH: 100,
  MAX_TAGS_PER_ITEM: 10,
  MAX_IMAGES_PER_ITEM: 10,

  // File Sizes (in bytes)
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB

  // Time Limits
  MIN_TOKEN_EXPIRY: 60, // 1 minute
  MAX_TOKEN_EXPIRY: 7 * 24 * 60 * 60, // 7 days
  DEFAULT_TOKEN_EXPIRY: 24 * 60 * 60, // 24 hours
} as const;

/**
 * Validation Error Messages
 * Standard error messages for validation failures
 */
export const VALIDATION_MESSAGES = {
  // Required Fields
  REQUIRED: 'This field is required',
  REQUIRED_STRING: 'This field must be a string',
  REQUIRED_NUMBER: 'This field must be a number',
  REQUIRED_BOOLEAN: 'This field must be a boolean',
  REQUIRED_ARRAY: 'This field must be an array',
  REQUIRED_OBJECT: 'This field must be an object',

  // String Validation
  STRING_MIN_LENGTH: (min: number) => `Must be at least ${min} characters long`,
  STRING_MAX_LENGTH: (max: number) =>
    `Must be no more than ${max} characters long`,
  STRING_LENGTH_RANGE: (min: number, max: number) =>
    `Must be between ${min} and ${max} characters long`,
  INVALID_EMAIL: 'Must be a valid email address',
  INVALID_URL: 'Must be a valid URL',
  INVALID_PHONE: 'Must be a valid phone number',
  INVALID_DATE: 'Must be a valid date',
  INVALID_UUID: 'Must be a valid UUID',

  // Number Validation
  NUMBER_MIN: (min: number) => `Must be at least ${min}`,
  NUMBER_MAX: (max: number) => `Must be no more than ${max}`,
  NUMBER_RANGE: (min: number, max: number) =>
    `Must be between ${min} and ${max}`,
  NUMBER_INTEGER: 'Must be an integer',
  NUMBER_POSITIVE: 'Must be a positive number',
  NUMBER_NEGATIVE: 'Must be a negative number',

  // Array Validation
  ARRAY_MIN_LENGTH: (min: number) => `Must have at least ${min} items`,
  ARRAY_MAX_LENGTH: (max: number) => `Must have no more than ${max} items`,
  ARRAY_LENGTH_RANGE: (min: number, max: number) =>
    `Must have between ${min} and ${max} items`,
  ARRAY_UNIQUE: 'All items must be unique',

  // Object Validation
  OBJECT_UNKNOWN_PROPERTY: (property: string) =>
    `Unknown property: ${property}`,
  OBJECT_REQUIRED_PROPERTY: (property: string) =>
    `Required property: ${property}`,

  // File Validation
  FILE_TOO_LARGE: (maxSize: string) => `File size must be less than ${maxSize}`,
  INVALID_FILE_TYPE: (allowedTypes: string[]) =>
    `File type must be one of: ${allowedTypes.join(', ')}`,
  INVALID_FILE_EXTENSION: (allowedExtensions: string[]) =>
    `File extension must be one of: ${allowedExtensions.join(', ')}`,

  // Custom Validation
  PASSWORD_TOO_WEAK:
    'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character',
  USERNAME_TAKEN: 'Username is already taken',
  EMAIL_TAKEN: 'Email is already registered',
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_LOCKED: 'Account is temporarily locked',
  EMAIL_NOT_VERIFIED: 'Email address not verified',
} as const;

/**
 * Regex Patterns
 * Standard regex patterns for validation
 */
export const REGEX_PATTERNS = {
  // Email validation
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // Password validation (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,

  // Username validation (3-50 chars, alphanumeric and underscore only)
  USERNAME: /^[a-zA-Z0-9_]{3,50}$/,

  // Phone number validation (international format with common formats)
  PHONE: /^(\+?[1-9]\d{9,14}|\(\d{3}\)\s?\d{3}-\d{4}|\d{3}-\d{3}-\d{4})$/,

  // URL validation
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$|^https?:\/\/localhost:\d+$/,

  // UUID validation
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

  // Date validation (YYYY-MM-DD)
  DATE: /^\d{4}-\d{2}-\d{2}$/,

  // Time validation (HH:MM:SS)
  TIME: /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,

  // Credit card validation (basic)
  CREDIT_CARD: /^[0-9]{13,19}$/,

  // Postal code validation (basic)
  POSTAL_CODE: /^[0-9]{5}(-[0-9]{4})?$/,
} as const;

/**
 * Validation Patterns
 * Common validation patterns for reuse
 */
export const VALIDATION_PATTERNS = {
  EMAIL: REGEX_PATTERNS.EMAIL,
  PASSWORD: REGEX_PATTERNS.PASSWORD,
  USERNAME: REGEX_PATTERNS.USERNAME,
  PHONE: REGEX_PATTERNS.PHONE,
  URL: REGEX_PATTERNS.URL,
  UUID: REGEX_PATTERNS.UUID,
  DATE: REGEX_PATTERNS.DATE,
  TIME: REGEX_PATTERNS.TIME,
  CREDIT_CARD: REGEX_PATTERNS.CREDIT_CARD,
  POSTAL_CODE: REGEX_PATTERNS.POSTAL_CODE,
} as const;

/**
 * Validation Options
 * Common validation options for reuse
 */
export const VALIDATION_OPTIONS = {
  EMAIL: {
    pattern: REGEX_PATTERNS.EMAIL,
    message: VALIDATION_MESSAGES.INVALID_EMAIL,
  },
  PHONE: {
    pattern: REGEX_PATTERNS.PHONE,
    message: VALIDATION_MESSAGES.INVALID_PHONE,
  },
  URL: {
    pattern: REGEX_PATTERNS.URL,
    message: VALIDATION_MESSAGES.INVALID_URL,
  },
  UUID: {
    pattern: REGEX_PATTERNS.UUID,
    message: VALIDATION_MESSAGES.INVALID_UUID,
  },
  PASSWORD: {
    pattern: REGEX_PATTERNS.PASSWORD,
    message: VALIDATION_MESSAGES.PASSWORD_TOO_WEAK,
  },
} as const;

/**
 * Validation Schemas
 * Common validation schemas for reuse
 */
export const VALIDATION_SCHEMAS = {
  // Common field schemas
  ID: {
    type: 'string',
    pattern: REGEX_PATTERNS.UUID.source,
    message: VALIDATION_MESSAGES.INVALID_UUID,
  },

  EMAIL: {
    type: 'string',
    pattern: REGEX_PATTERNS.EMAIL.source,
    message: VALIDATION_MESSAGES.INVALID_EMAIL,
    minLength: VALIDATION_RULES.MIN_EMAIL_LENGTH,
    maxLength: VALIDATION_RULES.MAX_EMAIL_LENGTH,
  },

  PASSWORD: {
    type: 'string',
    pattern: REGEX_PATTERNS.PASSWORD.source,
    message: VALIDATION_MESSAGES.PASSWORD_TOO_WEAK,
    minLength: VALIDATION_RULES.MIN_PASSWORD_LENGTH,
    maxLength: VALIDATION_RULES.MAX_PASSWORD_LENGTH,
  },

  USERNAME: {
    type: 'string',
    pattern: REGEX_PATTERNS.USERNAME.source,
    message:
      'Username must be 3-50 characters long and contain only letters, numbers, and underscores',
    minLength: VALIDATION_RULES.MIN_USERNAME_LENGTH,
    maxLength: VALIDATION_RULES.MAX_USERNAME_LENGTH,
  },

  NAME: {
    type: 'string',
    minLength: VALIDATION_RULES.MIN_NAME_LENGTH,
    maxLength: VALIDATION_RULES.MAX_NAME_LENGTH,
    message: `Name must be between ${VALIDATION_RULES.MIN_NAME_LENGTH} and ${VALIDATION_RULES.MAX_NAME_LENGTH} characters long`,
  },

  DESCRIPTION: {
    type: 'string',
    minLength: VALIDATION_RULES.MIN_DESCRIPTION_LENGTH,
    maxLength: VALIDATION_RULES.MAX_DESCRIPTION_LENGTH,
    message: `Description must be between ${VALIDATION_RULES.MIN_DESCRIPTION_LENGTH} and ${VALIDATION_RULES.MAX_DESCRIPTION_LENGTH} characters long`,
  },

  PRICE: {
    type: 'number',
    minimum: VALIDATION_RULES.MIN_PRICE,
    maximum: VALIDATION_RULES.MAX_PRICE,
    message: `Price must be between ${VALIDATION_RULES.MIN_PRICE} and ${VALIDATION_RULES.MAX_PRICE}`,
  },

  QUANTITY: {
    type: 'number',
    minimum: VALIDATION_RULES.MIN_QUANTITY,
    maximum: VALIDATION_RULES.MAX_QUANTITY,
    message: `Quantity must be between ${VALIDATION_RULES.MIN_QUANTITY} and ${VALIDATION_RULES.MAX_QUANTITY}`,
  },

  RATING: {
    type: 'number',
    minimum: VALIDATION_RULES.MIN_RATING,
    maximum: VALIDATION_RULES.MAX_RATING,
    message: `Rating must be between ${VALIDATION_RULES.MIN_RATING} and ${VALIDATION_RULES.MAX_RATING}`,
  },
} as const;

// Make constants truly readonly
Object.freeze(VALIDATION_MESSAGES);
Object.freeze(VALIDATION_PATTERNS);
Object.freeze(VALIDATION_OPTIONS);
Object.freeze(VALIDATION_SCHEMAS);
