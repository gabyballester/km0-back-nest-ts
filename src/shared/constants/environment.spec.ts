import {
  ENV_KEYS,
  ENV_VALUES,
  DEFAULT_ENV_VALUES,
  isValidNodeEnv,
} from './environment';

describe('Environment Constants', () => {
  describe('ENV_KEYS', () => {
    it('should have all required environment keys', () => {
      expect(ENV_KEYS).toHaveProperty('NODE_ENV');
      expect(ENV_KEYS).toHaveProperty('PORT');
      expect(ENV_KEYS).toHaveProperty('DATABASE_ORM');
      expect(ENV_KEYS).toHaveProperty('DATABASE_URL');
      expect(ENV_KEYS).toHaveProperty('JWT_SECRET');
      expect(ENV_KEYS).toHaveProperty('JWT_EXPIRES_IN');
      expect(ENV_KEYS).toHaveProperty('THROTTLE_TTL');
      expect(ENV_KEYS).toHaveProperty('THROTTLE_LIMIT');
      expect(ENV_KEYS).toHaveProperty('CORS_ORIGIN');
      expect(ENV_KEYS).toHaveProperty('LOG_LEVEL');
    });

    it('should have correct key values', () => {
      expect(ENV_KEYS.NODE_ENV).toBe('NODE_ENV');
      expect(ENV_KEYS.PORT).toBe('PORT');
      expect(ENV_KEYS.DATABASE_ORM).toBe('DATABASE_ORM');
      expect(ENV_KEYS.DATABASE_URL).toBe('DATABASE_URL');
      expect(ENV_KEYS.JWT_SECRET).toBe('JWT_SECRET');
      expect(ENV_KEYS.JWT_EXPIRES_IN).toBe('JWT_EXPIRES_IN');
      expect(ENV_KEYS.THROTTLE_TTL).toBe('THROTTLE_TTL');
      expect(ENV_KEYS.THROTTLE_LIMIT).toBe('THROTTLE_LIMIT');
      expect(ENV_KEYS.CORS_ORIGIN).toBe('CORS_ORIGIN');
      expect(ENV_KEYS.LOG_LEVEL).toBe('LOG_LEVEL');
    });
  });

  describe('ENV_VALUES', () => {
    it('should have NODE_ENV values', () => {
      expect(ENV_VALUES.NODE_ENV).toHaveProperty('DEVELOPMENT');
      expect(ENV_VALUES.NODE_ENV).toHaveProperty('TEST');
      expect(ENV_VALUES.NODE_ENV).toHaveProperty('PRODUCTION');
    });

    it('should have DATABASE_ORM values', () => {
      expect(ENV_VALUES.DATABASE_ORM).toHaveProperty('PRISMA');
    });

    it('should have LOG_LEVEL values', () => {
      expect(ENV_VALUES.LOG_LEVEL).toHaveProperty('ERROR');
      expect(ENV_VALUES.LOG_LEVEL).toHaveProperty('WARN');
      expect(ENV_VALUES.LOG_LEVEL).toHaveProperty('INFO');
      expect(ENV_VALUES.LOG_LEVEL).toHaveProperty('DEBUG');
    });

    it('should have correct NODE_ENV values', () => {
      expect(ENV_VALUES.NODE_ENV.DEVELOPMENT).toBe('development');
      expect(ENV_VALUES.NODE_ENV.TEST).toBe('test');
      expect(ENV_VALUES.NODE_ENV.PRODUCTION).toBe('production');
    });

    it('should have correct DATABASE_ORM values', () => {
      expect(ENV_VALUES.DATABASE_ORM.PRISMA).toBe('prisma');
    });

    it('should have correct LOG_LEVEL values', () => {
      expect(ENV_VALUES.LOG_LEVEL.ERROR).toBe('error');
      expect(ENV_VALUES.LOG_LEVEL.WARN).toBe('warn');
      expect(ENV_VALUES.LOG_LEVEL.INFO).toBe('info');
      expect(ENV_VALUES.LOG_LEVEL.DEBUG).toBe('debug');
    });
  });

  describe('DEFAULT_ENV_VALUES', () => {
    it('should have default values for all keys', () => {
      expect(DEFAULT_ENV_VALUES).toHaveProperty('NODE_ENV');
      expect(DEFAULT_ENV_VALUES).toHaveProperty('PORT');
      expect(DEFAULT_ENV_VALUES).toHaveProperty('DATABASE_ORM');
      expect(DEFAULT_ENV_VALUES).toHaveProperty('JWT_EXPIRES_IN');
      expect(DEFAULT_ENV_VALUES).toHaveProperty('THROTTLE_TTL');
      expect(DEFAULT_ENV_VALUES).toHaveProperty('THROTTLE_LIMIT');
      expect(DEFAULT_ENV_VALUES).toHaveProperty('LOG_LEVEL');
    });

    it('should have correct default values', () => {
      expect(DEFAULT_ENV_VALUES.NODE_ENV).toBe('development');
      expect(DEFAULT_ENV_VALUES.PORT).toBe(4000);
      expect(DEFAULT_ENV_VALUES.HOST).toBe('localhost');
      expect(DEFAULT_ENV_VALUES.DATABASE_ORM).toBe('prisma');
      expect(DEFAULT_ENV_VALUES.THROTTLE_TTL).toBe(60);
      expect(DEFAULT_ENV_VALUES.THROTTLE_LIMIT).toBe(100);
      expect(DEFAULT_ENV_VALUES.CORS_ORIGIN).toBe('http://localhost:3000');
      expect(DEFAULT_ENV_VALUES.LOG_LEVEL).toBe('info');
    });
  });

  describe('isValidNodeEnv', () => {
    it('should return true for valid node environments', () => {
      expect(isValidNodeEnv('development')).toBe(true);
      expect(isValidNodeEnv('test')).toBe(true);
      expect(isValidNodeEnv('production')).toBe(true);
    });

    it('should return false for invalid node environments', () => {
      expect(isValidNodeEnv('invalid')).toBe(false);
      expect(isValidNodeEnv('')).toBe(false);
      expect(isValidNodeEnv('staging')).toBe(false);
    });

    it('should be case sensitive', () => {
      expect(isValidNodeEnv('Development')).toBe(false);
      expect(isValidNodeEnv('TEST')).toBe(false);
      expect(isValidNodeEnv('PRODUCTION')).toBe(false);
    });
  });
});
