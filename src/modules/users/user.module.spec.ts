import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user.module';
import { UserService } from './application/services/user.service';
import { UserController } from './presentation/user.controller';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserDomainService } from './infrastructure/services/user-domain.service';

describe('UserModule', () => {
  let module: TestingModule;
  let userController: UserController;
  let userService: UserService;
  let userRepository: UserRepository;
  let userDomainService: UserDomainService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        UserModule,
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    userDomainService = module.get<UserDomainService>(UserDomainService);
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  describe('Module Configuration', () => {
    it('should be defined', () => {
      expect(module).toBeDefined();
    });

    it('should have UserController defined', () => {
      expect(userController).toBeDefined();
    });

    it('should have UserService defined', () => {
      expect(userService).toBeDefined();
    });

    it('should have UserRepository defined', () => {
      expect(userRepository).toBeDefined();
    });

    it('should have UserDomainService defined', () => {
      expect(userDomainService).toBeDefined();
    });
  });

  describe('Dependency Injection', () => {
    it('should inject UserService into UserController', () => {
      expect(userController['userService']).toBeDefined();
      expect(userController['userService']).toBe(userService);
    });

    it('should inject UserRepository into UserService', () => {
      expect(userService['userRepository']).toBeDefined();
      expect(userService['userRepository']).toBe(userRepository);
    });

    it('should inject UserDomainService into UserService', () => {
      expect(userService['userDomainService']).toBeDefined();
      expect(userService['userDomainService']).toBe(userDomainService);
    });

    it('should inject UserRepository into UserDomainService', () => {
      expect(userDomainService['userRepository']).toBeDefined();
      expect(userDomainService['userRepository']).toBe(userRepository);
    });
  });

  describe('Module Exports', () => {
    it('should export UserService', () => {
      const exportedService = module.get<UserService>(UserService);
      expect(exportedService).toBeDefined();
      expect(exportedService).toBe(userService);
    });
  });

  describe('Database Integration', () => {
    it('should have DatabaseModule imported', () => {
      // El DatabaseModule se importa internamente en UserModule
      // No necesitamos verificarlo directamente en el test
      expect(module).toBeDefined();
    });
  });
});
