import { EnvironmentLogger } from './environment-logger';

describe('EnvironmentLogger', () => {
  let logger: EnvironmentLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new EnvironmentLogger();
    // Mock console.log y console.error para capturar output
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Reset singleton instance
    (EnvironmentLogger as any).instance = undefined;
  });

  describe('constructor', () => {
    it('should create an instance with default environment', () => {
      expect(logger).toBeInstanceOf(EnvironmentLogger);
      expect(logger.getCurrentEnvironment()).toBe('development');
    });

    it('should extend NestJS Logger', () => {
      expect(logger).toBeInstanceOf(EnvironmentLogger);
    });
  });

  describe('initialize', () => {
    it('should set the environment correctly', () => {
      logger.initialize('production');
      expect(logger.getCurrentEnvironment()).toBe('production');
    });

    it('should handle different environment types', () => {
      const environments = ['development', 'production', 'test'];

      environments.forEach(env => {
        logger.initialize(env);
        expect(logger.getCurrentEnvironment()).toBe(env);
      });
    });
  });

  describe('getInstance (Singleton)', () => {
    it('should return the same instance', () => {
      const instance1 = EnvironmentLogger.getInstance();
      const instance2 = EnvironmentLogger.getInstance();

      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(EnvironmentLogger);
    });

    it('should create new instance if none exists', () => {
      const instance = EnvironmentLogger.getInstance();
      expect(instance).toBeInstanceOf(EnvironmentLogger);
    });
  });

  describe('logEnvironmentInfo', () => {
    it('should log environment information', () => {
      logger.initialize('development');
      logger.logEnvironmentInfo();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('NESTJS APPLICATION STARTUP'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Environment: DEVELOPMENT'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Process ID:'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Node Version:'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Platform:'),
      );
    });

    it('should include timestamp in logs', () => {
      const mockDate = new Date('2023-01-01T00:00:00.000Z');
      jest
        .spyOn(global, 'Date')
        .mockImplementation(() => mockDate as unknown as Date);

      logger.logEnvironmentInfo();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('2023-01-01T00:00:00.000Z'),
      );
    });
  });

  describe('logEnvironmentSpecificInfo', () => {
    it('should log development specific info', () => {
      logger.initialize('development');
      logger.logEnvironmentInfo();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('DEVELOPMENT MODE'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Hot reload enabled'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Verbose logging'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Debug mode active'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Source maps enabled'),
      );
    });

    it('should log production specific info', () => {
      logger.initialize('production');
      logger.logEnvironmentInfo();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('PRODUCTION MODE'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Performance optimized'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Security enhanced'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Minimal logging'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error tracking enabled'),
      );
    });

    it('should log test specific info', () => {
      logger.initialize('test');
      logger.logEnvironmentInfo();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('TEST MODE'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Test database'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Suppressed logging'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Fast execution'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Mock services active'),
      );
    });

    it('should log unknown environment info', () => {
      logger.initialize('unknown');
      logger.logEnvironmentInfo();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('UNKNOWN ENVIRONMENT'),
      );
    });
  });

  describe('logApplicationStart', () => {
    it('should log application start information', () => {
      logger.initialize('production');
      logger.logApplicationStart(3000);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('APPLICATION STARTED SUCCESSFULLY'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('http://localhost:3000'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Environment: PRODUCTION'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Health: http://localhost:3000/health'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('API Docs: http://localhost:3000/api'),
      );
    });

    it('should handle different ports', () => {
      logger.logApplicationStart(8080);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('http://localhost:8080'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Health: http://localhost:8080/health'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('API Docs: http://localhost:8080/api'),
      );
    });
  });

  describe('logStartupError', () => {
    it('should log startup error information', () => {
      const error = new Error('Database connection failed');
      logger.initialize('development');

      logger.logStartupError(error);

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('APPLICATION STARTUP FAILED'),
      );
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Environment: DEVELOPMENT'),
      );
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Error: Database connection failed'),
      );
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Stack:'),
      );
    });

    it('should include timestamp in error logs', () => {
      const mockDate = new Date('2023-01-01T00:00:00.000Z');
      jest
        .spyOn(global, 'Date')
        .mockImplementation(() => mockDate as unknown as Date);

      const error = new Error('Test error');
      logger.logStartupError(error);

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('2023-01-01T00:00:00.000Z'),
      );
    });
  });

  describe('getCurrentEnvironment', () => {
    it('should return current environment', () => {
      expect(logger.getCurrentEnvironment()).toBe('development');

      logger.initialize('production');
      expect(logger.getCurrentEnvironment()).toBe('production');

      logger.initialize('test');
      expect(logger.getCurrentEnvironment()).toBe('test');
    });
  });

  describe('isEnvironment', () => {
    it('should return true for matching environment', () => {
      logger.initialize('development');
      expect(logger.isEnvironment('development')).toBe(true);
      expect(logger.isEnvironment('production')).toBe(false);
      expect(logger.isEnvironment('test')).toBe(false);
    });

    it('should return false for non-matching environment', () => {
      logger.initialize('production');
      expect(logger.isEnvironment('development')).toBe(false);
      expect(logger.isEnvironment('production')).toBe(true);
      expect(logger.isEnvironment('test')).toBe(false);
    });

    it('should handle all environment types', () => {
      const environments: Array<'development' | 'production' | 'test'> = [
        'development',
        'production',
        'test',
      ];

      environments.forEach(env => {
        logger.initialize(env);
        environments.forEach(testEnv => {
          expect(logger.isEnvironment(testEnv)).toBe(env === testEnv);
        });
      });
    });
  });

  describe('Integration tests', () => {
    it('should work correctly with full workflow', () => {
      // Initialize with production
      logger.initialize('production');
      expect(logger.getCurrentEnvironment()).toBe('production');
      expect(logger.isEnvironment('production')).toBe(true);

      // Log environment info
      logger.logEnvironmentInfo();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('PRODUCTION MODE'),
      );

      // Log application start
      logger.logApplicationStart(4000);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('http://localhost:4000'),
      );

      // Log error
      const error = new Error('Test error');
      logger.logStartupError(error);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Test error'),
      );
    });

    it('should maintain state across method calls', () => {
      logger.initialize('test');

      // Multiple calls should maintain the same environment
      expect(logger.getCurrentEnvironment()).toBe('test');
      expect(logger.isEnvironment('test')).toBe(true);

      logger.logEnvironmentInfo();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('TEST MODE'),
      );

      // Environment should still be test
      expect(logger.getCurrentEnvironment()).toBe('test');
    });
  });
});
