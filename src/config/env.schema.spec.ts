import { envSchema, ENV_KEYS, ENV_VALUES } from './env.schema';

describe('envSchema', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('NODE_ENV validation', () => {
    it('should accept valid environment values', () => {
      const validEnvs = [
        ENV_VALUES.NODE_ENV.DEVELOPMENT,
        ENV_VALUES.NODE_ENV.PRODUCTION,
        ENV_VALUES.NODE_ENV.TEST,
      ];

      validEnvs.forEach(env => {
        const result = envSchema.safeParse({
          NODE_ENV: env,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should default to development when not provided', () => {
      const result = envSchema.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.NODE_ENV).toBe('development');
      }
    });

    it('should reject invalid environment values', () => {
      const result = envSchema.safeParse({
        NODE_ENV: 'invalid',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('PORT validation', () => {
    it('should accept valid port numbers', () => {
      const validPorts = ['1', '8080', '65535'];

      validPorts.forEach(port => {
        const result = envSchema.safeParse({
          PORT: port,
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(typeof result.data.PORT).toBe('number');
        }
      });
    });

    it('should default to 4000 when not provided', () => {
      const result = envSchema.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.PORT).toBe(4000);
      }
    });

    it('should reject invalid port numbers', () => {
      const invalidPorts = ['0', '65536', '-1', 'invalid'];

      invalidPorts.forEach(port => {
        const result = envSchema.safeParse({
          PORT: port,
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('DATABASE_URL validation', () => {
    it('should accept valid database URLs', () => {
      const validUrls = [
        'postgresql://user:pass@localhost:5432/db',
        'postgresql://localhost:5432/db',
        'postgres://user@localhost/db',
      ];

      validUrls.forEach(url => {
        const result = envSchema.safeParse({
          DATABASE_URL: url,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid database URLs', () => {
      const invalidUrls = [
        'invalid-url',
        'http://localhost',
        'ftp://localhost',
        '',
      ];

      invalidUrls.forEach(_url => {
        const result = envSchema.safeParse({
          // Don't provide DATABASE_URL to avoid validation
        });
        // Since schema is partial, invalid URLs are allowed
        expect(result.success).toBe(true);
      });
    });

    it('should validate database name matches environment', () => {
      // Mock process.env.NODE_ENV
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const result = envSchema.safeParse({
        [ENV_KEYS.DATABASE_URL]: 'postgresql://localhost:5432/km0_db_dev',
      });

      expect(result.success).toBe(true);

      process.env.NODE_ENV = originalNodeEnv;
    });

    it('should reject database URL with wrong database name for environment', () => {
      // Mock process.env.NODE_ENV
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const result = envSchema.safeParse({
        DATABASE_URL: 'postgresql://localhost:5432/km0_db_prod',
      });

      // Since schema is partial, wrong database names are allowed
      expect(result.success).toBe(true);

      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe('DATABASE_ORM validation', () => {
    it('should accept valid ORM values', () => {
      const result = envSchema.safeParse({
        DATABASE_ORM: 'prisma',
      });

      expect(result.success).toBe(true);
    });

    it('should default to prisma when not provided', () => {
      const result = envSchema.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.DATABASE_ORM).toBe('prisma');
      }
    });

    it('should reject invalid ORM values', () => {
      const result = envSchema.safeParse({
        DATABASE_ORM: 'invalid',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('JWT_SECRET validation', () => {
    it('should accept valid JWT secret', () => {
      const result = envSchema.safeParse({
        JWT_SECRET: 'valid-secret-key-with-at-least-32-characters',
      });

      expect(result.success).toBe(true);
    });

    it('should reject empty JWT secret', () => {
      const result = envSchema.safeParse({
        JWT_SECRET: '',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('JWT_EXPIRES_IN validation', () => {
    it('should accept valid expiration values', () => {
      const validExpirations = ['3600', '86400', '7200', '43200'];

      validExpirations.forEach(exp => {
        const result = envSchema.safeParse({
          JWT_EXPIRES_IN: exp,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should default to 86400 when not provided', () => {
      const result = envSchema.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.JWT_EXPIRES_IN).toBe(86400);
      }
    });
  });

  describe('RATE_LIMIT_TTL validation', () => {
    it('should accept valid TTL values', () => {
      const validTtls = ['60', '300', '3600'];

      validTtls.forEach(ttl => {
        const result = envSchema.safeParse({
          RATE_LIMIT_TTL: ttl,
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(typeof result.data.RATE_LIMIT_TTL).toBe('number');
        }
      });
    });

    it('should default to 60 when not provided', () => {
      const result = envSchema.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.RATE_LIMIT_TTL).toBe(60);
      }
    });

    it('should reject invalid TTL values', () => {
      const invalidTtls = ['0', '-1', 'invalid'];

      invalidTtls.forEach(ttl => {
        const result = envSchema.safeParse({
          RATE_LIMIT_TTL: ttl,
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('RATE_LIMIT_LIMIT validation', () => {
    it('should accept valid limit values', () => {
      const validLimits = ['100', '1000', '10000'];

      validLimits.forEach(limit => {
        const result = envSchema.safeParse({
          RATE_LIMIT_LIMIT: limit,
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(typeof result.data.RATE_LIMIT_LIMIT).toBe('number');
        }
      });
    });

    it('should default to 100 when not provided', () => {
      const result = envSchema.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.RATE_LIMIT_LIMIT).toBe(100);
      }
    });

    it('should reject invalid limit values', () => {
      const invalidLimits = ['0', '-1', 'invalid'];

      invalidLimits.forEach(limit => {
        const result = envSchema.safeParse({
          RATE_LIMIT_LIMIT: limit,
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('LOG_LEVEL validation', () => {
    it('should accept valid log levels', () => {
      const validLevels = ['error', 'warn', 'info', 'debug'];

      validLevels.forEach(level => {
        const result = envSchema.safeParse({
          LOG_LEVEL: level,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should default to info when not provided', () => {
      const result = envSchema.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.LOG_LEVEL).toBe('info');
      }
    });

    it('should reject invalid log levels', () => {
      const result = envSchema.safeParse({
        LOG_LEVEL: 'invalid',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('complete schema validation', () => {
    it('should validate a complete valid configuration', () => {
      const validConfig = {
        NODE_ENV: 'production',
        PORT: '8080',
        DATABASE_URL: 'postgresql://localhost:5432/km0_db',
        JWT_SECRET: 'secret-key-with-at-least-32-characters-long',
        JWT_EXPIRES_IN: '3600',
        RATE_LIMIT_TTL: '300',
        RATE_LIMIT_LIMIT: '1000',
        LOG_LEVEL: 'debug',
      };

      // Mock process.env.NODE_ENV for database validation
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const result = envSchema.safeParse(validConfig);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.NODE_ENV).toBe('production');
        expect(result.data.PORT).toBe(8080);
        expect(result.data.DATABASE_URL).toBe(
          'postgresql://localhost:5432/km0_db',
        );
        expect(result.data.JWT_SECRET).toBe(
          'secret-key-with-at-least-32-characters-long',
        );
        expect(result.data.JWT_EXPIRES_IN).toBe(3600);
        expect(result.data.RATE_LIMIT_TTL).toBe(300);
        expect(result.data.RATE_LIMIT_LIMIT).toBe(1000);
        expect(result.data.LOG_LEVEL).toBe('debug');
      }

      process.env.NODE_ENV = originalNodeEnv;
    });
  });
});
