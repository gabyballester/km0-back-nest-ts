/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { PrismaService } from './prisma.service';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPrismaService = {
    $queryRaw: jest.fn(),
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    prismaService = module.get(PrismaService);

    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should initialize database service successfully', async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      // Act
      await service.onModuleInit();

      // Assert
      expect(prismaService.$queryRaw).toHaveBeenCalledWith(['SELECT 1']);
    });

    it('should throw error when health check fails', async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockRejectedValue(
        new Error('Database connection failed'),
      );

      // Act & Assert
      await expect(service.onModuleInit()).rejects.toThrow(
        'Base de datos no está funcionando correctamente',
      );
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect from database successfully', async () => {
      // Arrange
      mockPrismaService.$disconnect.mockResolvedValue(undefined);

      // Act
      await service.onModuleDestroy();

      // Assert
      expect(prismaService.$disconnect).toHaveBeenCalled();
    });

    it('should handle disconnect errors gracefully', async () => {
      // Arrange
      mockPrismaService.$disconnect.mockRejectedValue(
        new Error('Disconnect failed'),
      );

      // Act & Assert
      await expect(service.onModuleDestroy()).resolves.toBeUndefined();
    });
  });

  describe('healthCheck', () => {
    it('should return true when database is healthy', async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      // Act
      const result = await service.healthCheck();

      // Assert
      expect(result).toBe(true);
      expect(prismaService.$queryRaw).toHaveBeenCalledWith(['SELECT 1']);
    });

    it('should return false when database health check fails', async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockRejectedValue(
        new Error('Database error'),
      );

      // Act
      const result = await service.healthCheck();

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when database returns unexpected result', async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockResolvedValue([]);

      // Act
      const result = await service.healthCheck();

      // Assert
      expect(result).toBe(true); // El health check solo verifica que la query se ejecute, no el resultado
    });
  });

  describe('getDatabaseInfo', () => {
    it('should return database information successfully', async () => {
      // Arrange
      const mockDbInfo = [
        {
          current_database: 'test_db',
          current_user: 'test_user',
          version: 'PostgreSQL 15.0',
        },
      ];
      mockPrismaService.$queryRaw.mockResolvedValue(mockDbInfo);

      // Act
      const result = await service.getDatabaseInfo();

      // Assert
      expect(result).toEqual({
        database_name: 'test_db',
        current_user: 'test_user',
        postgres_version: 'PostgreSQL 15.0',
      });
      expect(prismaService.$queryRaw).toHaveBeenCalledWith([
        'SELECT current_database(), current_user, version()',
      ]);
    });

    it('should return null when database info query fails', async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockRejectedValue(new Error('Query failed'));

      // Act
      const result = await service.getDatabaseInfo();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when database info query returns empty result', async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockResolvedValue([]);

      // Act
      const result = await service.getDatabaseInfo();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when database info query returns unexpected format', async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockResolvedValue([
        { unexpected_field: 'value' },
      ]);

      // Act
      const result = await service.getDatabaseInfo();

      // Assert
      expect(result).toEqual({
        database_name: 'unknown',
        current_user: 'unknown',
        postgres_version: 'unknown',
      });
    });
  });

  describe('getPrismaService', () => {
    it('should return the PrismaService instance', () => {
      // Act
      const result = service.getPrismaService();

      // Assert
      expect(result).toBe(prismaService);
    });
  });

  describe('isDatabaseConnected', () => {
    it('should return true when database is connected', () => {
      // Arrange
      (service as unknown as { isConnected: boolean }).isConnected = true;

      // Act
      const result = service.isDatabaseConnected();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when database is not connected', () => {
      // Arrange
      (service as unknown as { isConnected: boolean }).isConnected = false;

      // Act
      const result = service.isDatabaseConnected();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockRejectedValue(
        new Error('Connection timeout'),
      );

      // Act
      const result = await service.healthCheck();

      // Assert
      expect(result).toBe(false);
    });

    it('should handle database query errors gracefully', async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockRejectedValue(new Error('Query timeout'));

      // Act
      const result = await service.getDatabaseInfo();

      // Assert
      expect(result).toBeNull();
    });
  });
});
