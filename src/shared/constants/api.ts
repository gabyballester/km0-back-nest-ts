/**
 * API-related constants
 * Centralized constants for API responses, status codes, and endpoints
 * Simple API structure without /api prefix
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
 * HTTP Status Messages
 * Standard HTTP status messages
 */
export const HTTP_MESSAGES = {
  // Success
  [HTTP_STATUS.OK]: 'OK',
  [HTTP_STATUS.CREATED]: 'Created',
  [HTTP_STATUS.ACCEPTED]: 'Accepted',
  [HTTP_STATUS.NO_CONTENT]: 'No Content',

  // Client Errors
  [HTTP_STATUS.BAD_REQUEST]: 'Bad Request',
  [HTTP_STATUS.UNAUTHORIZED]: 'Unauthorized',
  [HTTP_STATUS.FORBIDDEN]: 'Forbidden',
  [HTTP_STATUS.NOT_FOUND]: 'Not Found',
  [HTTP_STATUS.METHOD_NOT_ALLOWED]: 'Method Not Allowed',
  [HTTP_STATUS.CONFLICT]: 'Conflict',
  [HTTP_STATUS.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
  [HTTP_STATUS.TOO_MANY_REQUESTS]: 'Too Many Requests',

  // Server Errors
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [HTTP_STATUS.NOT_IMPLEMENTED]: 'Not Implemented',
  [HTTP_STATUS.BAD_GATEWAY]: 'Bad Gateway',
  [HTTP_STATUS.SERVICE_UNAVAILABLE]: 'Service Unavailable',
} as const;

/**
 * System Routes
 * Core system endpoints
 */
export const API_ROUTES = {
  HEALTH: 'health',
  HEALTH_DETAILED: 'health/detailed',
  DOCS: 'docs',
  SWAGGER: 'swagger',
} as const;

/**
 * API Endpoints Configuration
 * Centralized endpoint definitions
 */
export const API_ENDPOINTS = {
  // System endpoints
  HEALTH: `/${API_ROUTES.HEALTH}`,
  HEALTH_DETAILED: `/${API_ROUTES.HEALTH_DETAILED}`,
  DOCS: `/${API_ROUTES.DOCS}`,
  SWAGGER: `/${API_ROUTES.SWAGGER}`,
} as const;

/**
 * Helper Functions for API
 */

/**
 * Check if route is a system route
 * @param route - Route path to check
 * @returns True if it's a system route
 */
export const isSystemRoute = (route: string): boolean => {
  const systemRoutes = [
    API_ROUTES.HEALTH,
    API_ROUTES.HEALTH_DETAILED,
    API_ROUTES.DOCS,
    API_ROUTES.SWAGGER,
  ];
  return systemRoutes.some(
    systemRoute => route === systemRoute || route.startsWith(`${systemRoute}/`),
  );
};

/**
 * Check if route is a health route
 * @param route - Route path to check
 * @returns True if it's a health route
 */
export const isHealthRoute = (route: string): boolean => {
  return (
    route === API_ROUTES.HEALTH || route.startsWith(`${API_ROUTES.HEALTH}/`)
  );
};

/**
 * Check if route is a documentation route
 * @param route - Route path to check
 * @returns True if it's a documentation route
 */
export const isDocumentationRoute = (route: string): boolean => {
  return (
    route === API_ROUTES.DOCS ||
    route === API_ROUTES.SWAGGER ||
    route.startsWith(`${API_ROUTES.DOCS}/`) ||
    route.startsWith(`${API_ROUTES.SWAGGER}/`)
  );
};

/**
 * Get API base URL for different environments
 * @param environment - Environment name
 * @param port - Port number
 * @returns Base URL for the API
 */
export const getApiBaseUrl = (environment: string, port: number): string => {
  switch (environment) {
    case 'development':
      return `http://localhost:${port}`;
    case 'production':
      return 'https://api.km0-market.com';
    case 'test':
      return `http://localhost:${port}`;
    default:
      return 'https://api.km0-market.com';
  }
};

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

// Make constants truly readonly
Object.freeze(HTTP_STATUS);
Object.freeze(HTTP_MESSAGES);
Object.freeze(API_ROUTES);
Object.freeze(API_ENDPOINTS);
Object.freeze(API_HEADERS);
Object.freeze(CONTENT_TYPES);
Object.freeze(PAGINATION);
Object.freeze(API_RATE_LIMITING);
