/**
 * Security-related constants
 * Centralized constants for security configurations and rules
 */

/**
 * JWT Configuration
 * JWT token configuration constants
 */
export const JWT_CONFIG = {
  // Token Types
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  RESET_TOKEN: 'reset_token',
  VERIFICATION_TOKEN: 'verification_token',

  // Token Expiry Times (in seconds)
  ACCESS_TOKEN_EXPIRY: 15 * 60, // 15 minutes
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60, // 7 days
  RESET_TOKEN_EXPIRY: 60 * 60, // 1 hour
  VERIFICATION_TOKEN_EXPIRY: 24 * 60 * 60, // 24 hours

  // Token Issuer
  ISSUER: 'km0-market-backend',

  // Token Audience
  AUDIENCE: 'km0-market-users',

  // Algorithm
  ALGORITHM: 'HS256' as const,

  // Cookie Settings
  COOKIE_HTTP_ONLY: true,
  COOKIE_SECURE: true, // Set to false in development
  COOKIE_SAME_SITE: 'strict' as const,
  COOKIE_PATH: '/',
} as const;

/**
 * Password Security
 * Password-related security constants
 */
export const PASSWORD_SECURITY = {
  // Hashing
  SALT_ROUNDS: 12,
  HASH_ALGORITHM: 'bcrypt',

  // Password Requirements
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL_CHARS: true,

  // Password History
  PASSWORD_HISTORY_SIZE: 5,

  // Password Expiry
  PASSWORD_EXPIRY_DAYS: 90, // 3 months
} as const;

/**
 * Rate Limiting
 * Rate limiting configuration constants
 */
export const RATE_LIMITING = {
  // Default Limits
  DEFAULT_TTL: 60, // 1 minute window
  DEFAULT_LIMIT: 100, // 100 requests per window

  // Specific Endpoints
  LOGIN_TTL: 15 * 60, // 15 minutes
  LOGIN_LIMIT: 5, // 5 login attempts per 15 minutes

  REGISTER_TTL: 60 * 60, // 1 hour
  REGISTER_LIMIT: 3, // 3 registration attempts per hour

  PASSWORD_RESET_TTL: 60 * 60, // 1 hour
  PASSWORD_RESET_LIMIT: 3, // 3 password reset attempts per hour

  EMAIL_VERIFICATION_TTL: 60 * 60, // 1 hour
  EMAIL_VERIFICATION_LIMIT: 5, // 5 verification attempts per hour

  // Maximum Limits
  MAX_TTL: 24 * 60 * 60, // 24 hours
  MAX_LIMIT: 10000, // 10,000 requests per day
} as const;

/**
 * Session Security
 * Session-related security constants
 */
export const SESSION_SECURITY = {
  // Session Configuration
  SESSION_SECRET_MIN_LENGTH: 32,
  SESSION_COOKIE_NAME: 'session',
  SESSION_COOKIE_HTTP_ONLY: true,
  SESSION_COOKIE_SECURE: true,
  SESSION_COOKIE_SAME_SITE: 'strict' as const,

  // Session Expiry
  SESSION_EXPIRY: 24 * 60 * 60, // 24 hours
  SESSION_REFRESH_THRESHOLD: 5 * 60, // 5 minutes

  // Session Storage
  MAX_SESSIONS_PER_USER: 5,
  SESSION_CLEANUP_INTERVAL: 60 * 60, // 1 hour
} as const;

/**
 * CORS Configuration
 * CORS security constants
 */
export const CORS_CONFIG = {
  // Allowed Origins
  ALLOWED_ORIGINS: [
    'http://localhost:3000', // Development frontend
    'http://localhost:3001', // Development frontend (alternative port)
    'https://km0-market.vercel.app', // Production frontend
    'https://km0-market.netlify.app', // Production frontend (alternative)
  ],

  // Allowed Methods
  ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  // Allowed Headers
  ALLOWED_HEADERS: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-Request-ID',
  ],

  // Exposed Headers
  EXPOSED_HEADERS: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'X-Request-ID',
  ],

  // Credentials
  ALLOW_CREDENTIALS: true,

  // Preflight
  PREFLIGHT_CONTINUE: false,
  OPTIONS_SUCCESS_STATUS: 204,
} as const;

/**
 * Security Headers
 * Security header configuration constants
 */
export const SECURITY_HEADERS = {
  // Content Security Policy
  CSP: {
    DEFAULT_SRC: ["'self'"],
    SCRIPT_SRC: ["'self'", "'unsafe-inline'"],
    STYLE_SRC: ["'self'", "'unsafe-inline'"],
    IMG_SRC: ["'self'", 'data:', 'https:'],
    CONNECT_SRC: ["'self'"],
    FONT_SRC: ["'self'"],
    OBJECT_SRC: ["'none'"],
    MEDIA_SRC: ["'self'"],
    FRAME_SRC: ["'none'"],
  },

  // HTTP Strict Transport Security
  HSTS: {
    MAX_AGE: 31536000, // 1 year
    INCLUDE_SUBDOMAINS: true,
    PRELOAD: true,
  },

  // X-Frame-Options
  X_FRAME_OPTIONS: 'DENY',

  // X-Content-Type-Options
  X_CONTENT_TYPE_OPTIONS: 'nosniff',

  // X-XSS-Protection
  X_XSS_PROTECTION: '1; mode=block',

  // Referrer Policy
  REFERRER_POLICY: 'strict-origin-when-cross-origin',

  // Permissions Policy
  PERMISSIONS_POLICY: {
    CAMERA: [],
    MICROPHONE: [],
    GEOLOCATION: [],
    PAYMENT: [],
    USB: [],
  },
} as const;

/**
 * Account Security
 * Account-related security constants
 */
export const ACCOUNT_SECURITY = {
  // Login Attempts
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60, // 15 minutes
  LOCKOUT_THRESHOLD: 3, // Lock after 3 failed attempts

  // Account Verification
  EMAIL_VERIFICATION_REQUIRED: true,
  PHONE_VERIFICATION_REQUIRED: false,
  TWO_FACTOR_REQUIRED: false,

  // Account Deletion
  ACCOUNT_DELETION_GRACE_PERIOD: 30 * 24 * 60 * 60, // 30 days
  SOFT_DELETE_ENABLED: true,

  // Account Recovery
  RECOVERY_EMAIL_REQUIRED: true,
  RECOVERY_PHONE_REQUIRED: false,
} as const;

/**
 * File Upload Security
 * File upload security constants
 */
export const FILE_UPLOAD_SECURITY = {
  // Allowed File Types
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],

  // File Size Limits
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_VIDEO_SIZE: 50 * 1024 * 1024, // 50MB

  // File Extensions
  ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  ALLOWED_DOCUMENT_EXTENSIONS: ['.pdf', '.doc', '.docx'],
  ALLOWED_VIDEO_EXTENSIONS: ['.mp4', '.webm', '.ogg'],

  // Upload Limits
  MAX_FILES_PER_REQUEST: 10,
  MAX_TOTAL_SIZE_PER_REQUEST: 100 * 1024 * 1024, // 100MB
} as const;
