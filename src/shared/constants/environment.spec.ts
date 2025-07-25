import {
  ENV_VALUES,
  isDevelopment,
  isProduction,
  isTest,
  isValidNodeEnv,
} from './environment';

describe('Environment Constants', () => {
  describe('ENV_VALUES', () => {
    it('should have correct NODE_ENV values', () => {
      expect(ENV_VALUES.NODE_ENV.DEVELOPMENT).toBe('development');
      expect(ENV_VALUES.NODE_ENV.PRODUCTION).toBe('production');
      expect(ENV_VALUES.NODE_ENV.TEST).toBe('test');
    });

    it('should have correct LOG_LEVEL values', () => {
      expect(ENV_VALUES.LOG_LEVEL.ERROR).toBe('error');
      expect(ENV_VALUES.LOG_LEVEL.WARN).toBe('warn');
      expect(ENV_VALUES.LOG_LEVEL.INFO).toBe('info');
      expect(ENV_VALUES.LOG_LEVEL.DEBUG).toBe('debug');
    });
  });

  describe('isDevelopment', () => {
    it('should return true for development environment', () => {
      expect(isDevelopment('development')).toBe(true);
    });

    it('should return false for non-development environments', () => {
      expect(isDevelopment('production')).toBe(false);
      expect(isDevelopment('test')).toBe(false);
      expect(isDevelopment('staging')).toBe(false);
      expect(isDevelopment('')).toBe(false);
    });
  });

  describe('isProduction', () => {
    it('should return true for production environment', () => {
      expect(isProduction('production')).toBe(true);
    });

    it('should return false for non-production environments', () => {
      expect(isProduction('development')).toBe(false);
      expect(isProduction('test')).toBe(false);
      expect(isProduction('staging')).toBe(false);
      expect(isProduction('')).toBe(false);
    });
  });

  describe('isTest', () => {
    it('should return true for test environment', () => {
      expect(isTest('test')).toBe(true);
    });

    it('should return false for non-test environments', () => {
      expect(isTest('development')).toBe(false);
      expect(isTest('production')).toBe(false);
      expect(isTest('staging')).toBe(false);
      expect(isTest('')).toBe(false);
    });
  });

  describe('isValidNodeEnv', () => {
    it('should return true for valid Node environments', () => {
      expect(isValidNodeEnv('development')).toBe(true);
      expect(isValidNodeEnv('production')).toBe(true);
      expect(isValidNodeEnv('test')).toBe(true);
    });

    it('should return false for invalid Node environments', () => {
      expect(isValidNodeEnv('staging')).toBe(false);
      expect(isValidNodeEnv('dev')).toBe(false);
      expect(isValidNodeEnv('prod')).toBe(false);
      expect(isValidNodeEnv('')).toBe(false);
      expect(isValidNodeEnv('invalid')).toBe(false);
    });
  });
});
