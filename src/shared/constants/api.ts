/**
 * API-related constants
 * Centralized constants for API responses, status codes, and endpoints
 */

/**
 * HTTP Status Codes
 * Standard HTTP status codes used throughout the application
 */
export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * API Response Messages
 * Standard response messages for consistency
 */
export const API_MESSAGES = {
  // Success Messages
  SUCCESS: 'Success',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',

  // Error Messages
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation error',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',

  // Health Check Messages
  HEALTH_OK: 'Service is healthy',
  HEALTH_ERROR: 'Service is unhealthy',
} as const;

/**
 * API Endpoints
 * Centralized endpoint paths for consistency
 */
export const API_ENDPOINTS = {
  // Health
  HEALTH: '/health',
  HEALTH_DETAILED: '/health/detailed',

  // Auth (future)
  AUTH: '/auth',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',

  // Users (future)
  USERS: '/users',
  USERS_PROFILE: '/users/profile',

  // Products (future)
  PRODUCTS: '/products',
  PRODUCTS_CATEGORIES: '/products/categories',

  // Orders (future)
  ORDERS: '/orders',
  ORDERS_HISTORY: '/orders/history',
} as const;

/**
 * API Headers
 * Standard headers used in API responses
 */
export const API_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  X_REQUEST_ID: 'X-Request-ID',
  X_RATE_LIMIT_LIMIT: 'X-RateLimit-Limit',
  X_RATE_LIMIT_REMAINING: 'X-RateLimit-Remaining',
  X_RATE_LIMIT_RESET: 'X-RateLimit-Reset',
} as const;

/**
 * API Content Types
 * Standard content types for API responses
 */
export const CONTENT_TYPES = {
  JSON: 'application/json',
  TEXT: 'text/plain',
  HTML: 'text/html',
  FORM_DATA: 'multipart/form-data',
} as const;

/**
 * Pagination Constants
 * Default values for pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

/**
 * API Rate Limiting Constants
 * Default values for API rate limiting
 */
export const API_RATE_LIMITING = {
  DEFAULT_TTL: 60, // seconds
  DEFAULT_LIMIT: 100, // requests per window
  MAX_TTL: 3600, // 1 hour
  MAX_LIMIT: 10000, // maximum requests per window
} as const;
