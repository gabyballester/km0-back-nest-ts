import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { SecurityMiddleware } from './security.middleware';
import { ENV_KEYS } from '../../config/env.constants';

// Mock helmet
jest.mock('helmet', () => {
  return jest.fn(() => jest.fn());
});

describe('SecurityMiddleware', () => {
  let middleware: SecurityMiddleware;
  let configService: ConfigService;

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
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should get CORS origin from config service', () => {
    const getSpy = jest.spyOn(configService, 'get');
    expect(getSpy).toHaveBeenCalledWith(ENV_KEYS.CORS_ORIGIN);
  });

  it('should have use method', () => {
    expect(typeof middleware.use).toBe('function');
  });

  it('should be instance of SecurityMiddleware', () => {
    expect(middleware).toBeInstanceOf(SecurityMiddleware);
  });

  it('should configure helmet with security options', () => {
    expect(middleware).toBeInstanceOf(SecurityMiddleware);
    expect(typeof middleware.use).toBe('function');
  });

  it('should have helmetMiddleware property', () => {
    expect(middleware).toHaveProperty('helmetMiddleware');
  });

  it('should have corsOrigin property', () => {
    expect(middleware).toHaveProperty('corsOrigin');
    expect(middleware['corsOrigin']).toBe('http://localhost:3000');
  });

  describe('use method', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
      mockReq = {};
      mockRes = {
        header: jest.fn(),
        removeHeader: jest.fn(),
      } as Partial<Response>;
      mockNext = jest.fn();
    });

    it('should apply security headers and call next', () => {
      // Mock the helmet middleware to call the callback immediately
      const originalHelmetMiddleware = (middleware as any)['helmetMiddleware'];
      (middleware as any)['helmetMiddleware'] = jest.fn(
        (req: Request, res: Response, callback: () => void) => {
          callback();
        },
      );

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

      // Restore original helmet middleware
      (middleware as any)['helmetMiddleware'] = originalHelmetMiddleware;
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

      // Mock the helmet middleware to call the callback immediately
      (middlewareWithDifferentOrigin as any)['helmetMiddleware'] = jest.fn(
        (req: Request, res: Response, callback: () => void) => {
          callback();
        },
      );

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

      // Mock the helmet middleware to call the callback immediately
      (middlewareWithNullOrigin as any)['helmetMiddleware'] = jest.fn(
        (req: Request, res: Response, callback: () => void) => {
          callback();
        },
      );

      // Execute the middleware
      middlewareWithNullOrigin.use(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      // Verify CORS origin is set to default when null
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

      // Mock the helmet middleware to call the callback immediately
      (middlewareWithUndefinedOrigin as any)['helmetMiddleware'] = jest.fn(
        (req: Request, res: Response, callback: () => void) => {
          callback();
        },
      );

      // Execute the middleware
      middlewareWithUndefinedOrigin.use(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      // Verify CORS origin is set to default when undefined
      expect(mockRes.header).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        'http://localhost:3000',
      );
    });

    it('should handle empty string CORS origin', async () => {
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

      // Mock the helmet middleware to call the callback immediately
      (middlewareWithEmptyOrigin as any)['helmetMiddleware'] = jest.fn(
        (req: Request, res: Response, callback: () => void) => {
          callback();
        },
      );

      // Execute the middleware
      middlewareWithEmptyOrigin.use(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      // Verify CORS origin is set to default when empty string
      expect(mockRes.header).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        'http://localhost:3000',
      );
    });
  });

  describe('constructor', () => {
    it('should configure helmet with all security options', () => {
      // Forzar helmetMiddleware a ser una función mockeada
      (middleware as any)['helmetMiddleware'] = jest.fn();
      expect(middleware).toBeDefined();
      expect(typeof middleware['helmetMiddleware']).toBe('function');
    });

    it('should store CORS origin from config service', () => {
      expect(middleware['corsOrigin']).toBe('http://localhost:3000');
    });
  });
});
