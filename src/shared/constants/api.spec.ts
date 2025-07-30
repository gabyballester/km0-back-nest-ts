import {
  HTTP_STATUS,
  HTTP_MESSAGES,
  API_ROUTES,
  API_ENDPOINTS,
  isSystemRoute,
  isHealthRoute,
  isDocumentationRoute,
  getApiBaseUrl,
} from './api';

describe('API Constants', () => {
  describe('HTTP_STATUS', () => {
    it('should have correct success status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.ACCEPTED).toBe(202);
      expect(HTTP_STATUS.NO_CONTENT).toBe(204);
    });

    it('should have correct client error status codes', () => {
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.FORBIDDEN).toBe(403);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.METHOD_NOT_ALLOWED).toBe(405);
      expect(HTTP_STATUS.CONFLICT).toBe(409);
      expect(HTTP_STATUS.UNPROCESSABLE_ENTITY).toBe(422);
      expect(HTTP_STATUS.TOO_MANY_REQUESTS).toBe(429);
    });

    it('should have correct server error status codes', () => {
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
      expect(HTTP_STATUS.NOT_IMPLEMENTED).toBe(501);
      expect(HTTP_STATUS.BAD_GATEWAY).toBe(502);
      expect(HTTP_STATUS.SERVICE_UNAVAILABLE).toBe(503);
    });

    it('should be readonly', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        (HTTP_STATUS as any).OK = 999;
      }).toThrow();
    });
  });

  describe('HTTP_MESSAGES', () => {
    it('should have correct success messages', () => {
      expect(HTTP_MESSAGES[HTTP_STATUS.OK]).toBe('OK');
      expect(HTTP_MESSAGES[HTTP_STATUS.CREATED]).toBe('Created');
      expect(HTTP_MESSAGES[HTTP_STATUS.ACCEPTED]).toBe('Accepted');
      expect(HTTP_MESSAGES[HTTP_STATUS.NO_CONTENT]).toBe('No Content');
    });

    it('should have correct client error messages', () => {
      expect(HTTP_MESSAGES[HTTP_STATUS.BAD_REQUEST]).toBe('Bad Request');
      expect(HTTP_MESSAGES[HTTP_STATUS.UNAUTHORIZED]).toBe('Unauthorized');
      expect(HTTP_MESSAGES[HTTP_STATUS.FORBIDDEN]).toBe('Forbidden');
      expect(HTTP_MESSAGES[HTTP_STATUS.NOT_FOUND]).toBe('Not Found');
      expect(HTTP_MESSAGES[HTTP_STATUS.METHOD_NOT_ALLOWED]).toBe(
        'Method Not Allowed',
      );
      expect(HTTP_MESSAGES[HTTP_STATUS.CONFLICT]).toBe('Conflict');
      expect(HTTP_MESSAGES[HTTP_STATUS.UNPROCESSABLE_ENTITY]).toBe(
        'Unprocessable Entity',
      );
      expect(HTTP_MESSAGES[HTTP_STATUS.TOO_MANY_REQUESTS]).toBe(
        'Too Many Requests',
      );
    });

    it('should have correct server error messages', () => {
      expect(HTTP_MESSAGES[HTTP_STATUS.INTERNAL_SERVER_ERROR]).toBe(
        'Internal Server Error',
      );
      expect(HTTP_MESSAGES[HTTP_STATUS.NOT_IMPLEMENTED]).toBe(
        'Not Implemented',
      );
      expect(HTTP_MESSAGES[HTTP_STATUS.BAD_GATEWAY]).toBe('Bad Gateway');
      expect(HTTP_MESSAGES[HTTP_STATUS.SERVICE_UNAVAILABLE]).toBe(
        'Service Unavailable',
      );
    });

    it('should be readonly', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        (HTTP_MESSAGES as any)[200] = 'Modified';
      }).toThrow();
    });
  });

  describe('API_ROUTES', () => {
    it('should have correct route definitions', () => {
      expect(API_ROUTES.HEALTH).toBe('health');
      expect(API_ROUTES.HEALTH_DETAILED).toBe('health/detailed');
      expect(API_ROUTES.DOCS).toBe('docs');
      expect(API_ROUTES.SWAGGER).toBe('swagger');
    });

    it('should be readonly', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        (API_ROUTES as any).HEALTH = 'modified';
      }).toThrow();
    });
  });

  describe('API_ENDPOINTS', () => {
    it('should have correct endpoint definitions', () => {
      expect(API_ENDPOINTS.HEALTH).toBe('/health');
      expect(API_ENDPOINTS.HEALTH_DETAILED).toBe('/health/detailed');
      expect(API_ENDPOINTS.DOCS).toBe('/docs');
      expect(API_ENDPOINTS.SWAGGER).toBe('/swagger');
    });

    it('should be readonly', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        (API_ENDPOINTS as any).HEALTH = '/modified';
      }).toThrow();
    });
  });

  describe('isSystemRoute', () => {
    it('should return true for system routes', () => {
      expect(isSystemRoute('health')).toBe(true);
      expect(isSystemRoute('health/detailed')).toBe(true);
      expect(isSystemRoute('docs')).toBe(true);
      expect(isSystemRoute('swagger')).toBe(true);
    });

    it('should return false for non-system routes', () => {
      expect(isSystemRoute('users')).toBe(false);
      expect(isSystemRoute('profiles')).toBe(false);
      expect(isSystemRoute('auth')).toBe(false);
      expect(isSystemRoute('')).toBe(false);
    });

    it('should be case sensitive', () => {
      expect(isSystemRoute('Health')).toBe(false);
      expect(isSystemRoute('HEALTH')).toBe(false);
      expect(isSystemRoute('Health/Detailed')).toBe(false);
    });
  });

  describe('isHealthRoute', () => {
    it('should return true for health routes', () => {
      expect(isHealthRoute('health')).toBe(true);
      expect(isHealthRoute('health/detailed')).toBe(true);
    });

    it('should return false for non-health routes', () => {
      expect(isHealthRoute('docs')).toBe(false);
      expect(isHealthRoute('swagger')).toBe(false);
      expect(isHealthRoute('users')).toBe(false);
      expect(isHealthRoute('')).toBe(false);
    });

    it('should be case sensitive', () => {
      expect(isHealthRoute('Health')).toBe(false);
      expect(isHealthRoute('HEALTH')).toBe(false);
      expect(isHealthRoute('Health/Detailed')).toBe(false);
    });
  });

  describe('isDocumentationRoute', () => {
    it('should return true for documentation routes', () => {
      expect(isDocumentationRoute('docs')).toBe(true);
      expect(isDocumentationRoute('swagger')).toBe(true);
    });

    it('should return false for non-documentation routes', () => {
      expect(isDocumentationRoute('health')).toBe(false);
      expect(isDocumentationRoute('health/detailed')).toBe(false);
      expect(isDocumentationRoute('users')).toBe(false);
      expect(isDocumentationRoute('')).toBe(false);
    });

    it('should be case sensitive', () => {
      expect(isDocumentationRoute('Docs')).toBe(false);
      expect(isDocumentationRoute('DOCS')).toBe(false);
      expect(isDocumentationRoute('Swagger')).toBe(false);
    });
  });

  describe('getApiBaseUrl', () => {
    it('should return correct URL for development environment', () => {
      const url = getApiBaseUrl('development', 4000);
      expect(url).toBe('http://localhost:4000');
    });

    it('should return correct URL for production environment', () => {
      const url = getApiBaseUrl('production', 80);
      expect(url).toBe('https://api.km0-market.com');
    });

    it('should return correct URL for test environment', () => {
      const url = getApiBaseUrl('test', 4001);
      expect(url).toBe('http://localhost:4001');
    });

    it('should handle different ports correctly', () => {
      expect(getApiBaseUrl('development', 3000)).toBe('http://localhost:3000');
      expect(getApiBaseUrl('development', 8080)).toBe('http://localhost:8080');
      expect(getApiBaseUrl('production', 443)).toBe(
        'https://api.km0-market.com',
      );
    });

    it('should use default production URL for unknown environments', () => {
      const url = getApiBaseUrl('staging', 4000);
      expect(url).toBe('https://api.km0-market.com');
    });
  });

  describe('constant immutability', () => {
    it('should prevent modification of HTTP_STATUS', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        (HTTP_STATUS as any).OK = 999;
      }).toThrow();
    });

    it('should prevent modification of HTTP_MESSAGES', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        (HTTP_MESSAGES as any)[200] = 'Modified';
      }).toThrow();
    });

    it('should prevent modification of API_ROUTES', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        (API_ROUTES as any).HEALTH = 'modified';
      }).toThrow();
    });

    it('should prevent modification of API_ENDPOINTS', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        (API_ENDPOINTS as any).HEALTH = '/modified';
      }).toThrow();
    });
  });

  describe('type safety', () => {
    it('should have correct types for HTTP_STATUS', () => {
      const status: (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS] =
        HTTP_STATUS.OK;
      expect(typeof status).toBe('number');
    });

    it('should have correct types for HTTP_MESSAGES', () => {
      const message: (typeof HTTP_MESSAGES)[keyof typeof HTTP_MESSAGES] =
        HTTP_MESSAGES[HTTP_STATUS.OK];
      expect(typeof message).toBe('string');
    });

    it('should have correct types for API_ROUTES', () => {
      const route: (typeof API_ROUTES)[keyof typeof API_ROUTES] =
        API_ROUTES.HEALTH;
      expect(typeof route).toBe('string');
    });

    it('should have correct types for API_ENDPOINTS', () => {
      const endpoint: (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS] =
        API_ENDPOINTS.HEALTH;
      expect(typeof endpoint).toBe('string');
    });
  });
});
