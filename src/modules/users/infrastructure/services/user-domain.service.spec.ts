/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserDomainService } from './user-domain.service';
import { UserRepository } from '../repositories/user.repository';
import { User } from '@/modules/users/domain/entities/user.entity';

describe('UserDomainService', () => {
  let service: UserDomainService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const mockUserRepository = {
      existsByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

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

    it('should return false for existing email', async () => {
      userRepository.existsByEmail.mockResolvedValue(true);

      const result = await service.validateEmail('existing@example.com');

      expect(result).toBe(false);
      expect(userRepository.existsByEmail).toHaveBeenCalledWith(
        'existing@example.com',
      );
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', () => {
      const validPasswords = ['Password123', 'MySecurePass1', 'ComplexP@ss1'];

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
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should produce different hashes for same password', async () => {
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
    it('should generate token with minimum length', () => {
      const token = service.generateEmailVerificationToken();

      expect(token).toBeDefined();
      expect(token.length).toBeGreaterThanOrEqual(20);
    });

    it('should generate different tokens on each call', () => {
      const token1 = service.generateEmailVerificationToken();
      const token2 = service.generateEmailVerificationToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('validateEmailVerificationToken', () => {
    it('should validate token with sufficient length', () => {
      const validToken = 'a'.repeat(25);
      const result = service.validateEmailVerificationToken(validToken);

      expect(result).toBe(true);
    });

    it('should reject token with insufficient length', () => {
      const invalidToken = 'short';
      const result = service.validateEmailVerificationToken(invalidToken);

      expect(result).toBe(false);
    });
  });

  describe('canPerformAction', () => {
    it('should allow admin to perform any action', () => {
      const adminUser = new User({
        email: 'admin@example.com',
        password: 'password',
      });

      const result = service.canPerformAction(adminUser, 'user:create');

      expect(result).toBe(true);
    });

    it('should allow user to perform user actions', () => {
      const regularUser = new User({
        email: 'user@example.com',
        password: 'password',
      });

      const result = service.canPerformAction(regularUser, 'user:read:own');

      expect(result).toBe(true);
    });

    it('should allow user to perform admin actions (temporary)', () => {
      const regularUser = new User({
        email: 'user@example.com',
        password: 'password',
      });

      const result = service.canPerformAction(regularUser, 'user:delete');

      expect(result).toBe(true); // TODO: Implementar sistema de roles
    });
  });

  describe('canModifyUser', () => {
    it('should allow admin to modify any user', () => {
      const adminUser = new User({
        email: 'admin@example.com',
        password: 'password',
      });

      const targetUser = new User({
        email: 'target@example.com',
        password: 'password',
      });

      const result = service.canModifyUser(adminUser, targetUser);

      expect(result).toBe(true);
    });

    it('should allow moderator to modify regular users', () => {
      const moderatorUser = new User({
        email: 'moderator@example.com',
        password: 'password',
      });

      const targetUser = new User({
        email: 'target@example.com',
        password: 'password',
      });

      const result = service.canModifyUser(moderatorUser, targetUser);

      expect(result).toBe(true);
    });

    it('should deny regular user from modifying other users', () => {
      const regularUser = new User({
        email: 'user@example.com',
        password: 'password',
      });

      const targetUser = new User({
        email: 'target@example.com',
        password: 'password',
      });

      const result = service.canModifyUser(regularUser, targetUser);

      expect(result).toBe(true); // Por ahora todos pueden modificar
    });
  });

  describe('getRolePermissions', () => {
    it('should return admin permissions', () => {
      const permissions = service.getRolePermissions('admin');

      expect(permissions).toContain('user:read');
      expect(permissions).toContain('user:write');
    });

    it('should return moderator permissions', () => {
      const permissions = service.getRolePermissions('moderator');

      expect(permissions).toContain('user:read');
      expect(permissions).toContain('user:write');
    });

    it('should return user permissions', () => {
      const permissions = service.getRolePermissions('user');

      expect(permissions).toContain('user:read');
      expect(permissions).toContain('user:write');
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
    });
  });

  describe('getDefaultRole', () => {
    it('should return USER as default role', () => {
      const defaultRole = service.getDefaultRole();

      expect(defaultRole).toBe('user');
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

    it('should reject short first name', () => {
      const userInfo = {
        firstName: 'J',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const result = service.validateUserInfo(userInfo);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'El nombre debe tener al menos 2 caracteres',
      );
    });

    it('should reject long first name', () => {
      const userInfo = {
        firstName: 'A'.repeat(51),
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const result = service.validateUserInfo(userInfo);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'El nombre no puede exceder 50 caracteres',
      );
    });

    it('should reject short last name', () => {
      const userInfo = {
        firstName: 'John',
        lastName: 'D',
        email: 'john@example.com',
      };

      const result = service.validateUserInfo(userInfo);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'El apellido debe tener al menos 2 caracteres',
      );
    });

    it('should reject long last name', () => {
      const userInfo = {
        firstName: 'John',
        lastName: 'A'.repeat(51),
        email: 'john@example.com',
      };

      const result = service.validateUserInfo(userInfo);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'El apellido no puede exceder 50 caracteres',
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

    it('should reject empty email', () => {
      const userInfo = {
        firstName: 'John',
        lastName: 'Doe',
        email: '',
      };

      const result = service.validateUserInfo(userInfo);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('El email debe ser válido');
    });

    it('should collect multiple errors', () => {
      const userInfo = {
        firstName: 'J',
        lastName: 'D',
        email: 'invalid',
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
