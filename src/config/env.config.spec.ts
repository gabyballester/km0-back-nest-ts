import { envConfig } from './env.config';
import { ENV_KEYS, ENV_VALUES } from '@/shared/constants/environment';

describe('envConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('default values', () => {
    it('should return default values when environment variables are not set', () => {
      // Limpiar variables de entorno
      delete process.env[ENV_KEYS.NODE_ENV];
      delete process.env[ENV_KEYS.PORT];
      delete process.env[ENV_KEYS.HOST];
      delete process.env[ENV_KEYS.DATABASE_URL];
      delete process.env[ENV_KEYS.DATABASE_ORM];
      delete process.env[ENV_KEYS.JWT_SECRET];
      delete process.env[ENV_KEYS.JWT_EXPIRES_IN];
      delete process.env[ENV_KEYS.COOKIE_SECRET];
      delete process.env[ENV_KEYS.THROTTLE_TTL];
      delete process.env[ENV_KEYS.THROTTLE_LIMIT];
      delete process.env[ENV_KEYS.CORS_ORIGIN];
      delete process.env[ENV_KEYS.LOG_LEVEL];

      const config = envConfig();

      expect(config.nodeEnv).toBe(ENV_VALUES.NODE_ENV.DEVELOPMENT);
      expect(config.port).toBe(4000);
      expect(config.host).toBe('localhost');
      expect(config.databaseUrl).toBeUndefined();
      expect(config.databaseOrm).toBe(ENV_VALUES.DATABASE_ORM.PRISMA);
      expect(config.jwtSecret).toBeUndefined();
      expect(config.jwtExpiresIn).toBe('86400');
      expect(config.cookieSecret).toBeUndefined();
      expect(config.throttleTtl).toBe(60);
      expect(config.throttleLimit).toBe(100);
      expect(config.corsOrigin).toBe('http://localhost:3000');
      expect(config.logLevel).toBe(ENV_VALUES.LOG_LEVEL.INFO);
    });
  });

  describe('custom values', () => {
    it('should return custom values when environment variables are set', () => {
      process.env[ENV_KEYS.NODE_ENV] = ENV_VALUES.NODE_ENV.PRODUCTION;
      process.env[ENV_KEYS.PORT] = '5000';
      process.env[ENV_KEYS.HOST] = '0.0.0.0';
      process.env[ENV_KEYS.DATABASE_URL] =
        'postgresql://user:pass@localhost:5432/db';
      process.env[ENV_KEYS.JWT_SECRET] = 'test-secret';
      process.env[ENV_KEYS.JWT_EXPIRES_IN] = '3600';
      process.env[ENV_KEYS.COOKIE_SECRET] = 'cookie-secret';
      process.env[ENV_KEYS.THROTTLE_TTL] = '120';
      process.env[ENV_KEYS.THROTTLE_LIMIT] = '200';
      process.env[ENV_KEYS.CORS_ORIGIN] = 'https://example.com';
      process.env[ENV_KEYS.LOG_LEVEL] = 'debug';

      const config = envConfig();

      expect(config.nodeEnv).toBe(ENV_VALUES.NODE_ENV.PRODUCTION);
      expect(config.port).toBe(5000);
      expect(config.host).toBe('0.0.0.0');
      expect(config.databaseUrl).toBe(
        'postgresql://user:pass@localhost:5432/db',
      );
      expect(config.jwtSecret).toBe('test-secret');
      expect(config.jwtExpiresIn).toBe('3600');
      expect(config.cookieSecret).toBe('cookie-secret');
      expect(config.throttleTtl).toBe(120);
      expect(config.throttleLimit).toBe(200);
      expect(config.corsOrigin).toBe('https://example.com');
      expect(config.logLevel).toBe('debug');
    });
  });

  describe('port parsing', () => {
    it('should parse port as integer', () => {
      process.env[ENV_KEYS.PORT] = '8080';

      const config = envConfig();

      expect(config.port).toBe(8080);
      expect(typeof config.port).toBe('number');
    });

    it('should handle invalid port gracefully', () => {
      process.env[ENV_KEYS.PORT] = 'invalid';

      const config = envConfig();

      expect(config.port).toBe(4000); // Default value
    });
  });

  describe('throttle parsing', () => {
    it('should parse throttle values as integers', () => {
      process.env[ENV_KEYS.THROTTLE_TTL] = '300';
      process.env[ENV_KEYS.THROTTLE_LIMIT] = '500';

      const config = envConfig();

      expect(config.throttleTtl).toBe(300);
      expect(config.throttleLimit).toBe(500);
      expect(typeof config.throttleTtl).toBe('number');
      expect(typeof config.throttleLimit).toBe('number');
    });

    it('should handle invalid throttle values gracefully', () => {
      process.env[ENV_KEYS.THROTTLE_TTL] = 'invalid';
      process.env[ENV_KEYS.THROTTLE_LIMIT] = 'invalid';

      const config = envConfig();

      expect(config.throttleTtl).toBe(60); // Default value
      expect(config.throttleLimit).toBe(100); // Default value
    });
  });

  describe('function structure', () => {
    it('should return a function that returns an object', () => {
      expect(typeof envConfig).toBe('function');

      const result = envConfig();
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('nodeEnv');
      expect(result).toHaveProperty('port');
      expect(result).toHaveProperty('host');
      expect(result).toHaveProperty('databaseUrl');
      expect(result).toHaveProperty('databaseOrm');
      expect(result).toHaveProperty('jwtSecret');
      expect(result).toHaveProperty('jwtExpiresIn');
      expect(result).toHaveProperty('cookieSecret');
      expect(result).toHaveProperty('throttleTtl');
      expect(result).toHaveProperty('throttleLimit');
      expect(result).toHaveProperty('corsOrigin');
      expect(result).toHaveProperty('logLevel');
    });
  });
});
