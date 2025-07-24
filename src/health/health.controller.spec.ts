import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthController } from './health.controller';

// Mock Swagger decorators for tests
jest.mock('@nestjs/swagger', () => ({
  ApiTags: (): (() => void) => (): void => {},
  ApiOperation: (): (() => void) => (): void => {},
  ApiResponse: (): (() => void) => (): void => {},
}));

describe('HealthController', () => {
  let controller: HealthController;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [
            () => ({
              NODE_ENV: 'development',
            }),
          ],
        }),
      ],
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(jest.clearAllMocks);

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return health status', () => {
      const result = controller.getHealth();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('environment');
      expect(typeof result.timestamp).toBe('string');
      expect(typeof result.uptime).toBe('number');
      expect(typeof result.environment).toBe('string');
    });

    it('should return valid timestamp', () => {
      const result = controller.getHealth();
      const timestamp = new Date(result.timestamp);

      expect(timestamp.getTime()).not.toBeNaN();
      expect(timestamp).toBeInstanceOf(Date);
    });

    it('should return valid uptime', () => {
      const result = controller.getHealth();

      expect(result.uptime).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(result.uptime)).toBe(true);
    });

    it('should return environment from ConfigService', () => {
      const result = controller.getHealth();
      const nodeEnv = configService.get<string>('NODE_ENV');

      expect(result.environment).toBe(nodeEnv);
      expect(result.environment).toBe('development');
    });

    it('should handle different environment configurations', async () => {
      const productionModule: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            load: [
              () => ({
                NODE_ENV: 'production',
              }),
            ],
          }),
        ],
        controllers: [HealthController],
      }).compile();

      const productionController =
        productionModule.get<HealthController>(HealthController);
      const productionConfigService =
        productionModule.get<ConfigService>(ConfigService);

      const result = productionController.getHealth();
      const nodeEnv = productionConfigService.get<string>('NODE_ENV');

      expect(result.environment).toBe(nodeEnv);
      expect(result.environment).toBe('production');
    });

    it('should return default environment if ConfigService returns undefined', () => {
      jest.spyOn(configService, 'get').mockReturnValueOnce(undefined);
      const result = controller.getHealth();
      expect(result.environment).toBe('development');
    });

    it('should return default environment if ConfigService returns null', () => {
      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce(null as unknown as string);
      const result = controller.getHealth();
      expect(result.environment).toBe('development');
    });
  });

  describe('getDetailedHealth', () => {
    it('should return detailed health status', () => {
      const result = controller.getDetailedHealth();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('environment');
      expect(result).toHaveProperty('memory');
      expect(result).toHaveProperty('version');
    });

    it('should return valid memory information', () => {
      const result = controller.getDetailedHealth();

      expect(result.memory).toHaveProperty('used');
      expect(result.memory).toHaveProperty('total');
      expect(result.memory).toHaveProperty('percentage');
      expect(typeof result.memory.used).toBe('number');
      expect(typeof result.memory.total).toBe('number');
      expect(typeof result.memory.percentage).toBe('number');
      expect(result.memory.used).toBeGreaterThanOrEqual(0);
      expect(result.memory.total).toBeGreaterThan(0);
      expect(result.memory.percentage).toBeGreaterThanOrEqual(0);
      expect(result.memory.percentage).toBeLessThanOrEqual(100);
    });

    it('should return valid version', () => {
      const result = controller.getDetailedHealth();

      expect(typeof result.version).toBe('string');
      expect(result.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should calculate memory percentage correctly', () => {
      const result = controller.getDetailedHealth();
      const calculatedPercentage = Math.round(
        (result.memory.used / result.memory.total) * 100,
      );

      // Allow for small rounding differences due to timing and async operations
      expect(
        Math.abs(result.memory.percentage - calculatedPercentage),
      ).toBeLessThanOrEqual(2);
    });

    it('should return environment from ConfigService in detailed health', () => {
      const result = controller.getDetailedHealth();
      const nodeEnv = configService.get<string>('NODE_ENV');

      expect(result.environment).toBe(nodeEnv);
      expect(result.environment).toBe('development');
    });

    it('should return default environment if ConfigService returns undefined', () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return undefined;
        if (key === 'npm_package_version') return '1.2.3';
        return undefined;
      });
      const result = controller.getDetailedHealth();
      expect(result.environment).toBe('development');
    });

    it('should return default environment if ConfigService returns null', () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return null as unknown as string;
        if (key === 'npm_package_version') return '1.2.3';
        return undefined;
      });
      const result = controller.getDetailedHealth();
      expect(result.environment).toBe('development');
    });

    it('should return default version if ConfigService returns undefined', () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'test';
        if (key === 'npm_package_version') return undefined;
        return undefined;
      });
      const result = controller.getDetailedHealth();
      expect(result.version).toBe('0.0.1');
    });

    it('should return default version if ConfigService returns null', () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'test';
        if (key === 'npm_package_version') return null as unknown as string;
        return undefined;
      });
      const result = controller.getDetailedHealth();
      expect(result.version).toBe('0.0.1');
    });
  });
});
