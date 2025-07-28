/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserDomainService } from './user-domain.service';
import { UserRepository } from '../repositories/user.repository';
import { User, UserRole } from '@/modules/users/domain/entities/user.entity';

describe('UserDomainService', () => {
  let service: UserDomainService;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUserRepository = {
    existsByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDomainService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserDomainService>(UserDomainService);
    userRepository = module.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateEmail', () => {
    it('should return true for valid email that does not exist', async () => {
      userRepository.existsByEmail.mockResolvedValue(false);

      const result = await service.validateEmail('test@example.com');

      expect(result).toBe(true);
      expect(userRepository.existsByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should return false for invalid email format', async () => {
      const result = await service.validateEmail('invalid-email');

      expect(result).toBe(false);
      expect(userRepository.existsByEmail).not.toHaveBeenCalled();
    });

    it('should return false for email that already exists', async () => {
      userRepository.existsByEmail.mockResolvedValue(true);

      const result = await service.validateEmail('existing@example.com');

      expect(result).toBe(false);
      expect(userRepository.existsByEmail).toHaveBeenCalledWith(
        'existing@example.com',
      );
    });

    it('should return false for email without domain', async () => {
      const result = await service.validateEmail('test@');

      expect(result).toBe(false);
    });

    it('should return false for email without @ symbol', async () => {
      const result = await service.validateEmail('testexample.com');

      expect(result).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', () => {
      const validPasswords = [
        'Password123',
        'MySecurePass1',
        'ComplexP@ss1',
        'ValidPass123',
      ];

      validPasswords.forEach(password => {
        expect(service.validatePassword(password)).toBe(true);
      });
    });

    it('should return false for password too short', () => {
      expect(service.validatePassword('Pass1')).toBe(false);
    });

    it('should return false for password too long', () => {
      const longPassword = 'A'.repeat(129);
      expect(service.validatePassword(longPassword)).toBe(false);
    });

    it('should return false for password without uppercase', () => {
      expect(service.validatePassword('password123')).toBe(false);
    });

    it('should return false for password without lowercase', () => {
      expect(service.validatePassword('PASSWORD123')).toBe(false);
    });

    it('should return false for password without number', () => {
      expect(service.validatePassword('PasswordABC')).toBe(false);
    });
  });

  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'MyPassword123';
      const hashedPassword = await service.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(20);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'MyPassword123';
      const hash1 = await service.hashPassword(password);
      const hash2 = await service.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'MyPassword123';
      const hashedPassword = await service.hashPassword(password);

      const result = await service.verifyPassword(password, hashedPassword);

      expect(result).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'MyPassword123';
      const wrongPassword = 'WrongPassword123';
      const hashedPassword = await service.hashPassword(password);

      const result = await service.verifyPassword(
        wrongPassword,
        hashedPassword,
      );

      expect(result).toBe(false);
    });
  });

  describe('generateEmailVerificationToken', () => {
    it('should generate token', () => {
      const token = service.generateEmailVerificationToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate different tokens', () => {
      const token1 = service.generateEmailVerificationToken();
      const token2 = service.generateEmailVerificationToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('validateEmailVerificationToken', () => {
    it('should validate token with sufficient length', () => {
      const token = 'a'.repeat(25);
      const result = service.validateEmailVerificationToken(token);

      expect(result).toBe(true);
    });

    it('should reject token with insufficient length', () => {
      const token = 'a'.repeat(15);
      const result = service.validateEmailVerificationToken(token);

      expect(result).toBe(false);
    });
  });

  describe('canPerformAction', () => {
    it('should allow admin to perform any action', () => {
      const adminUser = new User({
        email: 'admin@example.com',
        password: 'password',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
      });

      const result = service.canPerformAction(adminUser, 'user:create');

      expect(result).toBe(true);
    });

    it('should allow user to perform user actions', () => {
      const regularUser = new User({
        email: 'user@example.com',
        password: 'password',
        firstName: 'Regular',
        lastName: 'User',
        role: UserRole.USER,
      });

      const result = service.canPerformAction(regularUser, 'user:read:own');

      expect(result).toBe(true);
    });

    it('should deny user from performing admin actions', () => {
      const regularUser = new User({
        email: 'user@example.com',
        password: 'password',
        firstName: 'Regular',
        lastName: 'User',
        role: UserRole.USER,
      });

      const result = service.canPerformAction(regularUser, 'user:delete');

      expect(result).toBe(false);
    });
  });

  describe('canModifyUser', () => {
    it('should allow admin to modify any user', () => {
      const adminUser = new User({
        email: 'admin@example.com',
        password: 'password',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
      });

      const targetUser = new User({
        email: 'target@example.com',
        password: 'password',
        firstName: 'Target',
        lastName: 'User',
        role: UserRole.USER,
      });

      const result = service.canModifyUser(adminUser, targetUser);

      expect(result).toBe(true);
    });

    it('should allow moderator to modify regular users', () => {
      const moderatorUser = new User({
        email: 'moderator@example.com',
        password: 'password',
        firstName: 'Moderator',
        lastName: 'User',
        role: UserRole.MODERATOR,
      });

      const targetUser = new User({
        email: 'target@example.com',
        password: 'password',
        firstName: 'Target',
        lastName: 'User',
        role: UserRole.USER,
      });

      const result = service.canModifyUser(moderatorUser, targetUser);

      expect(result).toBe(true);
    });

    it('should deny regular user from modifying other users', () => {
      const regularUser = new User({
        email: 'user@example.com',
        password: 'password',
        firstName: 'Regular',
        lastName: 'User',
        role: UserRole.USER,
      });

      const targetUser = new User({
        email: 'target@example.com',
        password: 'password',
        firstName: 'Target',
        lastName: 'User',
        role: UserRole.USER,
      });

      const result = service.canModifyUser(regularUser, targetUser);

      expect(result).toBe(false);
    });
  });

  describe('getRolePermissions', () => {
    it('should return admin permissions', () => {
      const permissions = service.getRolePermissions(UserRole.ADMIN);

      expect(permissions).toContain('user:delete');
      expect(permissions).toContain('user:update');
      expect(permissions).toContain('user:read');
    });

    it('should return moderator permissions', () => {
      const permissions = service.getRolePermissions(UserRole.MODERATOR);

      expect(permissions).toContain('user:update');
      expect(permissions).toContain('user:read');
      expect(permissions).not.toContain('user:delete');
    });

    it('should return user permissions', () => {
      const permissions = service.getRolePermissions(UserRole.USER);

      expect(permissions).toContain('user:read:own');
      expect(permissions).not.toContain('user:update');
      expect(permissions).not.toContain('user:delete');
    });
  });

  describe('isValidRole', () => {
    it('should validate correct roles', () => {
      expect(service.isValidRole('user')).toBe(true);
      expect(service.isValidRole('admin')).toBe(true);
      expect(service.isValidRole('moderator')).toBe(true);
    });

    it('should reject invalid roles', () => {
      expect(service.isValidRole('invalid')).toBe(false);
      expect(service.isValidRole('')).toBe(false);
      expect(service.isValidRole('superuser')).toBe(false);
    });
  });

  describe('getDefaultRole', () => {
    it('should return USER as default role', () => {
      const defaultRole = service.getDefaultRole();

      expect(defaultRole).toBe(UserRole.USER);
    });
  });

  describe('validateUserInfo', () => {
    it('should validate correct user info', () => {
      const userInfo = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const result = service.validateUserInfo(userInfo);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty first name', () => {
      const userInfo = {
        firstName: '',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const result = service.validateUserInfo(userInfo);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'El nombre debe tener al menos 2 caracteres',
      );
    });

    it('should reject empty last name', () => {
      const userInfo = {
        firstName: 'John',
        lastName: '',
        email: 'john@example.com',
      };

      const result = service.validateUserInfo(userInfo);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'El apellido debe tener al menos 2 caracteres',
      );
    });

    it('should reject invalid email', () => {
      const userInfo = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
      };

      const result = service.validateUserInfo(userInfo);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('El email debe ser válido');
    });

    it('should collect multiple errors', () => {
      const userInfo = {
        firstName: '',
        lastName: '',
        email: 'invalid-email',
      };

      const result = service.validateUserInfo(userInfo);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors).toContain(
        'El nombre debe tener al menos 2 caracteres',
      );
      expect(result.errors).toContain(
        'El apellido debe tener al menos 2 caracteres',
      );
      expect(result.errors).toContain('El email debe ser válido');
    });
  });
});
