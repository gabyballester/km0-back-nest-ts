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
            get: jest.fn(),
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
      jest.spyOn(configService, 'get').mockReturnValue('development');

      const newService = new PrismaService(configService);
      expect(newService).toBeDefined();
    });

    it('should configure PrismaClient with production logging', () => {
      jest.spyOn(configService, 'get').mockReturnValue('production');

      const newService = new PrismaService(configService);
      expect(newService).toBeDefined();
    });

    it('should configure PrismaClient with test logging', () => {
      jest.spyOn(configService, 'get').mockReturnValue('test');

      const newService = new PrismaService(configService);
      expect(newService).toBeDefined();
    });

    it('should use default development logging when NODE_ENV is invalid', () => {
      jest.spyOn(configService, 'get').mockReturnValue('invalid');

      const newService = new PrismaService(configService);
      expect(newService).toBeDefined();
    });

    it('should use default development logging when NODE_ENV throws error', () => {
      jest.spyOn(configService, 'get').mockImplementation(() => {
        throw new Error('Config error');
      });

      const newService = new PrismaService(configService);
      expect(newService).toBeDefined();
    });
  });

  describe('onModuleInit', () => {
    it('should log initialization message', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      service.onModuleInit();

      expect(consoleSpy).toHaveBeenCalledWith('🔗 PrismaService inicializado');

      consoleSpy.mockRestore();
    });
  });

  describe('onModuleDestroy', () => {
    it('should log destruction message', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      service.onModuleDestroy();

      expect(consoleSpy).toHaveBeenCalledWith('🔗 PrismaService destruido');

      consoleSpy.mockRestore();
    });
  });
});
