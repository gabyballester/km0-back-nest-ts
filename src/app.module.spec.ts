import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { MiddlewareConsumer } from '@nestjs/common';

// Configurar variables de entorno para tests
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.PORT = '4003';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
});

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  afterEach(jest.clearAllMocks);

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have AppController', () => {
    const controller = module.get<AppController>(AppController);
    expect(controller).toBeDefined();
  });

  it('should have AppService', () => {
    const service = module.get<AppService>(AppService);
    expect(service).toBeDefined();
  });

  it('should have HealthController', () => {
    const controller = module.get<HealthController>(HealthController);
    expect(controller).toBeDefined();
  });

  it('should have getHello method in AppService', () => {
    const service = module.get<AppService>(AppService);
    expect(typeof service.getHello).toBe('function');
  });

  it('should return hello message from AppService', () => {
    const service = module.get<AppService>(AppService);
    const result = service.getHello();
    expect(result).toBe('Hello World!');
  });

  it('should have getHello method in AppController', () => {
    const controller = module.get<AppController>(AppController);
    expect(typeof controller.getHello).toBe('function');
  });

  it('should return hello message from AppController', () => {
    const controller = module.get<AppController>(AppController);
    const result = controller.getHello();
    expect(result).toBe('Hello World!');
  });

  it('should compile without errors', () => {
    expect(() => module.createNestApplication()).not.toThrow();
  });

  it('should have providers', () => {
    expect(module.get(AppService)).toBeDefined();
  });

  it('should have controllers', () => {
    expect(module.get(AppController)).toBeDefined();
    expect(module.get(HealthController)).toBeDefined();
  });

  it('should have imports', () => {
    const appModule = module.get(AppModule);
    expect(appModule).toBeDefined();
  });

  describe('configure method', () => {
    it('should configure middleware correctly', () => {
      const appModule = module.get(AppModule);
      const mockConsumer = {
        apply: jest.fn().mockReturnThis(),
        forRoutes: jest.fn().mockReturnThis(),
      } as unknown as MiddlewareConsumer;

      // Test that configure method exists and can be called
      expect(typeof appModule.configure).toBe('function');

      // Test that it doesn't throw when called
      expect(() => appModule.configure(mockConsumer)).not.toThrow();
    });
  });
});
