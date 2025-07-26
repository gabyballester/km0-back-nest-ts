import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HealthController } from './health.controller';
import { DatabaseService } from '../infrastructure/database/database.service';
import { ENV_VALUES } from '../shared/constants/environment';

// Definir la interfaz localmente para evitar problemas de importación
interface DatabaseInfo {
  database_name: string;
  current_user: string;
  postgres_version: string;
}

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

    it('should get environment from ConfigService', () => {
      jest.spyOn(configService, 'get').mockReturnValue('production');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result = (controller as any).getEnvironment();
      expect(result).toBe('production');
    });

    it('should get default environment when ConfigService returns undefined', () => {
      jest.spyOn(configService, 'get').mockReturnValue(undefined);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result = (controller as any).getEnvironment();
      expect(result).toBe(ENV_VALUES.NODE_ENV.DEVELOPMENT);
    });

    it('should get default environment when ConfigService returns null', () => {
      jest.spyOn(configService, 'get').mockReturnValue(null);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result = (controller as any).getEnvironment();
      expect(result).toBe(ENV_VALUES.NODE_ENV.DEVELOPMENT);
    });

    it('should preserve empty string from ConfigService', () => {
      jest.spyOn(configService, 'get').mockReturnValue('');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result = (controller as any).getEnvironment();
      expect(result).toBe(''); // ?? preserva strings vacíos
    });

    it('should preserve false from ConfigService', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(configService, 'get').mockReturnValue(false as any);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result = (controller as any).getEnvironment();
      expect(result).toBe(false); // ?? preserva valores falsy válidos
    });

    it('should get memory info correctly', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result = (controller as any).getMemoryInfo();
      expect(result).toHaveProperty('used');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('free');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(typeof result.used).toBe('number');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(typeof result.total).toBe('number');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(typeof result.free).toBe('number');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(result.free).toBeGreaterThanOrEqual(0);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(result.used).toBeGreaterThanOrEqual(0);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(result.total).toBeGreaterThan(0);
    });

    it('should get cpu info correctly', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result = (controller as any).getCpuInfo();
      expect(result).toHaveProperty('load');
      expect(result).toHaveProperty('cores');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(Array.isArray(result.load)).toBe(true);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(result.load).toHaveLength(2);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(typeof result.cores).toBe('number');
    });

    it('should get cpu info through detailed health endpoint', () => {
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

      expect(result.system.cpu).toHaveProperty('load');
      expect(result.system.cpu).toHaveProperty('cores');
      expect(Array.isArray(result.system.cpu.load)).toBe(true);
      expect(result.system.cpu.load).toHaveLength(2);
      expect(typeof result.system.cpu.cores).toBe('number');
    });

    it('should call getCpuInfo multiple times for coverage', () => {
      // Call the method multiple times to force coverage of all lines
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result1 = (controller as any).getCpuInfo();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result2 = (controller as any).getCpuInfo();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result3 = (controller as any).getCpuInfo();

      expect(result1).toHaveProperty('load');
      expect(result1).toHaveProperty('cores');
      expect(result2).toHaveProperty('load');
      expect(result2).toHaveProperty('cores');
      expect(result3).toHaveProperty('load');
      expect(result3).toHaveProperty('cores');
    });

    it('should call getCpuInfo through different paths', () => {
      // Test through getDetailedHealth with different database states
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        database_name: 'test_db',
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 14.0',
      });
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.DEVELOPMENT);

      const result1 = controller.getDetailedHealth();
      expect(result1.system.cpu).toHaveProperty('load');
      expect(result1.system.cpu).toHaveProperty('cores');

      // Test with different environment
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.PRODUCTION);
      const result2 = controller.getDetailedHealth();
      expect(result2.system.cpu).toHaveProperty('load');
      expect(result2.system.cpu).toHaveProperty('cores');

      // Test with database disconnected
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(false);
      const result3 = controller.getDetailedHealth();
      expect(result3.system.cpu).toHaveProperty('load');
      expect(result3.system.cpu).toHaveProperty('cores');
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

    it('should preserve empty string from ConfigService in getHealth', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(configService, 'get').mockReturnValue('');

      const result = controller.getHealth();

      expect(result.environment).toBe(''); // ?? preserva strings vacíos
    });

    it('should preserve false from ConfigService in getHealth', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(configService, 'get').mockReturnValue(false as any);

      const result = controller.getHealth();

      expect(result.environment).toBe(false); // ?? preserva valores falsy válidos
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

    it('should preserve empty string from ConfigService in detailed health', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        database_name: 'test_db',
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 14.0',
      });
      jest.spyOn(configService, 'get').mockReturnValue('');

      const result = controller.getDetailedHealth();

      expect(result.environment).toBe(''); // ?? preserva strings vacíos
    });

    it('should preserve false from ConfigService in detailed health', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        database_name: 'test_db',
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 14.0',
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(configService, 'get').mockReturnValue(false as any);

      const result = controller.getDetailedHealth();

      expect(result.environment).toBe(false); // ?? preserva valores falsy válidos
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

    it('should preserve empty string database_name', () => {
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

      expect(result.database.info.name).toBe(''); // ?? preserva strings vacíos
      expect(result.database.info.type).toBe('PostgreSQL');
      expect(result.database.info.version).toBe('PostgreSQL 14.0');
    });

    it('should preserve empty string postgres_version', () => {
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
      expect(result.database.info.version).toBe(''); // ?? preserva strings vacíos
    });

    it('should preserve falsy database_name (0)', () => {
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

      expect(result.database.info.name).toBe(0); // ?? preserva valores falsy válidos
      expect(result.database.info.type).toBe('PostgreSQL');
      expect(result.database.info.version).toBe('PostgreSQL 14.0');
    });

    it('should preserve falsy postgres_version (false)', () => {
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
      expect(result.database.info.version).toBe(false); // ?? preserva valores falsy válidos
    });

    it('should handle undefined database info in getDetailedHealth', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest
        .spyOn(databaseService, 'getDatabaseInfo')
        .mockReturnValue(undefined as unknown as DatabaseInfo | null);
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.DEVELOPMENT);

      const result = controller.getDetailedHealth();

      expect(result.database.info.name).toBe('unknown');
      expect(result.database.info.type).toBe('PostgreSQL');
      expect(result.database.info.version).toBe('unknown');
    });

    it('should handle database info with undefined database_name property', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        database_name: undefined as unknown as string,
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 14.0',
      } as unknown as DatabaseInfo);
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.DEVELOPMENT);

      const result = controller.getDetailedHealth();

      expect(result.database.info.name).toBe('unknown');
      expect(result.database.info.type).toBe('PostgreSQL');
      expect(result.database.info.version).toBe('PostgreSQL 14.0');
    });

    it('should handle database info with undefined postgres_version property', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        database_name: 'test_db',
        current_user: 'test_user',
        postgres_version: undefined as unknown as string,
      } as unknown as DatabaseInfo);
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.DEVELOPMENT);

      const result = controller.getDetailedHealth();

      expect(result.database.info.name).toBe('test_db');
      expect(result.database.info.type).toBe('PostgreSQL');
      expect(result.database.info.version).toBe('unknown');
    });

    it('should handle database info with null database_name property', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        database_name: null as unknown as string,
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 14.0',
      } as unknown as DatabaseInfo);
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.DEVELOPMENT);

      const result = controller.getDetailedHealth();

      expect(result.database.info.name).toBe('unknown');
      expect(result.database.info.type).toBe('PostgreSQL');
      expect(result.database.info.version).toBe('PostgreSQL 14.0');
    });

    it('should handle database info with null postgres_version property', () => {
      jest.spyOn(databaseService, 'healthCheck').mockReturnValue(true);
      jest.spyOn(databaseService, 'getDatabaseInfo').mockReturnValue({
        database_name: 'test_db',
        current_user: 'test_user',
        postgres_version: null as unknown as string,
      } as unknown as DatabaseInfo);
      jest
        .spyOn(configService, 'get')
        .mockReturnValue(ENV_VALUES.NODE_ENV.DEVELOPMENT);

      const result = controller.getDetailedHealth();

      expect(result.database.info.name).toBe('test_db');
      expect(result.database.info.type).toBe('PostgreSQL');
      expect(result.database.info.version).toBe('unknown');
    });

    // Tests directos para métodos privados para mejorar cobertura de branches
    describe('private methods direct testing for branch coverage', () => {
      it('should test getDatabaseName with empty string database_name', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        const result = (controller as any).getDatabaseName({
          database_name: '',
          current_user: 'test_user',
          postgres_version: 'PostgreSQL 14.0',
        });
        expect(result).toBe(''); // ?? preserva strings vacíos
      });

      it('should test getDatabaseVersion with empty string postgres_version', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        const result = (controller as any).getDatabaseVersion({
          database_name: 'test_db',
          current_user: 'test_user',
          postgres_version: '',
        });
        expect(result).toBe(''); // ?? preserva strings vacíos
      });
    });
  });
});
