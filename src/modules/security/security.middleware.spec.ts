import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { SecurityMiddleware } from './security.middleware';

describe('SecurityMiddleware', () => {
  let middleware: SecurityMiddleware;
  let configService: ConfigService;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityMiddleware,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost:3000'),
          },
        },
      ],
    }).compile();

    middleware = module.get<SecurityMiddleware>(SecurityMiddleware);
    configService = module.get<ConfigService>(ConfigService);

    mockReq = {
      method: 'GET',
      url: '/test',
      headers: {},
    };

    mockRes = {
      header: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      removeHeader: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should have ConfigService injected', () => {
    expect(configService).toBeDefined();
  });

  it('should configure CORS origin from ConfigService', () => {
    const getSpy = jest.spyOn(configService, 'get');
    expect(getSpy).toHaveBeenCalledWith('CORS_ORIGIN');
    expect(configService.get('CORS_ORIGIN')).toBe('http://localhost:3000');
  });

  describe('use method', () => {
    beforeEach(() => {
      mockNext = jest.fn();
    });

    it('should apply security headers and call next', () => {
      // Execute the middleware
      middleware.use(mockReq as Request, mockRes as Response, mockNext);

      // Verify CORS headers are set
      expect(mockRes.header).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        'http://localhost:3000',
      );
      expect(mockRes.header).toHaveBeenCalledWith(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS',
      );
      expect(mockRes.header).toHaveBeenCalledWith(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization',
      );
      expect(mockRes.header).toHaveBeenCalledWith(
        'Access-Control-Allow-Credentials',
        'true',
      );

      // Verify security headers are set
      expect(mockRes.header).toHaveBeenCalledWith(
        'X-Content-Type-Options',
        'nosniff',
      );
      expect(mockRes.header).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
      expect(mockRes.header).toHaveBeenCalledWith(
        'X-XSS-Protection',
        '1; mode=block',
      );

      // Verify server information is removed
      expect(mockRes.removeHeader).toHaveBeenCalledWith('X-Powered-By');

      // Verify next is called
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle different CORS origins', async () => {
      // Create middleware with different CORS origin
      const moduleWithDifferentOrigin: TestingModule =
        await Test.createTestingModule({
          providers: [
            SecurityMiddleware,
            {
              provide: ConfigService,
              useValue: {
                get: jest.fn().mockReturnValue('https://example.com'),
              },
            },
          ],
        }).compile();

      const middlewareWithDifferentOrigin =
        moduleWithDifferentOrigin.get<SecurityMiddleware>(SecurityMiddleware);

      // Execute the middleware
      middlewareWithDifferentOrigin.use(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      // Verify CORS origin is set correctly
      expect(mockRes.header).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        'https://example.com',
      );
    });

    it('should handle null CORS origin gracefully', async () => {
      // Create middleware with null CORS origin
      const moduleWithNullOrigin: TestingModule =
        await Test.createTestingModule({
          providers: [
            SecurityMiddleware,
            {
              provide: ConfigService,
              useValue: {
                get: jest.fn().mockReturnValue(null),
              },
            },
          ],
        }).compile();

      const middlewareWithNullOrigin =
        moduleWithNullOrigin.get<SecurityMiddleware>(SecurityMiddleware);

      // Execute the middleware
      middlewareWithNullOrigin.use(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      // Verify CORS origin is set to default
      expect(mockRes.header).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        'http://localhost:3000',
      );
    });

    it('should handle undefined CORS origin gracefully', async () => {
      // Create middleware with undefined CORS origin
      const moduleWithUndefinedOrigin: TestingModule =
        await Test.createTestingModule({
          providers: [
            SecurityMiddleware,
            {
              provide: ConfigService,
              useValue: {
                get: jest.fn().mockReturnValue(undefined),
              },
            },
          ],
        }).compile();

      const middlewareWithUndefinedOrigin =
        moduleWithUndefinedOrigin.get<SecurityMiddleware>(SecurityMiddleware);

      // Execute the middleware
      middlewareWithUndefinedOrigin.use(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      // Verify CORS origin is set to default
      expect(mockRes.header).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        'http://localhost:3000',
      );
    });

    it('should handle empty string CORS origin gracefully', async () => {
      // Create middleware with empty string CORS origin
      const moduleWithEmptyOrigin: TestingModule =
        await Test.createTestingModule({
          providers: [
            SecurityMiddleware,
            {
              provide: ConfigService,
              useValue: {
                get: jest.fn().mockReturnValue(''),
              },
            },
          ],
        }).compile();

      const middlewareWithEmptyOrigin =
        moduleWithEmptyOrigin.get<SecurityMiddleware>(SecurityMiddleware);

      // Execute the middleware
      middlewareWithEmptyOrigin.use(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      // Verify CORS origin is set to default
      expect(mockRes.header).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        'http://localhost:3000',
      );
    });

    it('should handle middleware execution without errors', () => {
      // Execute the middleware - should not throw
      expect(() => {
        middleware.use(mockReq as Request, mockRes as Response, mockNext);
      }).not.toThrow();

      // Verify next is called
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle middleware execution with proper error handling', () => {
      // Execute the middleware
      middleware.use(mockReq as Request, mockRes as Response, mockNext);

      // Verify next is called
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
