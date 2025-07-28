/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '@/modules/users/application/services/user.service';
import { UserFactory } from '../../../../test/factories/user.factory';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  const mockUser = UserFactory.createUser();

  const mockUserService = {
    createUser: jest.fn(),
    getUserById: jest.fn(),
    getUserByEmail: jest.fn(),
    getAllUsers: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    activateUser: jest.fn(),
    deactivateUser: jest.fn(),
    changeUserRole: jest.fn(),
    changeUserPassword: jest.fn(),
    getUsersByRole: jest.fn(),
    getActiveUsers: jest.fn(),
    countUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Module Configuration', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have UserService injected', () => {
      expect(controller['userService']).toBeDefined();
      expect(controller['userService']).toBe(userService);
    });
  });

  describe('Controller Methods', () => {
    it('should have createUser method', () => {
      expect(typeof controller.createUser).toBe('function');
    });

    it('should have getUserById method', () => {
      expect(typeof controller.getUserById).toBe('function');
    });

    it('should have getUserByEmail method', () => {
      expect(typeof controller.getUserByEmail).toBe('function');
    });

    it('should have getAllUsers method', () => {
      expect(typeof controller.getAllUsers).toBe('function');
    });

    it('should have updateUser method', () => {
      expect(typeof controller.updateUser).toBe('function');
    });

    it('should have deleteUser method', () => {
      expect(typeof controller.deleteUser).toBe('function');
    });

    it('should have activateUser method', () => {
      expect(typeof controller.activateUser).toBe('function');
    });

    it('should have deactivateUser method', () => {
      expect(typeof controller.deactivateUser).toBe('function');
    });

    it('should have changeUserRole method', () => {
      expect(typeof controller.changeUserRole).toBe('function');
    });

    it('should have changeUserPassword method', () => {
      expect(typeof controller.changeUserPassword).toBe('function');
    });

    it('should have getUsersByRole method', () => {
      expect(typeof controller.getUsersByRole).toBe('function');
    });

    it('should have getActiveUsers method', () => {
      expect(typeof controller.getActiveUsers).toBe('function');
    });

    it('should have countUsers method', () => {
      expect(typeof controller.countUsers).toBe('function');
    });
  });

  describe('Route Configuration', () => {
    it('should be configured with @Controller decorator', () => {
      const controllerMetadata = Reflect.getMetadata('path', UserController);
      expect(controllerMetadata).toBe('users');
    });
  });

  describe('Basic Functionality', () => {
    it('should create a user successfully', async () => {
      const createUserDto = UserFactory.createCreateUserDto();
      userService.createUser.mockResolvedValue(mockUser);

      const result = await controller.createUser(createUserDto);

      expect(result).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should get user by id', async () => {
      userService.getUserById.mockResolvedValue(mockUser);

      const result = await controller.getUserById('test-id');

      expect(result).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userService.getUserById).toHaveBeenCalledWith('test-id');
    });

    it('should get all users', async () => {
      const mockResult = {
        users: [mockUser],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      userService.getAllUsers.mockResolvedValue(mockResult);

      const result = await controller.getAllUsers(1, 10);

      expect(result).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userService.getAllUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });

    it('should count users', async () => {
      userService.countUsers.mockResolvedValue(10);

      const result = await controller.countUsers();

      expect(result).toEqual({ count: 10 });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userService.countUsers).toHaveBeenCalled();
    });
  });
});
