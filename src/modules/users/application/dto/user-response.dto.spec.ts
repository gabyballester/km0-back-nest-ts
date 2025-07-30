import {
  UserResponseDto,
  UsersPaginatedResponseDto,
} from './user-response.dto';

describe('UserResponseDto', () => {
  let userResponseDto: UserResponseDto;

  beforeEach(() => {
    userResponseDto = new UserResponseDto();
  });

  describe('constructor', () => {
    it('should create a UserResponseDto with default values', () => {
      expect(userResponseDto.id).toBe('');
      expect(userResponseDto.email).toBe('');
      expect(userResponseDto.createdAt).toBeInstanceOf(Date);
      expect(userResponseDto.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('properties', () => {
    it('should allow setting and getting id', () => {
      userResponseDto.id = 'test-id';
      expect(userResponseDto.id).toBe('test-id');
    });

    it('should allow setting and getting email', () => {
      userResponseDto.email = 'test@example.com';
      expect(userResponseDto.email).toBe('test@example.com');
    });

    it('should allow setting and getting createdAt', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      userResponseDto.createdAt = date;
      expect(userResponseDto.createdAt).toBe(date);
    });

    it('should allow setting and getting updatedAt', () => {
      const date = new Date('2024-01-02T15:30:00Z');
      userResponseDto.updatedAt = date;
      expect(userResponseDto.updatedAt).toBe(date);
    });
  });

  describe('validation', () => {
    it('should handle empty string values', () => {
      userResponseDto.id = '';
      userResponseDto.email = '';

      expect(userResponseDto.id).toBe('');
      expect(userResponseDto.email).toBe('');
    });

    it('should handle special characters in email', () => {
      userResponseDto.email = 'test+tag@example.com';
      expect(userResponseDto.email).toBe('test+tag@example.com');
    });

    it('should handle long email addresses', () => {
      const longEmail =
        'very.long.email.address.with.many.subdomains@example.com';
      userResponseDto.email = longEmail;
      expect(userResponseDto.email).toBe(longEmail);
    });

    it('should handle different date formats', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-12-31T23:59:59.999Z');

      userResponseDto.createdAt = date1;
      userResponseDto.updatedAt = date2;

      expect(userResponseDto.createdAt).toBe(date1);
      expect(userResponseDto.updatedAt).toBe(date2);
    });
  });
});

describe('UsersPaginatedResponseDto', () => {
  let paginatedResponseDto: UsersPaginatedResponseDto;

  beforeEach(() => {
    paginatedResponseDto = new UsersPaginatedResponseDto();
  });

  describe('constructor', () => {
    it('should create a UsersPaginatedResponseDto with default values', () => {
      expect(paginatedResponseDto.users).toEqual([]);
      expect(paginatedResponseDto.total).toBe(0);
      expect(paginatedResponseDto.page).toBe(1);
      expect(paginatedResponseDto.limit).toBe(10);
      expect(paginatedResponseDto.totalPages).toBe(0);
    });
  });

  describe('properties', () => {
    it('should allow setting and getting users array', () => {
      const users = [new UserResponseDto(), new UserResponseDto()];
      paginatedResponseDto.users = users;
      expect(paginatedResponseDto.users).toBe(users);
    });

    it('should allow setting and getting total count', () => {
      paginatedResponseDto.total = 100;
      expect(paginatedResponseDto.total).toBe(100);
    });

    it('should allow setting and getting page number', () => {
      paginatedResponseDto.page = 5;
      expect(paginatedResponseDto.page).toBe(5);
    });

    it('should allow setting and getting limit', () => {
      paginatedResponseDto.limit = 25;
      expect(paginatedResponseDto.limit).toBe(25);
    });

    it('should allow setting and getting total pages', () => {
      paginatedResponseDto.totalPages = 10;
      expect(paginatedResponseDto.totalPages).toBe(10);
    });
  });

  describe('validation', () => {
    it('should handle empty users array', () => {
      paginatedResponseDto.users = [];
      expect(paginatedResponseDto.users).toEqual([]);
    });

    it('should handle zero values', () => {
      paginatedResponseDto.total = 0;
      paginatedResponseDto.page = 0;
      paginatedResponseDto.limit = 0;
      paginatedResponseDto.totalPages = 0;

      expect(paginatedResponseDto.total).toBe(0);
      expect(paginatedResponseDto.page).toBe(0);
      expect(paginatedResponseDto.limit).toBe(0);
      expect(paginatedResponseDto.totalPages).toBe(0);
    });

    it('should handle large numbers', () => {
      paginatedResponseDto.total = 999999;
      paginatedResponseDto.page = 1000;
      paginatedResponseDto.limit = 100;
      paginatedResponseDto.totalPages = 10000;

      expect(paginatedResponseDto.total).toBe(999999);
      expect(paginatedResponseDto.page).toBe(1000);
      expect(paginatedResponseDto.limit).toBe(100);
      expect(paginatedResponseDto.totalPages).toBe(10000);
    });
  });
});
