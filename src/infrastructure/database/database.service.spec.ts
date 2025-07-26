import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { DatabaseFactory } from './factory/database.factory';
import { IDatabaseAdapter } from './interfaces';

describe('DatabaseService', () => {
  let service: DatabaseService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let _configService: ConfigService;
  let databaseFactory: DatabaseFactory;
  let mockAdapter: jest.Mocked<IDatabaseAdapter>;

  beforeEach(async () => {
    mockAdapter = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      healthCheck: jest.fn(),
      getDatabaseInfo: jest.fn(),
      executeRawQuery: jest.fn(),
      getOrmInstance: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: DatabaseFactory,
          useValue: {
            createAdapter: jest.fn().mockReturnValue(mockAdapter),
            getOrmType: jest.fn(),
            isDrizzle: jest.fn(),
            isPrisma: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    _configService = module.get<ConfigService>(ConfigService);
    databaseFactory = module.get<DatabaseFactory>(DatabaseFactory);

    // Initialize the adapter for tests
    (service as unknown as { adapter: IDatabaseAdapter }).adapter = mockAdapter;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should initialize database connection successfully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockAdapter.healthCheck.mockResolvedValue(true);

      await service.onModuleInit();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockAdapter.connect).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockAdapter.healthCheck).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        '🗄️  Inicializando servicio de base de datos...',
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '✅ Conexión a la base de datos establecida',
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '✅ Base de datos funcionando correctamente',
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '📊 Base de datos conectada correctamente',
      );

      consoleSpy.mockRestore();
    });

    it('should handle initialization errors', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      mockAdapter.healthCheck.mockResolvedValue(false);

      await expect(service.onModuleInit()).rejects.toThrow(
        'Base de datos no está funcionando correctamente',
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ Error al inicializar la base de datos:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should handle connection errors', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      mockAdapter.connect.mockRejectedValue(new Error('Connection failed'));

      await expect(service.onModuleInit()).rejects.toThrow('Connection failed');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ Error al inicializar la base de datos:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('onModuleDestroy', () => {
    it('should close database connection successfully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.onModuleDestroy();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockAdapter.disconnect).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        '🔄 Cerrando conexión a la base de datos...',
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '✅ Conexión a la base de datos cerrada',
      );

      consoleSpy.mockRestore();
    });

    it('should handle errors during connection closure', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      mockAdapter.disconnect.mockRejectedValue(new Error('Disconnect failed'));

      await service.onModuleDestroy();

      expect(consoleSpy).toHaveBeenCalledWith(
        '🔄 Cerrando conexión a la base de datos...',
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ Error al cerrar conexión:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('healthCheck', () => {
    it('should return true when database is healthy', async () => {
      mockAdapter.healthCheck.mockResolvedValue(true);

      const result = await service.healthCheck();

      expect(result).toBe(true);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockAdapter.healthCheck).toHaveBeenCalled();
    });

    it('should return false when database is unhealthy', async () => {
      mockAdapter.healthCheck.mockResolvedValue(false);

      const result = await service.healthCheck();

      expect(result).toBe(false);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockAdapter.healthCheck).toHaveBeenCalled();
    });

    it('should handle errors and return false', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      mockAdapter.healthCheck.mockRejectedValue(
        new Error('Health check failed'),
      );

      const result = await service.healthCheck();

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ Health check falló:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getDatabaseInfo', () => {
    it('should return database info when available', async () => {
      const mockInfo = {
        database_name: 'test_db',
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 14.0',
      };

      mockAdapter.getDatabaseInfo.mockResolvedValue(mockInfo);

      const result = await service.getDatabaseInfo();

      expect(result).toEqual(mockInfo);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockAdapter.getDatabaseInfo).toHaveBeenCalled();
    });

    it('should return null when database info is not available', async () => {
      mockAdapter.getDatabaseInfo.mockResolvedValue(null);

      const result = await service.getDatabaseInfo();

      expect(result).toBeNull();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockAdapter.getDatabaseInfo).toHaveBeenCalled();
    });

    it('should handle errors and return null', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      mockAdapter.getDatabaseInfo.mockRejectedValue(
        new Error('Database info failed'),
      );

      const result = await service.getDatabaseInfo();

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ Error al obtener información de la base de datos:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getAdapter', () => {
    it('should return the current adapter', () => {
      const result = service.getAdapter();

      expect(result).toBe(mockAdapter);
    });
  });

  describe('getStatus', () => {
    it('should return the current database status', () => {
      const result = service.getStatus();

      expect(result).toBeDefined();
    });
  });

  describe('getOrmType', () => {
    it('should return the current ORM type', () => {
      const mockOrmType = 'prisma';
      jest.spyOn(databaseFactory, 'getOrmType').mockReturnValue(mockOrmType);

      const result = service.getOrmType();

      expect(result).toBe(mockOrmType);
    });
  });

  describe('isDrizzle', () => {
    it('should return true when using Drizzle', () => {
      jest.spyOn(databaseFactory, 'isDrizzle').mockReturnValue(true);

      const result = service.isDrizzle();

      expect(result).toBe(true);
    });

    it('should return false when not using Drizzle', () => {
      jest.spyOn(databaseFactory, 'isDrizzle').mockReturnValue(false);

      const result = service.isDrizzle();

      expect(result).toBe(false);
    });
  });

  describe('isPrisma', () => {
    it('should return true when using Prisma', () => {
      jest.spyOn(databaseFactory, 'isPrisma').mockReturnValue(true);

      const result = service.isPrisma();

      expect(result).toBe(true);
    });

    it('should return false when not using Prisma', () => {
      jest.spyOn(databaseFactory, 'isPrisma').mockReturnValue(false);

      const result = service.isPrisma();

      expect(result).toBe(false);
    });
  });
});
