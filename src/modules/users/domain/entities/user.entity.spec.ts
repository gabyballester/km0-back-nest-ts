import { User, UserRole } from './user.entity';
// UserFactory import removed as it's not being used in this test file

describe('User Entity', () => {
  const mockUserData = {
    email: 'test@example.com',
    password: 'hashedPassword123',
    firstName: 'John',
    lastName: 'Doe',
  };

  describe('Constructor', () => {
    it('should create a user with default values', () => {
      const user = new User(mockUserData);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(mockUserData.email);
      expect(user.password).toBe(mockUserData.password);
      expect(user.firstName).toBe(mockUserData.firstName);
      expect(user.lastName).toBe(mockUserData.lastName);
      expect(user.isActive).toBe(true);
      expect(user.role).toBe(UserRole.USER);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a user with custom values', () => {
      const customData = {
        ...mockUserData,
        id: 'custom-id',
        isActive: false,
        role: UserRole.ADMIN,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      const user = new User(customData);

      expect(user.id).toBe(customData.id);
      expect(user.isActive).toBe(customData.isActive);
      expect(user.role).toBe(customData.role);
      expect(user.createdAt).toEqual(customData.createdAt);
      expect(user.updatedAt).toEqual(customData.updatedAt);
    });
  });

  describe('Getters', () => {
    let user: User;

    beforeEach(() => {
      user = new User(mockUserData);
    });

    it('should return full name', () => {
      expect(user.fullName).toBe('John Doe');
    });

    it('should return full name with single name', () => {
      const singleNameUser = new User({
        ...mockUserData,
        firstName: 'John',
        lastName: '',
      });
      expect(singleNameUser.fullName).toBe('John');
    });

    it('should check if user is admin', () => {
      expect(user.isAdmin).toBe(false);

      const adminUser = new User({
        ...mockUserData,
        role: UserRole.ADMIN,
      });
      expect(adminUser.isAdmin).toBe(true);
    });

    it('should check if user is active', () => {
      expect(user.isUserActive).toBe(true);

      const inactiveUser = new User({
        ...mockUserData,
        isActive: false,
      });
      expect(inactiveUser.isUserActive).toBe(false);
    });
  });

  describe('Role Management', () => {
    let user: User;

    beforeEach(() => {
      user = new User(mockUserData);
    });

    it('should check if user has specific role', () => {
      expect(user.hasRole(UserRole.USER)).toBe(true);
      expect(user.hasRole(UserRole.ADMIN)).toBe(false);
    });

    it('should change user role', () => {
      user.changeRole(UserRole.ADMIN);

      expect(user.role).toBe(UserRole.ADMIN);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Status Management', () => {
    let user: User;

    beforeEach(() => {
      user = new User(mockUserData);
    });

    it('should activate user', () => {
      user.isActive = false;

      user.activate();

      expect(user.isActive).toBe(true);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should deactivate user', () => {
      user.deactivate();

      expect(user.isActive).toBe(false);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Information Updates', () => {
    let user: User;

    beforeEach(() => {
      user = new User(mockUserData);
    });

    it('should update user information', () => {
      user.updateInfo({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      });

      expect(user.firstName).toBe('Jane');
      expect(user.lastName).toBe('Smith');
      expect(user.email).toBe('jane@example.com');
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should update partial information', () => {
      user.updateInfo({
        firstName: 'Jane',
      });

      expect(user.firstName).toBe('Jane');
      expect(user.lastName).toBe('Doe'); // Unchanged
      expect(user.email).toBe('test@example.com'); // Unchanged
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Password Management', () => {
    let user: User;

    beforeEach(() => {
      user = new User(mockUserData);
    });

    it('should change password', () => {
      const newPassword = 'newHashedPassword456';

      user.changePassword(newPassword);

      expect(user.password).toBe(newPassword);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Serialization', () => {
    let user: User;

    beforeEach(() => {
      user = new User(mockUserData);
    });

    it('should convert to JSON', () => {
      const json = user.toJSON();

      expect(json).toEqual({
        id: user.id,
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    });

    it('should create from JSON', () => {
      const json = user.toJSON();
      const newUser = User.fromJSON(
        json as {
          id: string;
          email: string;
          password: string;
          firstName: string;
          lastName: string;
          isActive: boolean;
          role: string;
          createdAt: string | Date;
          updatedAt: string | Date;
        },
      );

      expect(newUser.id).toBe(user.id);
      expect(newUser.email).toBe(user.email);
      expect(newUser.password).toBe(user.password);
      expect(newUser.firstName).toBe(user.firstName);
      expect(newUser.lastName).toBe(user.lastName);
      expect(newUser.isActive).toBe(user.isActive);
      expect(newUser.role).toBe(user.role);
      expect(newUser.createdAt).toEqual(user.createdAt);
      expect(newUser.updatedAt).toEqual(user.updatedAt);
    });

    it('should handle date strings in fromJSON', () => {
      const jsonData = {
        id: 'test-id',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        role: 'user',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
      };

      const user = User.fromJSON(jsonData);

      expect(user.id).toBe(jsonData.id);
      expect(user.email).toBe(jsonData.email);
      expect(user.password).toBe(jsonData.password);
      expect(user.firstName).toBe(jsonData.firstName);
      expect(user.lastName).toBe(jsonData.lastName);
      expect(user.isActive).toBe(jsonData.isActive);
      expect(user.role).toBe(UserRole.USER);
      expect(user.createdAt).toEqual(new Date(jsonData.createdAt));
      expect(user.updatedAt).toEqual(new Date(jsonData.updatedAt));
    });
  });

  describe('UserRole Enum', () => {
    it('should have correct role values', () => {
      expect(UserRole.USER).toBe('user');
      expect(UserRole.ADMIN).toBe('admin');
      expect(UserRole.MODERATOR).toBe('moderator');
    });

    it('should have correct role type', () => {
      const role: UserRole = UserRole.ADMIN;
      expect(role).toBe('admin');
    });
  });
});
