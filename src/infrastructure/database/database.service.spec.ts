import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { PrismaService } from './prisma.service';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: PrismaService,
          useValue: {
            $connect: jest.fn(),
            $disconnect: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should initialize database connection successfully', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      service.onModuleInit();

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
      consoleErrorSpy.mockRestore();
    });

    it('should handle initialization errors', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Simular un error en healthCheck
      jest.spyOn(service, 'healthCheck').mockReturnValue(false);

      expect(() => service.onModuleInit()).toThrow(
        'Base de datos no está funcionando correctamente',
      );

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('onModuleDestroy', () => {
    it('should close database connection successfully', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      service.onModuleDestroy();

      expect(consoleSpy).toHaveBeenCalledWith(
        '🔄 Cerrando conexión a la base de datos...',
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '✅ Conexión a la base de datos cerrada',
      );

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should handle errors during connection closure', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Simular un error durante el cierre
      const originalIsConnected = service['isConnected'];
      Object.defineProperty(service, 'isConnected', {
        set: () => {
          throw new Error('Connection error');
        },
        get: () => originalIsConnected,
      });

      service.onModuleDestroy();

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
    it('should return true when database is connected', () => {
      // Asegurar que está conectado
      service['isConnected'] = true;
      const result = service.healthCheck();
      expect(result).toBe(true);
    });

    it('should return false when database is not connected', () => {
      // Simular desconexión
      service['isConnected'] = false;
      const result = service.healthCheck();
      expect(result).toBe(false);
    });

    it('should handle errors and return false', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Simular un error al acceder a isConnected
      Object.defineProperty(service, 'isConnected', {
        get: () => {
          throw new Error('Access error');
        },
      });

      const result = service.healthCheck();
      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ Health check falló:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getDatabaseInfo', () => {
    it('should return database info when DATABASE_URL is available', () => {
      const mockDatabaseUrl = 'postgresql://user:pass@localhost:5432/km0_db';
      jest.spyOn(configService, 'get').mockReturnValue(mockDatabaseUrl);

      const result = service.getDatabaseInfo();

      expect(result).toEqual({
        database_name: 'km0_db',
        current_user: 'postgres',
        postgres_version: 'PostgreSQL',
      });
    });

    it('should return database info with default name when DATABASE_URL is not available', () => {
      jest.spyOn(configService, 'get').mockReturnValue(undefined);

      const result = service.getDatabaseInfo();

      expect(result).toEqual({
        database_name: 'km0_db',
        current_user: 'postgres',
        postgres_version: 'PostgreSQL',
      });
    });

    it('should handle malformed DATABASE_URL gracefully', () => {
      const malformedUrl = 'invalid-url';
      jest.spyOn(configService, 'get').mockReturnValue(malformedUrl);

      const result = service.getDatabaseInfo();

      expect(result).toEqual({
        database_name: 'km0_db',
        current_user: 'postgres',
        postgres_version: 'PostgreSQL',
      });
    });

    it('should handle empty DATABASE_URL gracefully', () => {
      const emptyUrl = '';
      jest.spyOn(configService, 'get').mockReturnValue(emptyUrl);

      const result = service.getDatabaseInfo();

      expect(result).toEqual({
        database_name: 'km0_db',
        current_user: 'postgres',
        postgres_version: 'PostgreSQL',
      });
    });

    it('should handle errors and return null', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Simular un error en configService.get
      jest.spyOn(configService, 'get').mockImplementation(() => {
        throw new Error('Config error');
      });

      const result = service.getDatabaseInfo();
      expect(result).toBe(null);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ Error al obtener información de la base de datos:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('extractDatabaseName', () => {
    it('should extract database name from valid PostgreSQL URL', () => {
      const url = 'postgresql://user:pass@localhost:5432/my_database';
      const result = service['extractDatabaseName'](url);
      expect(result).toBe('my_database');
    });

    it('should return default name for invalid URL', () => {
      const url = 'invalid-url';
      const result = service['extractDatabaseName'](url);
      expect(result).toBe('km0_db');
    });

    it('should return default name for URL without path', () => {
      const url = 'postgresql://user:pass@localhost:5432';
      const result = service['extractDatabaseName'](url);
      expect(result).toBe('km0_db'); // || handles empty strings
    });

    it('should return default name for URL with empty path parts', () => {
      const url = 'postgresql://user:pass@localhost:5432/';
      const result = service['extractDatabaseName'](url);
      expect(result).toBe('km0_db'); // || handles empty strings
    });
  });

  describe('healthCheckReal', () => {
    it('should return true when database is healthy', async () => {
      const mockPrisma = {
        $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
      };
      const serviceWithMockPrisma = new DatabaseService(
        mockPrisma as unknown as PrismaService,
        configService,
      );

      const result = await serviceWithMockPrisma.healthCheckReal();

      expect(result).toBe(true);
      expect(mockPrisma.$queryRaw).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should return false when database query fails', async () => {
      const mockPrisma = {
        $queryRaw: jest.fn().mockRejectedValue(new Error('Database error')),
      };
      const serviceWithMockPrisma = new DatabaseService(
        mockPrisma as unknown as PrismaService,
        configService,
      );

      const result = await serviceWithMockPrisma.healthCheckReal();

      expect(result).toBe(false);
    });
  });

  describe('getDatabaseInfoReal', () => {
    it('should return real database info when query succeeds', async () => {
      const mockPrisma = {
        $queryRaw: jest.fn().mockResolvedValue([
          {
            current_database: 'test_db',
            current_user: 'test_user',
            version: 'PostgreSQL 14.0',
          },
        ]),
      };
      const serviceWithMockPrisma = new DatabaseService(
        mockPrisma as unknown as PrismaService,
        configService,
      );

      const result = await serviceWithMockPrisma.getDatabaseInfoReal();

      expect(result).toEqual({
        database_name: 'test_db',
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 14.0',
      });
    });

    it('should return null when query fails', async () => {
      const mockPrisma = {
        $queryRaw: jest.fn().mockRejectedValue(new Error('Database error')),
      };
      const serviceWithMockPrisma = new DatabaseService(
        mockPrisma as unknown as PrismaService,
        configService,
      );

      const result = await serviceWithMockPrisma.getDatabaseInfoReal();

      expect(result).toBe(null);
    });

    it('should handle empty result array', async () => {
      const mockPrisma = {
        $queryRaw: jest.fn().mockResolvedValue([]),
      };
      const serviceWithMockPrisma = new DatabaseService(
        mockPrisma as unknown as PrismaService,
        configService,
      );

      const result = await serviceWithMockPrisma.getDatabaseInfoReal();

      expect(result).toBe(null);
    });

    it('should handle null values in result', async () => {
      const mockPrisma = {
        $queryRaw: jest.fn().mockResolvedValue([
          {
            current_database: null,
            current_user: null,
            version: null,
          },
        ]),
      };
      const serviceWithMockPrisma = new DatabaseService(
        mockPrisma as unknown as PrismaService,
        configService,
      );

      const result = await serviceWithMockPrisma.getDatabaseInfoReal();

      expect(result).toEqual({
        database_name: 'unknown',
        current_user: 'unknown',
        postgres_version: 'unknown',
      });
    });
  });
});
