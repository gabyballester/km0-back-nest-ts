import { Test, TestingModule } from '@nestjs/testing';
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { ConfigModule } from '@nestjs/config';
import { ENV_KEYS, ENV_VALUES } from './shared/constants/environment';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [
            () => ({
              [ENV_KEYS.NODE_ENV]: ENV_VALUES.NODE_ENV.TEST,
              [ENV_KEYS.PORT]: 4003,
              [ENV_KEYS.DATABASE_URL]:
                'postgresql://test:test@localhost:5432/test_db',
              [ENV_KEYS.JWT_SECRET]:
                'test-jwt-secret-key-for-testing-purposes-only',
            }),
          ],
        }),
        AppModule,
      ],
    }).compile();
  });

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

  it('should have AppModule', () => {
    const appModule = module.get<AppModule>(AppModule);
    expect(appModule).toBeDefined();
  });

  it('should configure middleware correctly', () => {
    const appModule = module.get<AppModule>(AppModule);
    const mockApply = jest.fn().mockReturnThis();
    const mockForRoutes = jest.fn().mockReturnThis();
    const mockConsumer = {
      apply: mockApply,
      forRoutes: mockForRoutes,
    } as unknown as MiddlewareConsumer;

    appModule.configure(mockConsumer);

    expect(mockApply).toHaveBeenCalled();
    expect(mockForRoutes).toHaveBeenCalledWith({
      path: '*',
      method: RequestMethod.ALL,
    });
  });
});
