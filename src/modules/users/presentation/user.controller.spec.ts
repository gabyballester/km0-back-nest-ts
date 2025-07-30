/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '@/modules/users/application/services/user.service';
import { CreateUserDto } from '@/modules/users/application/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/application/dto/update-user.dto';
import {
  UserResponseDto,
  UsersPaginatedResponseDto,
} from '@/modules/users/application/dto/user-response.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  const mockUserResponse: UserResponseDto = {
    id: 'test-id',
    email: 'test@example.com',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-02T15:30:00Z'),
  };

  const mockUserService = {
    createUser: jest.fn(),
    getUserById: jest.fn(),
    getUserByEmail: jest.fn(),
    getAllUsers: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
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
    userService = module.get(UserService);

    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have userService injected', () => {
      expect(userService).toBeDefined();
    });
  });

  describe('methods', () => {
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
  });

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'Password123',
    };

    it('should create a user successfully', async () => {
      userService.createUser.mockResolvedValue(mockUserResponse);

      const result = await controller.createUser(createUserDto);

      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toBe(mockUserResponse);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      userService.getUserById.mockResolvedValue(mockUserResponse);

      const result = await controller.getUserById('test-id');

      expect(userService.getUserById).toHaveBeenCalledWith('test-id');
      expect(result).toBe(mockUserResponse);
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      userService.getUserByEmail.mockResolvedValue(mockUserResponse);

      const result = await controller.getUserByEmail('test@example.com');

      expect(userService.getUserByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(result).toBe(mockUserResponse);
    });
  });

  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      const mockPaginatedResponse: UsersPaginatedResponseDto = {
        users: [mockUserResponse],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      userService.getAllUsers.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.getAllUsers(1, 10);

      expect(userService.getAllUsers).toHaveBeenCalledWith(1, 10);
      expect(result).toBe(mockPaginatedResponse);
    });

    it('should return paginated users with default parameters', async () => {
      const mockPaginatedResponse: UsersPaginatedResponseDto = {
        users: [mockUserResponse],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      userService.getAllUsers.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.getAllUsers();

      expect(userService.getAllUsers).toHaveBeenCalledWith(
        undefined,
        undefined,
      );
      expect(result).toBe(mockPaginatedResponse);
    });
  });

  describe('updateUser', () => {
    const updateUserDto: UpdateUserDto = {
      email: 'updated@example.com',
    };

    it('should update user successfully', async () => {
      userService.updateUser.mockResolvedValue(mockUserResponse);

      const result = await controller.updateUser('test-id', updateUserDto);

      expect(userService.updateUser).toHaveBeenCalledWith(
        'test-id',
        updateUserDto,
      );
      expect(result).toBe(mockUserResponse);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      userService.deleteUser.mockResolvedValue();

      const result = await controller.deleteUser('test-id');

      expect(userService.deleteUser).toHaveBeenCalledWith('test-id');
      expect(result).toBeUndefined();
    });
  });
});
