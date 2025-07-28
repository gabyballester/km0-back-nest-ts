/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '@/modules/users/infrastructure/repositories/user.repository';
import { UserDomainService } from '@/modules/users/infrastructure/services/user-domain.service';
import { UserFactory } from '../../../../../test/factories/user.factory';
import { UserRole } from '@/modules/users/domain/entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let userDomainService: jest.Mocked<UserDomainService>;

  const mockUser = UserFactory.createUser();

  const mockUserRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    activate: jest.fn(),
    deactivate: jest.fn(),
    changeRole: jest.fn(),
    changePassword: jest.fn(),
    existsByEmail: jest.fn(),
    findByRole: jest.fn(),
    findActiveUsers: jest.fn(),
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

  beforeEach(async () => {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const createUserDto = UserFactory.createCreateUserDto();

    it('should create a user successfully', async () => {
      userDomainService.validateUserInfo.mockReturnValue({
        isValid: true,
        errors: [],
      });
      userDomainService.validateEmail.mockResolvedValue(true);
      userDomainService.validatePassword.mockReturnValue(true);
      userDomainService.hashPassword.mockResolvedValue('hashedPassword');
      userRepository.create.mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      expect(result).toBeDefined();
      expect(userDomainService.validateUserInfo).toHaveBeenCalled();

      expect(userDomainService.validatePassword).toHaveBeenCalledWith(
        createUserDto.password,
      );
      expect(userDomainService.hashPassword).toHaveBeenCalledWith(
        createUserDto.password,
      );
      expect(userRepository.create).toHaveBeenCalled();
    });

    it('should throw error if email is invalid', async () => {
      userDomainService.validateUserInfo.mockReturnValue({
        isValid: false,
        errors: ['Invalid email'],
      });

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        'Invalid email',
      );
    });

    it('should throw error if password is invalid', async () => {
      userDomainService.validateUserInfo.mockReturnValue({
        isValid: true,
        errors: [],
      });
      userDomainService.validateEmail.mockResolvedValue(true);
      userDomainService.validatePassword.mockReturnValue(false);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        'La contraseña no cumple con los requisitos de seguridad',
      );
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await service.getUserById('test-id');

      expect(result).toBeDefined();
      expect(userRepository.findById).toHaveBeenCalledWith('test-id');
    });

    it('should throw error if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(service.getUserById('non-existent-id')).rejects.toThrow(
        'Usuario no encontrado',
      );
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.getUserByEmail('test@example.com');

      expect(result).toBeDefined();
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should throw error if user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.getUserByEmail('nonexistent@example.com'),
      ).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users with pagination', async () => {
      const mockResult = {
        users: [mockUser],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      userRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.getAllUsers({ page: 1, limit: 10 });

      expect(result).toBeDefined();
      expect(result.users).toHaveLength(1);
      expect(userRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });
  });

  describe('updateUser', () => {
    const updateUserDto = UserFactory.createUpdateUserDto();

    it('should update user successfully', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.update.mockResolvedValue(mockUser);
      userDomainService.isValidRole.mockReturnValue(true);

      const result = await service.updateUser('test-id', updateUserDto);

      expect(result).toBeDefined();
      expect(userRepository.update).toHaveBeenCalledWith(
        'test-id',
        updateUserDto,
      );
    });

    it('should throw error if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateUser('non-existent-id', updateUserDto),
      ).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.delete.mockResolvedValue(true);

      await service.deleteUser('test-id');

      expect(userRepository.findById).toHaveBeenCalledWith('test-id');
      expect(userRepository.delete).toHaveBeenCalledWith('test-id');
    });
  });

  describe('activateUser', () => {
    it('should activate user successfully', async () => {
      userRepository.activate.mockResolvedValue(mockUser);

      const result = await service.activateUser('test-id');

      expect(result).toBeDefined();
      expect(userRepository.activate).toHaveBeenCalledWith('test-id');
    });

    it('should throw error if user not found', async () => {
      userRepository.activate.mockResolvedValue(null);

      await expect(service.activateUser('non-existent-id')).rejects.toThrow(
        'Usuario no encontrado',
      );
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate user successfully', async () => {
      userRepository.deactivate.mockResolvedValue(mockUser);

      const result = await service.deactivateUser('test-id');

      expect(result).toBeDefined();
      expect(userRepository.deactivate).toHaveBeenCalledWith('test-id');
    });

    it('should throw error if user not found', async () => {
      userRepository.deactivate.mockResolvedValue(null);

      await expect(service.deactivateUser('non-existent-id')).rejects.toThrow(
        'Usuario no encontrado',
      );
    });
  });

  describe('changeUserRole', () => {
    it('should change user role successfully', async () => {
      userDomainService.isValidRole.mockReturnValue(true);
      userRepository.changeRole.mockResolvedValue(mockUser);

      const result = await service.changeUserRole('test-id', UserRole.ADMIN);

      expect(result).toBeDefined();
      expect(userDomainService.isValidRole).toHaveBeenCalledWith(
        UserRole.ADMIN,
      );
      expect(userRepository.changeRole).toHaveBeenCalledWith(
        'test-id',
        UserRole.ADMIN,
      );
    });

    it('should throw error if role is invalid', async () => {
      userDomainService.isValidRole.mockReturnValue(false);

      await expect(
        service.changeUserRole('test-id', 'invalid-role' as UserRole),
      ).rejects.toThrow('Rol inválido');
    });

    it('should throw error if user not found after role change', async () => {
      userDomainService.isValidRole.mockReturnValue(true);
      userRepository.changeRole.mockResolvedValue(null);

      await expect(
        service.changeUserRole('test-id', UserRole.ADMIN),
      ).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('changeUserPassword', () => {
    it('should change user password successfully', async () => {
      userDomainService.validatePassword.mockReturnValue(true);
      userDomainService.hashPassword.mockResolvedValue('newHashedPassword');
      userRepository.changePassword.mockResolvedValue(mockUser);

      const result = await service.changeUserPassword(
        'test-id',
        'NewPassword123',
      );

      expect(result).toBeDefined();
      expect(userDomainService.validatePassword).toHaveBeenCalledWith(
        'NewPassword123',
      );
      expect(userDomainService.hashPassword).toHaveBeenCalledWith(
        'NewPassword123',
      );
      expect(userRepository.changePassword).toHaveBeenCalledWith(
        'test-id',
        'newHashedPassword',
      );
    });

    it('should throw error if password is invalid', async () => {
      userDomainService.validatePassword.mockReturnValue(false);

      await expect(
        service.changeUserPassword('test-id', 'weak'),
      ).rejects.toThrow(
        'La contraseña no cumple con los requisitos de seguridad',
      );
    });

    it('should throw error if user not found after password change', async () => {
      userDomainService.validatePassword.mockReturnValue(true);
      userDomainService.hashPassword.mockResolvedValue('newHashedPassword');
      userRepository.changePassword.mockResolvedValue(null);

      await expect(
        service.changeUserPassword('test-id', 'NewPassword123'),
      ).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('getUsersByRole', () => {
    it('should return users by role', async () => {
      userDomainService.isValidRole.mockReturnValue(true);
      userRepository.findByRole.mockResolvedValue([mockUser]);

      const result = await service.getUsersByRole('user');

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(userDomainService.isValidRole).toHaveBeenCalledWith(UserRole.USER);
      expect(userRepository.findByRole).toHaveBeenCalledWith(UserRole.USER);
    });

    it('should throw error if role is invalid', async () => {
      userDomainService.isValidRole.mockReturnValue(false);

      await expect(service.getUsersByRole('invalid-role')).rejects.toThrow(
        'Rol inválido',
      );
    });
  });

  describe('getActiveUsers', () => {
    it('should return active users', async () => {
      userRepository.findActiveUsers.mockResolvedValue([mockUser]);

      const result = await service.getActiveUsers();

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(userRepository.findActiveUsers).toHaveBeenCalled();
    });
  });

  describe('countUsers', () => {
    it('should return user count', async () => {
      userRepository.count.mockResolvedValue(10);

      const result = await service.countUsers();

      expect(result).toBe(10);
      expect(userRepository.count).toHaveBeenCalled();
    });

    it('should return user count with filters', async () => {
      userRepository.count.mockResolvedValue(5);

      const result = await service.countUsers({
        isActive: true,
        role: UserRole.USER,
      });

      expect(result).toBe(5);
      expect(userRepository.count).toHaveBeenCalledWith({
        isActive: true,
        role: UserRole.USER,
      });
    });
  });
});
