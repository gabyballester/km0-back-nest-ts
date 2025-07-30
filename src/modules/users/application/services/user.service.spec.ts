/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from '@/modules/users/infrastructure/repositories/user.repository';
import { UserDomainService } from '@/modules/users/infrastructure/services/user-domain.service';
import { User } from '@/modules/users/domain/entities/user.entity';
import { CreateUserDto } from '@/modules/users/application/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/application/dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let userDomainService: jest.Mocked<UserDomainService>;

  const mockUser = new User({
    id: 'test-id',
    email: 'test@example.com',
    password: 'hashedPassword',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  });

  const createUserDto: CreateUserDto = {
    email: 'test@example.com',
    password: 'Password123',
  };

  const updateUserDto: UpdateUserDto = {
    email: 'updated@example.com',
  };

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      existsByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
    };

    const mockUserDomainService = {
      validateEmail: jest.fn(),
      validatePassword: jest.fn(),
      hashPassword: jest.fn(),
      verifyPassword: jest.fn(),
      generateEmailVerificationToken: jest.fn(),
      validateEmailVerificationToken: jest.fn(),
      canPerformAction: jest.fn(),
      canModifyUser: jest.fn(),
      getRolePermissions: jest.fn(),
      isValidRole: jest.fn(),
      getDefaultRole: jest.fn(),
      validateUserInfo: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: UserDomainService,
          useValue: mockUserDomainService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
    userDomainService = module.get(UserDomainService);
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      userRepository.existsByEmail.mockResolvedValue(false);
      userDomainService.validateEmail.mockResolvedValue(true);
      userDomainService.validatePassword.mockReturnValue(true);
      userDomainService.hashPassword.mockResolvedValue('hashedPassword');
      userRepository.create.mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      expect(userRepository.existsByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(userDomainService.validateEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(userDomainService.validatePassword).toHaveBeenCalledWith(
        createUserDto.password,
      );
      expect(userDomainService.hashPassword).toHaveBeenCalledWith(
        createUserDto.password,
      );
      expect(userRepository.create).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result.id).toBe(mockUser.id);
      expect(result.email).toBe(mockUser.email);
    });

    it('should throw ConflictException if email already exists', async () => {
      userRepository.existsByEmail.mockResolvedValue(true);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(userRepository.existsByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
    });

    it('should throw BadRequestException if email is invalid', async () => {
      userRepository.existsByEmail.mockResolvedValue(false);
      userDomainService.validateEmail.mockResolvedValue(false);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(userDomainService.validateEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
    });

    it('should throw BadRequestException if password is invalid', async () => {
      userRepository.existsByEmail.mockResolvedValue(false);
      userDomainService.validateEmail.mockResolvedValue(true);
      userDomainService.validatePassword.mockReturnValue(false);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(userDomainService.validatePassword).toHaveBeenCalledWith(
        createUserDto.password,
      );
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await service.getUserById('test-id');

      expect(userRepository.findById).toHaveBeenCalledWith('test-id');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result.id).toBe(mockUser.id);
      expect(result.email).toBe(mockUser.email);
    });

    it('should throw NotFoundException when user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(service.getUserById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findById).toHaveBeenCalledWith('non-existent-id');
    });
  });

  describe('getUserByEmail', () => {
    it('should return user when found', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.getUserByEmail('test@example.com');

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result.id).toBe(mockUser.id);
      expect(result.email).toBe(mockUser.email);
    });

    it('should throw NotFoundException when user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.getUserByEmail('nonexistent@example.com'),
      ).rejects.toThrow(NotFoundException);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      const mockResult = {
        users: [mockUser],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      userRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.getAllUsers(1, 10);

      expect(userRepository.findAll).toHaveBeenCalledWith(1, 10);
      expect(result.users).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.users[0]).toHaveProperty('id');
      expect(result.users[0]).toHaveProperty('email');
      expect(result.users[0]).toHaveProperty('createdAt');
      expect(result.users[0]).toHaveProperty('updatedAt');
    });

    it('should return users without pagination parameters', async () => {
      const mockResult = {
        users: [mockUser],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      userRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.getAllUsers();

      expect(userRepository.findAll).toHaveBeenCalledWith(undefined, undefined);
      expect(result.users).toHaveLength(1);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.existsByEmail.mockResolvedValue(false);
      userRepository.update.mockResolvedValue(mockUser);

      const result = await service.updateUser('test-id', updateUserDto);

      expect(userRepository.findById).toHaveBeenCalledWith('test-id');
      expect(userRepository.existsByEmail).toHaveBeenCalledWith(
        updateUserDto.email,
      );
      expect(userRepository.update).toHaveBeenCalledWith(
        'test-id',
        updateUserDto,
      );
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should throw NotFoundException when user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateUser('non-existent-id', updateUserDto),
      ).rejects.toThrow(NotFoundException);
      expect(userRepository.findById).toHaveBeenCalledWith('non-existent-id');
    });

    it('should throw ConflictException if email already exists', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.existsByEmail.mockResolvedValue(true);

      await expect(
        service.updateUser('test-id', updateUserDto),
      ).rejects.toThrow(ConflictException);
      expect(userRepository.existsByEmail).toHaveBeenCalledWith(
        updateUserDto.email,
      );
    });

    it('should not check email uniqueness if email is not being updated', async () => {
      const updateUserDtoWithoutEmail: UpdateUserDto = {};
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.update.mockResolvedValue(mockUser);

      const result = await service.updateUser(
        'test-id',
        updateUserDtoWithoutEmail,
      );

      expect(userRepository.findById).toHaveBeenCalledWith('test-id');
      expect(userRepository.existsByEmail).not.toHaveBeenCalled();
      expect(userRepository.update).toHaveBeenCalledWith(
        'test-id',
        updateUserDtoWithoutEmail,
      );
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should not check email uniqueness if email is the same', async () => {
      const updateUserDtoSameEmail: UpdateUserDto = {
        email: mockUser.email,
      };
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.update.mockResolvedValue(mockUser);

      const result = await service.updateUser(
        'test-id',
        updateUserDtoSameEmail,
      );

      expect(userRepository.findById).toHaveBeenCalledWith('test-id');
      expect(userRepository.existsByEmail).not.toHaveBeenCalled();
      expect(userRepository.update).toHaveBeenCalledWith(
        'test-id',
        updateUserDtoSameEmail,
      );
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.delete.mockResolvedValue();

      await service.deleteUser('test-id');

      expect(userRepository.findById).toHaveBeenCalledWith('test-id');
      expect(userRepository.delete).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException when user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(service.deleteUser('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findById).toHaveBeenCalledWith('non-existent-id');
    });
  });

  describe('countUsers', () => {
    it('should return user count', async () => {
      userRepository.count.mockResolvedValue(5);

      const result = await service.countUsers();

      expect(userRepository.count).toHaveBeenCalled();
      expect(result).toBe(5);
    });
  });
});
