import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database.module';
import { PrismaService } from './prisma.service';
import { DatabaseService } from './database.service';

describe('DatabaseModule', () => {
  let module: DatabaseModule;
  let prismaService: PrismaService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        DatabaseModule,
      ],
    }).compile();

    module = moduleRef.get<DatabaseModule>(DatabaseModule);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    databaseService = moduleRef.get<DatabaseService>(DatabaseService);
  });

  describe('module structure', () => {
    it('should be defined', () => {
      expect(module).toBeDefined();
    });

    it('should provide PrismaService', () => {
      expect(prismaService).toBeDefined();
      expect(prismaService).toHaveProperty('healthCheck');
      expect(typeof prismaService.healthCheck).toBe('function');
    });

    it('should provide DatabaseService', () => {
      expect(databaseService).toBeDefined();
      expect(databaseService).toBeInstanceOf(DatabaseService);
    });
  });

  describe('service dependencies', () => {
    it('should inject PrismaService into DatabaseService', () => {
      // Verificar que DatabaseService tiene acceso a PrismaService
      expect(databaseService).toHaveProperty('getPrismaService');
      expect(typeof databaseService.getPrismaService).toBe('function');
    });

    it('should return PrismaService instance from DatabaseService', () => {
      const prismaInstance = databaseService.getPrismaService();
      expect(prismaInstance).toBeDefined();
      expect(prismaInstance).toHaveProperty('healthCheck');
      expect(typeof prismaInstance.healthCheck).toBe('function');
    });
  });

  describe('module exports', () => {
    it('should export PrismaService', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
          }),
          DatabaseModule,
        ],
      }).compile();

      const exportedPrismaService = moduleRef.get<PrismaService>(PrismaService);
      expect(exportedPrismaService).toBeDefined();
    });

    it('should export DatabaseService', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
          }),
          DatabaseModule,
        ],
      }).compile();

      const exportedDatabaseService =
        moduleRef.get<DatabaseService>(DatabaseService);
      expect(exportedDatabaseService).toBeDefined();
    });
  });

  describe('service methods', () => {
    it('should have healthCheck method in DatabaseService', () => {
      expect(databaseService).toHaveProperty('healthCheck');
      expect(typeof databaseService.healthCheck).toBe('function');
    });

    it('should have getDatabaseInfo method in DatabaseService', () => {
      expect(databaseService).toHaveProperty('getDatabaseInfo');
      expect(typeof databaseService.getDatabaseInfo).toBe('function');
    });

    it('should have isDatabaseConnected method in DatabaseService', () => {
      expect(databaseService).toHaveProperty('isDatabaseConnected');
      expect(typeof databaseService.isDatabaseConnected).toBe('function');
    });

    it('should have healthCheck method in PrismaService', () => {
      expect(prismaService).toHaveProperty('healthCheck');
      expect(typeof prismaService.healthCheck).toBe('function');
    });

    it('should have getDatabaseInfo method in PrismaService', () => {
      expect(prismaService).toHaveProperty('getDatabaseInfo');
      expect(typeof prismaService.getDatabaseInfo).toBe('function');
    });
  });

  describe('module configuration', () => {
    it('should have correct module metadata', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
      const _moduleMetadata = Reflect.getMetadata('imports', DatabaseModule);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const providersMetadata = Reflect.getMetadata(
        'providers',
        DatabaseModule,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const exportsMetadata = Reflect.getMetadata('exports', DatabaseModule);

      expect(providersMetadata).toContain(PrismaService);
      expect(providersMetadata).toContain(DatabaseService);
      expect(exportsMetadata).toContain(PrismaService);
      expect(exportsMetadata).toContain(DatabaseService);
    });
  });
});
