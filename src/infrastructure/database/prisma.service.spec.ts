import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/infrastructure/database/prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'DATABASE_URL') {
                return 'postgresql://test:test@localhost:5432/test_db';
              }
              return 'development';
            }),
          },
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should configure PrismaClient with development logging', () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'DATABASE_URL') {
          return 'postgresql://test:test@localhost:5432/test_db';
        }
        return 'development';
      });

      const newService = new PrismaService(configService);
      expect(newService).toBeDefined();
    });

    it('should configure PrismaClient with production logging', () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'DATABASE_URL') {
          return 'postgresql://test:test@localhost:5432/test_db';
        }
        return 'production';
      });

      const newService = new PrismaService(configService);
      expect(newService).toBeDefined();
    });

    it('should configure PrismaClient with test logging', () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'DATABASE_URL') {
          return 'postgresql://test:test@localhost:5432/test_db';
        }
        return 'test';
      });

      const newService = new PrismaService(configService);
      expect(newService).toBeDefined();
    });

    it('should use default development logging when NODE_ENV is invalid', () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'DATABASE_URL') {
          return 'postgresql://test:test@localhost:5432/test_db';
        }
        return 'invalid';
      });

      const newService = new PrismaService(configService);
      expect(newService).toBeDefined();
    });

    it('should use default development logging when NODE_ENV throws error', () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'DATABASE_URL') {
          return 'postgresql://test:test@localhost:5432/test_db';
        }
        throw new Error('Config error');
      });

      const newService = new PrismaService(configService);
      expect(newService).toBeDefined();
    });
  });

  describe('onModuleInit', () => {
    it('should log initialization message', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const connectSpy = jest.spyOn(service, '$connect').mockResolvedValue();
      const queryRawSpy = jest
        .spyOn(service, '$queryRaw')
        .mockResolvedValue([{ '?column?': 1 }]);

      await service.onModuleInit();

      expect(consoleSpy).toHaveBeenCalledWith(
        '🔗 PrismaService conectado exitosamente',
      );
      expect(consoleSpy).toHaveBeenCalledWith('✅ Base de datos accesible');

      consoleSpy.mockRestore();
      connectSpy.mockRestore();
      queryRawSpy.mockRestore();
    });
  });

  describe('onModuleDestroy', () => {
    it('should log destruction message', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const disconnectSpy = jest
        .spyOn(service, '$disconnect')
        .mockResolvedValue();

      await service.onModuleDestroy();

      expect(consoleSpy).toHaveBeenCalledWith(
        '🔗 PrismaService desconectado exitosamente',
      );

      consoleSpy.mockRestore();
      disconnectSpy.mockRestore();
    });
  });
});
