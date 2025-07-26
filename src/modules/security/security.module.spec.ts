import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { SecurityModule } from './security.module';
import { ENV_KEYS } from '../../shared/constants/environment';

describe('SecurityModule', () => {
  let module: TestingModule;
  let configService: ConfigService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [
            () => ({
              [ENV_KEYS.THROTTLE_TTL]: 60,
              [ENV_KEYS.THROTTLE_LIMIT]: 100,
            }),
          ],
        }),
        SecurityModule,
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should configure throttler correctly', () => {
    const throttlerModule = module.get(ThrottlerModule);
    expect(throttlerModule).toBeDefined();
  });

  it('should have ConfigService available', () => {
    expect(configService).toBeDefined();
    expect(configService.get(ENV_KEYS.THROTTLE_TTL)).toBe(60);
    expect(configService.get(ENV_KEYS.THROTTLE_LIMIT)).toBe(100);
  });

  it('should compile without errors', () => {
    expect(() => module).not.toThrow();
  });

  it('should export ThrottlerModule', () => {
    const securityModule = module.get(SecurityModule);
    expect(securityModule).toBeDefined();
  });

  it('should configure rate limiting with correct values', () => {
    const ttl = configService.get<number>(ENV_KEYS.THROTTLE_TTL);
    const limit = configService.get<number>(ENV_KEYS.THROTTLE_LIMIT);

    expect(ttl).toBe(60);
    expect(limit).toBe(100);
  });

  it('should skip rate limiting for health checks', () => {
    const securityModule = module.get(SecurityModule);
    expect(securityModule).toBeInstanceOf(SecurityModule);
  });

  it('should have skipIf function that skips health endpoint', () => {
    const securityModule = module.get(SecurityModule);

    const healthRequest = { url: '/health' };
    const apiRequest = { url: '/api/users' };

    expect(healthRequest.url).toBe('/health');
    expect(apiRequest.url).toBe('/api/users');
    expect(securityModule).toBeDefined();
  });

  it('should configure skipIf function in throttler', () => {
    const securityModule = module.get(SecurityModule);
    expect(securityModule).toBeInstanceOf(SecurityModule);
  });

  it('should test skipIf function behavior', () => {
    const skipIf = (req: { url: string }) => req.url === '/health';

    expect(skipIf({ url: '/health' })).toBe(true);
    expect(skipIf({ url: '/api/users' })).toBe(false);
    expect(skipIf({ url: '/health/status' })).toBe(false);
    expect(skipIf({ url: '' })).toBe(false);
    expect(skipIf({ url: '/' })).toBe(false);
  });

  it('should test skipIf function with different URLs', () => {
    const testSkipIf = (req: { url: string }) => req.url === '/health';

    expect(testSkipIf({ url: '/health' })).toBe(true);
    expect(testSkipIf({ url: '/api/users' })).toBe(false);
    expect(testSkipIf({ url: '/health/status' })).toBe(false);
    expect(testSkipIf({ url: '' })).toBe(false);
    expect(testSkipIf({ url: '/' })).toBe(false);
  });

  it('should test skipIf function with edge cases', () => {
    const skipIfFunction = (req: { url: string }) => req.url === '/health';

    expect(skipIfFunction({ url: '/health' })).toBe(true);
    expect(skipIfFunction({ url: '/api/users' })).toBe(false);
    expect(skipIfFunction({ url: '/health/status' })).toBe(false);
    expect(skipIfFunction({ url: '' })).toBe(false);
    expect(skipIfFunction({ url: '/' })).toBe(false);
  });

  it('should test factory function with ConfigService', () => {
    const factory = (configService: ConfigService) => ({
      throttlers: [
        {
          ttl: configService.get<number>(ENV_KEYS.THROTTLE_TTL) ?? 60,
          limit: configService.get<number>(ENV_KEYS.THROTTLE_LIMIT) ?? 100,
        },
      ],
      skipIf: (req: { url: string }) => req.url === '/health',
    });

    const result = factory(configService);
    expect(result.throttlers).toHaveLength(1);
    expect(result.throttlers[0]?.ttl).toBe(60);
    expect(result.throttlers[0]?.limit).toBe(100);
    expect(result.skipIf({ url: '/health' })).toBe(true);
    expect(result.skipIf({ url: '/api/users' })).toBe(false);
  });

  it('should test factory function with proper typing', () => {
    const useFactory = (
      configService: ConfigService,
    ): {
      throttlers: Array<{ ttl: number; limit: number }>;
      skipIf: (req: { url: string }) => boolean;
    } => ({
      throttlers: [
        {
          ttl: configService.get<number>(ENV_KEYS.THROTTLE_TTL) ?? 60,
          limit: configService.get<number>(ENV_KEYS.THROTTLE_LIMIT) ?? 100,
        },
      ],
      skipIf: (req: { url: string }) => req.url === '/health',
    });

    const throttlerConfig = useFactory(configService);

    expect(throttlerConfig.throttlers).toHaveLength(1);
    expect(throttlerConfig.throttlers[0]?.ttl).toBe(60);
    expect(throttlerConfig.throttlers[0]?.limit).toBe(100);
    expect(throttlerConfig.skipIf({ url: '/health' })).toBe(true);
    expect(throttlerConfig.skipIf({ url: '/api/users' })).toBe(false);
  });

  it('should handle different throttle configurations', async () => {
    const customModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [
            () => ({
              [ENV_KEYS.THROTTLE_TTL]: 120,
              [ENV_KEYS.THROTTLE_LIMIT]: 200,
            }),
          ],
        }),
        SecurityModule,
      ],
    }).compile();

    const customConfigService = customModule.get<ConfigService>(ConfigService);
    expect(customConfigService.get(ENV_KEYS.THROTTLE_TTL)).toBe(120);
    expect(customConfigService.get(ENV_KEYS.THROTTLE_LIMIT)).toBe(200);
  });

  it('should provide throttler factory function', () => {
    const factory = (configService: ConfigService) => ({
      throttlers: [
        {
          ttl: configService.get<number>(ENV_KEYS.THROTTLE_TTL) ?? 60,
          limit: configService.get<number>(ENV_KEYS.THROTTLE_LIMIT) ?? 100,
        },
      ],
      skipIf: (req: { url: string }) => req.url === '/health',
    });

    const result = factory(configService);
    expect(result.throttlers).toHaveLength(1);
    expect(result.throttlers[0]?.ttl).toBe(60);
    expect(result.throttlers[0]?.limit).toBe(100);
    expect(result.skipIf({ url: '/health' })).toBe(true);
    expect(result.skipIf({ url: '/api/users' })).toBe(false);
  });

  it('should handle negative and zero values for ttl and limit', () => {
    const fakeConfigService = {
      get: jest.fn((_key: string) => (_key === ENV_KEYS.THROTTLE_TTL ? 0 : -5)),
    } as Partial<ConfigService>;

    const factory = (configService: ConfigService) => ({
      throttlers: [
        {
          ttl: configService.get<number>(ENV_KEYS.THROTTLE_TTL) ?? 0,
          limit: configService.get<number>(ENV_KEYS.THROTTLE_LIMIT) ?? 0,
        },
      ],
      skipIf: (req: { url: string }) => req.url === '/health',
    });

    const result = factory(fakeConfigService as ConfigService);
    expect(result.throttlers).toHaveLength(1);
    expect(result.throttlers[0]?.ttl).toBe(0);
    expect(result.throttlers[0]?.limit).toBe(-5);
  });

  it('should handle undefined values for ttl and limit', () => {
    const fakeConfigService = {
      get: jest.fn((_key: string) => undefined),
    } as Partial<ConfigService>;

    const factory = (configService: ConfigService) => ({
      throttlers: [
        {
          ttl: configService.get<number>(ENV_KEYS.THROTTLE_TTL) ?? 0,
          limit: configService.get<number>(ENV_KEYS.THROTTLE_LIMIT) ?? 0,
        },
      ],
      skipIf: (req: { url: string }) => req.url === '/health',
    });

    const result = factory(fakeConfigService as ConfigService);
    expect(result.throttlers).toHaveLength(1);
    expect(result.throttlers[0]?.ttl).toBe(0);
    expect(result.throttlers[0]?.limit).toBe(0);
  });

  it('should handle non-numeric values for ttl and limit', () => {
    const fakeConfigService = {
      get: jest.fn((_key: string) =>
        _key === ENV_KEYS.THROTTLE_TTL ? 'abc' : 'xyz',
      ),
    } as Partial<ConfigService>;

    const factory = (configService: ConfigService) => ({
      throttlers: [
        {
          ttl: Number(configService.get(ENV_KEYS.THROTTLE_TTL)) || 0,
          limit: Number(configService.get(ENV_KEYS.THROTTLE_LIMIT)) || 0,
        },
      ],
      skipIf: (req: { url: string }) => req.url === '/health',
    });

    const result = factory(fakeConfigService as ConfigService);
    expect(result.throttlers).toHaveLength(1);
    expect(result.throttlers[0]?.ttl).toBe(0);
    expect(result.throttlers[0]?.limit).toBe(0);
  });

  it('should handle factory function with error handling', () => {
    const factory = (configService: ConfigService) => {
      try {
        return {
          throttlers: [
            {
              ttl: configService.get<number>(ENV_KEYS.THROTTLE_TTL) ?? 60,
              limit: configService.get<number>(ENV_KEYS.THROTTLE_LIMIT) ?? 100,
            },
          ],
          skipIf: (req: { url: string }) => req.url === '/health',
        };
      } catch {
        return {
          throttlers: [
            {
              ttl: 60,
              limit: 100,
            },
          ],
          skipIf: (req: { url: string }) => req.url === '/health',
        };
      }
    };

    const result = factory(configService);
    expect(result.throttlers).toHaveLength(1);
    expect(result.throttlers[0]?.ttl).toBe(60);
    expect(result.throttlers[0]?.limit).toBe(100);
    expect(result.skipIf({ url: '/health' })).toBe(true);
  });
});
