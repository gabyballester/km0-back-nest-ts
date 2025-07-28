import {
  UserResponseDto,
  UsersPaginatedResponseDto,
} from './user-response.dto';
import { UserRole } from '@/modules/users/domain/entities/user.entity';

describe('UserResponseDto', () => {
  let userResponseDto: UserResponseDto;

  beforeEach(() => {
    userResponseDto = new UserResponseDto();
  });

  describe('Constructor', () => {
    it('should create instance with default values', () => {
      expect(userResponseDto.id).toBe('');
      expect(userResponseDto.email).toBe('');
      expect(userResponseDto.firstName).toBe('');
      expect(userResponseDto.lastName).toBe('');
      expect(userResponseDto.fullName).toBe('');
      expect(userResponseDto.isActive).toBe(false);
      expect(userResponseDto.role).toBe(UserRole.USER);
      expect(userResponseDto.createdAt).toBeInstanceOf(Date);
      expect(userResponseDto.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Properties', () => {
    it('should set and get id correctly', () => {
      const testId = 'test-id-123';
      userResponseDto.id = testId;
      expect(userResponseDto.id).toBe(testId);
    });

    it('should set and get email correctly', () => {
      const testEmail = 'test@example.com';
      userResponseDto.email = testEmail;
      expect(userResponseDto.email).toBe(testEmail);
    });

    it('should set and get firstName correctly', () => {
      const testFirstName = 'John';
      userResponseDto.firstName = testFirstName;
      expect(userResponseDto.firstName).toBe(testFirstName);
    });

    it('should set and get lastName correctly', () => {
      const testLastName = 'Doe';
      userResponseDto.lastName = testLastName;
      expect(userResponseDto.lastName).toBe(testLastName);
    });

    it('should set and get fullName correctly', () => {
      const testFullName = 'John Doe';
      userResponseDto.fullName = testFullName;
      expect(userResponseDto.fullName).toBe(testFullName);
    });

    it('should set and get isActive correctly', () => {
      userResponseDto.isActive = true;
      expect(userResponseDto.isActive).toBe(true);

      userResponseDto.isActive = false;
      expect(userResponseDto.isActive).toBe(false);
    });

    it('should set and get role correctly', () => {
      userResponseDto.role = UserRole.ADMIN;
      expect(userResponseDto.role).toBe(UserRole.ADMIN);

      userResponseDto.role = UserRole.MODERATOR;
      expect(userResponseDto.role).toBe(UserRole.MODERATOR);

      userResponseDto.role = UserRole.USER;
      expect(userResponseDto.role).toBe(UserRole.USER);
    });

    it('should set and get createdAt correctly', () => {
      const testDate = new Date('2024-01-01T10:00:00Z');
      userResponseDto.createdAt = testDate;
      expect(userResponseDto.createdAt).toBe(testDate);
    });

    it('should set and get updatedAt correctly', () => {
      const testDate = new Date('2024-01-02T15:30:00Z');
      userResponseDto.updatedAt = testDate;
      expect(userResponseDto.updatedAt).toBe(testDate);
    });
  });

  describe('Object creation', () => {
    it('should create object with all properties', () => {
      const testDate = new Date('2024-01-01T10:00:00Z');

      userResponseDto.id = 'user-123';
      userResponseDto.email = 'john@example.com';
      userResponseDto.firstName = 'John';
      userResponseDto.lastName = 'Doe';
      userResponseDto.fullName = 'John Doe';
      userResponseDto.isActive = true;
      userResponseDto.role = UserRole.ADMIN;
      userResponseDto.createdAt = testDate;
      userResponseDto.updatedAt = testDate;

      expect(userResponseDto).toEqual({
        id: 'user-123',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        isActive: true,
        role: UserRole.ADMIN,
        createdAt: testDate,
        updatedAt: testDate,
      });
    });

    it('should create object with minimal properties', () => {
      userResponseDto.id = 'user-123';
      userResponseDto.email = 'john@example.com';
      userResponseDto.firstName = 'John';
      userResponseDto.lastName = 'Doe';
      userResponseDto.fullName = 'John Doe';

      expect(userResponseDto.id).toBe('user-123');
      expect(userResponseDto.email).toBe('john@example.com');
      expect(userResponseDto.firstName).toBe('John');
      expect(userResponseDto.lastName).toBe('Doe');
      expect(userResponseDto.fullName).toBe('John Doe');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty strings', () => {
      userResponseDto.id = '';
      userResponseDto.email = '';
      userResponseDto.firstName = '';
      userResponseDto.lastName = '';
      userResponseDto.fullName = '';

      expect(userResponseDto.id).toBe('');
      expect(userResponseDto.email).toBe('');
      expect(userResponseDto.firstName).toBe('');
      expect(userResponseDto.lastName).toBe('');
      expect(userResponseDto.fullName).toBe('');
    });

    it('should handle special characters in names', () => {
      userResponseDto.firstName = 'José María';
      userResponseDto.lastName = "O'Connor";
      userResponseDto.fullName = "José María O'Connor";

      expect(userResponseDto.firstName).toBe('José María');
      expect(userResponseDto.lastName).toBe("O'Connor");
      expect(userResponseDto.fullName).toBe("José María O'Connor");
    });

    it('should handle long strings', () => {
      const longString = 'A'.repeat(1000);
      userResponseDto.id = longString;
      userResponseDto.email = longString;
      userResponseDto.firstName = longString;
      userResponseDto.lastName = longString;
      userResponseDto.fullName = longString;

      expect(userResponseDto.id).toBe(longString);
      expect(userResponseDto.email).toBe(longString);
      expect(userResponseDto.firstName).toBe(longString);
      expect(userResponseDto.lastName).toBe(longString);
      expect(userResponseDto.fullName).toBe(longString);
    });
  });
});

describe('UsersPaginatedResponseDto', () => {
  let usersPaginatedResponseDto: UsersPaginatedResponseDto;

  beforeEach(() => {
    usersPaginatedResponseDto = new UsersPaginatedResponseDto();
  });

  describe('Constructor', () => {
    it('should create instance with default values', () => {
      expect(usersPaginatedResponseDto.users).toEqual([]);
      expect(usersPaginatedResponseDto.total).toBe(0);
      expect(usersPaginatedResponseDto.page).toBe(1);
      expect(usersPaginatedResponseDto.limit).toBe(10);
      expect(usersPaginatedResponseDto.totalPages).toBe(0);
    });
  });

  describe('Properties', () => {
    it('should set and get users correctly', () => {
      const testUsers = [new UserResponseDto(), new UserResponseDto()];
      usersPaginatedResponseDto.users = testUsers;
      expect(usersPaginatedResponseDto.users).toBe(testUsers);
      expect(usersPaginatedResponseDto.users).toHaveLength(2);
    });

    it('should set and get total correctly', () => {
      usersPaginatedResponseDto.total = 100;
      expect(usersPaginatedResponseDto.total).toBe(100);
    });

    it('should set and get page correctly', () => {
      usersPaginatedResponseDto.page = 5;
      expect(usersPaginatedResponseDto.page).toBe(5);
    });

    it('should set and get limit correctly', () => {
      usersPaginatedResponseDto.limit = 25;
      expect(usersPaginatedResponseDto.limit).toBe(25);
    });

    it('should set and get totalPages correctly', () => {
      usersPaginatedResponseDto.totalPages = 10;
      expect(usersPaginatedResponseDto.totalPages).toBe(10);
    });
  });

  describe('Object creation', () => {
    it('should create object with all properties', () => {
      const testUsers = [new UserResponseDto(), new UserResponseDto()];

      usersPaginatedResponseDto.users = testUsers;
      usersPaginatedResponseDto.total = 50;
      usersPaginatedResponseDto.page = 2;
      usersPaginatedResponseDto.limit = 25;
      usersPaginatedResponseDto.totalPages = 2;

      expect(usersPaginatedResponseDto).toEqual({
        users: testUsers,
        total: 50,
        page: 2,
        limit: 25,
        totalPages: 2,
      });
    });

    it('should create object with empty users array', () => {
      usersPaginatedResponseDto.users = [];
      usersPaginatedResponseDto.total = 0;
      usersPaginatedResponseDto.page = 1;
      usersPaginatedResponseDto.limit = 10;
      usersPaginatedResponseDto.totalPages = 0;

      expect(usersPaginatedResponseDto.users).toEqual([]);
      expect(usersPaginatedResponseDto.total).toBe(0);
      expect(usersPaginatedResponseDto.page).toBe(1);
      expect(usersPaginatedResponseDto.limit).toBe(10);
      expect(usersPaginatedResponseDto.totalPages).toBe(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle large numbers', () => {
      usersPaginatedResponseDto.total = Number.MAX_SAFE_INTEGER;
      usersPaginatedResponseDto.page = Number.MAX_SAFE_INTEGER;
      usersPaginatedResponseDto.limit = Number.MAX_SAFE_INTEGER;
      usersPaginatedResponseDto.totalPages = Number.MAX_SAFE_INTEGER;

      expect(usersPaginatedResponseDto.total).toBe(Number.MAX_SAFE_INTEGER);
      expect(usersPaginatedResponseDto.page).toBe(Number.MAX_SAFE_INTEGER);
      expect(usersPaginatedResponseDto.limit).toBe(Number.MAX_SAFE_INTEGER);
      expect(usersPaginatedResponseDto.totalPages).toBe(
        Number.MAX_SAFE_INTEGER,
      );
    });

    it('should handle zero values', () => {
      usersPaginatedResponseDto.total = 0;
      usersPaginatedResponseDto.page = 0;
      usersPaginatedResponseDto.limit = 0;
      usersPaginatedResponseDto.totalPages = 0;

      expect(usersPaginatedResponseDto.total).toBe(0);
      expect(usersPaginatedResponseDto.page).toBe(0);
      expect(usersPaginatedResponseDto.limit).toBe(0);
      expect(usersPaginatedResponseDto.totalPages).toBe(0);
    });

    it('should handle negative values', () => {
      usersPaginatedResponseDto.total = -1;
      usersPaginatedResponseDto.page = -1;
      usersPaginatedResponseDto.limit = -1;
      usersPaginatedResponseDto.totalPages = -1;

      expect(usersPaginatedResponseDto.total).toBe(-1);
      expect(usersPaginatedResponseDto.page).toBe(-1);
      expect(usersPaginatedResponseDto.limit).toBe(-1);
      expect(usersPaginatedResponseDto.totalPages).toBe(-1);
    });
  });
});
