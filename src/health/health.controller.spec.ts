import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HealthController } from './health.controller';
import { DatabaseService } from '../infrastructure/database/database.service';
import { ENV_VALUES } from '../shared/constants/environment';

// Mock Swagger decorators for tests
jest.mock('@nestjs/swagger', () => ({
  ApiTags: (): (() => void) => (): void => {},
  ApiOperation: (): (() => void) => (): void => {},
  ApiResponse: (): (() => void) => (): void => {},
}));

describe('HealthController', () => {
  let controller: HealthController;
  let configService: ConfigService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: DatabaseService,
          useValue: {
            healthCheck: jest.fn(),
            getDatabaseInfo: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    configService = module.get<ConfigService>(ConfigService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(jest.clearAllMocks);

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('private methods', () => {
    it('should get database name correctly', () => {
      const dbInfo = {
        database_name: 'test_db',
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 14.0',
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result = (controller as any).getDatabaseName(dbInfo);
      expect(result).toBe('test_db');
    });

    it('should get database name as unknown when null', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result = (controller as any).getDatabaseName(null);
      expect(result).toBe('unknown');
    });

    it('should get database name as unknown when missing', () => {
      const dbInfo = {
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 14.0',
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result = (controller as any).getDatabaseName(dbInfo);
      expect(result).toBe('unknown');
    });

    it('should get database version correctly', () => {
      const dbInfo = {
        postgres_version: 'PostgreSQL 14.0',
        current_user: 'test_user',
        database_name: 'test_db',
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result = (controller as any).getDatabaseVersion(dbInfo);
      expect(result).toBe('PostgreSQL 14.0');
    });

    it('should get database version as unknown when null', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result = (controller as any).getDatabaseVersion(null);
      expect(result).toBe('unknown');
    });

    it('should get database version as unknown when missing', () => {
      const dbInfo = {
        current_user: 'test_user',
        database_name: 'test_db',
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result = (controller as any).getDatabaseVersion(dbInfo);
      expect(result).toBe('unknown');
    });
  });

  describe('getHealth', () => {
    it('should return health status when database is connected', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.DEVELOPMENT);

      const result = controller.getHealth();

      expect(result).toHaveProperty('status', 'healthy');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('environment');
      expect(result.environment).toBe(ENV_VALUES.NODE_ENV.DEVELOPMENT);
    });

    it('should return health status when database is disconnected', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(false);
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.PRODUCTION);

      const result = controller.getHealth();

      expect(result).toHaveProperty('status', 'unhealthy');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('environment');
      expect(result.environment).toBe(ENV_VALUES.NODE_ENV.PRODUCTION);
    });

    it('should return default environment if ConfigService returns undefined', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(configService, 'get').mockReturnValue(undefined);

      const result = controller.getHealth();

      expect(result.environment).toBe(ENV_VALUES.NODE_ENV.DEVELOPMENT);
    });

    it('should return default environment if ConfigService returns null', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(configService, 'get').mockReturnValue(null);

      const result = controller.getHealth();

      expect(result.environment).toBe(ENV_VALUES.NODE_ENV.DEVELOPMENT);
    });
  });

  describe('getDetailedHealth', () => {
    it('should return detailed health status', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        database_name: 'test_db',
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 14.0',
      });
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.DEVELOPMENT);

      const result = controller.getDetailedHealth();

      expect(result).toHaveProperty('status', 'healthy');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('environment');
      expect(result).toHaveProperty('database');
      expect(result).toHaveProperty('system');
      expect(result).toHaveProperty('services');
      expect(result.database.status).toBe('connected');
      expect(result.database.info.name).toBe('test_db');
      expect(result.database.info.type).toBe('PostgreSQL');
      expect(result.database.info.version).toBe('PostgreSQL 14.0');
    });

    it('should return valid memory information', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        database_name: 'test_db',
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 14.0',
      });
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.DEVELOPMENT);

      const result = controller.getDetailedHealth();

      expect(result.system.memory).toHaveProperty('used');
      expect(result.system.memory).toHaveProperty('total');
      expect(result.system.memory).toHaveProperty('free');
      expect(typeof result.system.memory.used).toBe('number');
      expect(typeof result.system.memory.total).toBe('number');
      expect(typeof result.system.memory.free).toBe('number');
    });

    it('should return valid system information', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        database_name: 'test_db',
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 14.0',
      });
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.DEVELOPMENT);

      const result = controller.getDetailedHealth();

      expect(result.system).toHaveProperty('nodeVersion');
      expect(result.system).toHaveProperty('platform');
      expect(result.system).toHaveProperty('cpu');
      expect(result.system.cpu).toHaveProperty('load');
      expect(result.system.cpu).toHaveProperty('cores');
      expect(Array.isArray(result.system.cpu.load)).toBe(true);
      expect(typeof result.system.cpu.cores).toBe('number');
    });

    it('should return environment from ConfigService in detailed health', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        database_name: 'test_db',
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 14.0',
      });
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.PRODUCTION);

      const result = controller.getDetailedHealth();

      expect(result.environment).toBe(ENV_VALUES.NODE_ENV.PRODUCTION);
    });

    it('should return default environment if ConfigService returns undefined', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        database_name: 'test_db',
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 14.0',
      });
      jest.spyOn(configService, 'get').mockReturnValue(undefined);

      const result = controller.getDetailedHealth();

      expect(result.environment).toBe(ENV_VALUES.NODE_ENV.DEVELOPMENT);
    });

    it('should return default environment if ConfigService returns null', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        database_name: 'test_db',
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 14.0',
      });
      jest.spyOn(configService, 'get').mockReturnValue(null);

      const result = controller.getDetailedHealth();

      expect(result.environment).toBe(ENV_VALUES.NODE_ENV.DEVELOPMENT);
    });

    it('should handle null database info', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue(null);
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.DEVELOPMENT);

      const result = controller.getDetailedHealth();

      expect(result.database.info.name).toBe('unknown');
      expect(result.database.info.type).toBe('PostgreSQL');
      expect(result.database.info.version).toBe('unknown');
    });

    it('should handle database info with missing database_name', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 14.0',
        // database_name is missing
      } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.DEVELOPMENT);

      const result = controller.getDetailedHealth();

      expect(result.database.info.name).toBe('unknown');
      expect(result.database.info.type).toBe('PostgreSQL');
      expect(result.database.info.version).toBe('PostgreSQL 14.0');
    });

    it('should handle database info with missing postgres_version', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        database_name: 'test_db',
        current_user: 'test_user',
        // postgres_version is missing
      } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.DEVELOPMENT);

      const result = controller.getDetailedHealth();

      expect(result.database.info.name).toBe('test_db');
      expect(result.database.info.type).toBe('PostgreSQL');
      expect(result.database.info.version).toBe('unknown');
    });

    it('should handle database info with both missing properties', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        current_user: 'test_user',
        // database_name and postgres_version are missing
      } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.DEVELOPMENT);

      const result = controller.getDetailedHealth();

      expect(result.database.info.name).toBe('unknown');
      expect(result.database.info.type).toBe('PostgreSQL');
      expect(result.database.info.version).toBe('unknown');
    });

    it('should handle database info with empty string database_name', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        database_name: '',
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 14.0',
      });
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.DEVELOPMENT);

      const result = controller.getDetailedHealth();

      expect(result.database.info.name).toBe('unknown');
      expect(result.database.info.type).toBe('PostgreSQL');
      expect(result.database.info.version).toBe('PostgreSQL 14.0');
    });

    it('should handle database info with empty string postgres_version', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        database_name: 'test_db',
        current_user: 'test_user',
        postgres_version: '',
      });
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.DEVELOPMENT);

      const result = controller.getDetailedHealth();

      expect(result.database.info.name).toBe('test_db');
      expect(result.database.info.type).toBe('PostgreSQL');
      expect(result.database.info.version).toBe('unknown');
    });

    it('should handle database info with falsy database_name', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        database_name: 0 as any, // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 14.0',
      });
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.DEVELOPMENT);

      const result = controller.getDetailedHealth();

      expect(result.database.info.name).toBe('unknown');
      expect(result.database.info.type).toBe('PostgreSQL');
      expect(result.database.info.version).toBe('PostgreSQL 14.0');
    });

    it('should handle database info with falsy postgres_version', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        database_name: 'test_db',
        current_user: 'test_user',
        postgres_version: false as any, // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
      });
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.DEVELOPMENT);

      const result = controller.getDetailedHealth();

      expect(result.database.info.name).toBe('test_db');
      expect(result.database.info.type).toBe('PostgreSQL');
      expect(result.database.info.version).toBe('unknown');
    });
  });
});
