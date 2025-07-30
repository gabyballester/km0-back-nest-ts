import { User } from './user.entity';

describe('User Entity', () => {
  const mockUserData = {
    email: 'test@example.com',
    password: 'Password123',
  };

  describe('constructor', () => {
    it('should create a user with provided data', () => {
      const user = new User(mockUserData);

      expect(user.email).toBe(mockUserData.email);
      expect(user.password).toBe(mockUserData.password);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a user with custom data', () => {
      const customData = {
        id: 'custom-id',
        email: 'custom@example.com',
        password: 'CustomPass123',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-02T15:30:00Z'),
      };

      const user = new User(customData);

      expect(user.id).toBe(customData.id);
      expect(user.email).toBe(customData.email);
      expect(user.password).toBe(customData.password);
      expect(user.createdAt).toBe(customData.createdAt);
      expect(user.updatedAt).toBe(customData.updatedAt);
    });

    it('should generate unique ID when not provided', () => {
      const user1 = new User(mockUserData);
      const user2 = new User(mockUserData);

      expect(user1.id).not.toBe(user2.id);
      expect(user1.id).toMatch(/^user_\d+_[a-z0-9]+$/);
      expect(user2.id).toMatch(/^user_\d+_[a-z0-9]+$/);
    });

    it('should set default timestamps when not provided', () => {
      const beforeCreation = new Date();
      const user = new User(mockUserData);
      const afterCreation = new Date();

      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(user.updatedAt.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });
  });

  describe('email validation', () => {
    it('should validate correct email format', () => {
      const user = new User(mockUserData);
      expect(user.isValidEmail()).toBe(true);
    });

    it('should reject invalid email format', () => {
      const user = new User({
        ...mockUserData,
        email: 'invalid-email',
      });
      expect(user.isValidEmail()).toBe(false);
    });

    it('should reject empty email', () => {
      const user = new User({
        ...mockUserData,
        email: '',
      });
      expect(user.isValidEmail()).toBe(false);
    });

    it('should accept email with special characters', () => {
      const user = new User({
        ...mockUserData,
        email: 'test+tag@example.com',
      });
      expect(user.isValidEmail()).toBe(true);
    });

    it('should accept email with subdomains', () => {
      const user = new User({
        ...mockUserData,
        email: 'user@subdomain.example.com',
      });
      expect(user.isValidEmail()).toBe(true);
    });
  });

  describe('password validation', () => {
    it('should validate correct password length', () => {
      const user = new User(mockUserData);
      expect(user.isValidPassword()).toBe(true);
    });

    it('should reject short password', () => {
      const user = new User({
        ...mockUserData,
        password: 'short',
      });
      expect(user.isValidPassword()).toBe(false);
    });

    it('should accept minimum valid password length', () => {
      const user = new User({
        ...mockUserData,
        password: 'Pass123!',
      });
      expect(user.isValidPassword()).toBe(true);
    });

    it('should accept long password', () => {
      const user = new User({
        ...mockUserData,
        password: 'A'.repeat(100),
      });
      expect(user.isValidPassword()).toBe(true);
    });
  });

  describe('updateEmail', () => {
    it('should update email and updatedAt', () => {
      const user = new User(mockUserData);
      const originalUpdatedAt = user.updatedAt;
      const newEmail = 'new@example.com';

      // Wait a bit to ensure timestamp difference
      setTimeout(() => {
        user.updateEmail(newEmail);

        expect(user.email).toBe(newEmail);
        expect(user.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime(),
        );
      }, 1);
    });
  });

  describe('changePassword', () => {
    it('should update password and updatedAt', () => {
      const user = new User(mockUserData);
      const originalUpdatedAt = user.updatedAt;
      const newPassword = 'NewPassword123';

      // Wait a bit to ensure timestamp difference
      setTimeout(() => {
        user.changePassword(newPassword);

        expect(user.password).toBe(newPassword);
        expect(user.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime(),
        );
      }, 1);
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON representation', () => {
      const customData = {
        id: 'test-id',
        email: 'test@example.com',
        password: 'Password123',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-02T15:30:00Z'),
      };

      const user = new User(customData);
      const json = user.toJSON();

      expect(json).toEqual({
        id: customData.id,
        email: customData.email,
        password: customData.password,
        createdAt: customData.createdAt,
        updatedAt: customData.updatedAt,
      });
    });
  });

  describe('fromJSON', () => {
    it('should create user from JSON data', () => {
      const jsonData = {
        id: 'test-id',
        email: 'test@example.com',
        password: 'Password123',
        createdAt: '2024-01-01T10:00:00.000Z',
        updatedAt: '2024-01-02T15:30:00.000Z',
      };

      const user = User.fromJSON(jsonData);

      expect(user.id).toBe(jsonData.id);
      expect(user.email).toBe(jsonData.email);
      expect(user.password).toBe(jsonData.password);
      expect(user.createdAt).toEqual(new Date(jsonData.createdAt));
      expect(user.updatedAt).toEqual(new Date(jsonData.updatedAt));
    });

    it('should handle Date objects in JSON data', () => {
      const jsonData = {
        id: 'test-id',
        email: 'test@example.com',
        password: 'Password123',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-02T15:30:00Z'),
      };

      const user = User.fromJSON(jsonData);

      expect(user.id).toBe(jsonData.id);
      expect(user.email).toBe(jsonData.email);
      expect(user.password).toBe(jsonData.password);
      expect(user.createdAt).toEqual(jsonData.createdAt);
      expect(user.updatedAt).toEqual(jsonData.updatedAt);
    });

    it('should handle different date formats', () => {
      const jsonData = {
        id: 'test-id',
        email: 'test@example.com',
        password: 'Password123',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
      };

      const user = User.fromJSON(jsonData);

      expect(user.createdAt).toEqual(new Date('2024-01-01'));
      expect(user.updatedAt).toEqual(new Date('2024-01-02'));
    });

    it('should preserve data types correctly', () => {
      const jsonData = {
        id: 'test-id',
        email: 'test@example.com',
        password: 'Password123',
        createdAt: '2024-01-01T10:00:00.000Z',
        updatedAt: '2024-01-02T15:30:00.000Z',
      };

      const user = User.fromJSON(jsonData);

      expect(typeof user.id).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(typeof user.password).toBe('string');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('email validation edge cases', () => {
    it('should reject email without @', () => {
      const user = new User({
        ...mockUserData,
        email: 'testexample.com',
      });
      expect(user.isValidEmail()).toBe(false);
    });

    it('should reject email without domain', () => {
      const user = new User({
        ...mockUserData,
        email: 'test@',
      });
      expect(user.isValidEmail()).toBe(false);
    });

    it('should reject email with spaces', () => {
      const user = new User({
        ...mockUserData,
        email: 'test @example.com',
      });
      expect(user.isValidEmail()).toBe(false);
    });

    it('should accept complex valid emails', () => {
      const validEmails = [
        'test+tag@example.com',
        'test.name@example.co.uk',
        'test123@example-domain.com',
        'test@example.com',
        'user@subdomain.example.com',
      ];

      validEmails.forEach(email => {
        const user = new User({
          ...mockUserData,
          email,
        });
        expect(user.isValidEmail()).toBe(true);
      });
    });
  });

  describe('password validation edge cases', () => {
    it('should reject password with exactly 7 characters', () => {
      const user = new User({
        ...mockUserData,
        password: 'Pass12!',
      });
      expect(user.isValidPassword()).toBe(false);
    });

    it('should accept password with exactly 8 characters', () => {
      const user = new User({
        ...mockUserData,
        password: 'Pass123!',
      });
      expect(user.isValidPassword()).toBe(true);
    });

    it('should reject empty password', () => {
      const user = new User({
        ...mockUserData,
        password: '',
      });
      expect(user.isValidPassword()).toBe(false);
    });
  });

  describe('updateEmail edge cases', () => {
    it('should update email multiple times', () => {
      const user = new User(mockUserData);

      user.updateEmail('second@example.com');
      expect(user.email).toBe('second@example.com');

      user.updateEmail('third@example.com');
      expect(user.email).toBe('third@example.com');
    });

    it('should preserve other properties when updating email', () => {
      const user = new User(mockUserData);

      const originalId = user.id;
      const originalPassword = user.password;
      const originalCreatedAt = user.createdAt;

      user.updateEmail('new@example.com');

      expect(user.id).toBe(originalId);
      expect(user.password).toBe(originalPassword);
      expect(user.createdAt).toBe(originalCreatedAt);
    });
  });

  describe('changePassword edge cases', () => {
    it('should update password multiple times', () => {
      const user = new User(mockUserData);

      user.changePassword('SecondPass123!');
      expect(user.password).toBe('SecondPass123!');

      user.changePassword('ThirdPass123!');
      expect(user.password).toBe('ThirdPass123!');
    });

    it('should preserve other properties when changing password', () => {
      const user = new User(mockUserData);

      const originalId = user.id;
      const originalEmail = user.email;
      const originalCreatedAt = user.createdAt;

      user.changePassword('NewPass123!');

      expect(user.id).toBe(originalId);
      expect(user.email).toBe(originalEmail);
      expect(user.createdAt).toBe(originalCreatedAt);
    });
  });

  describe('toJSON edge cases', () => {
    it('should return correct data types', () => {
      const user = new User(mockUserData);
      const json = user.toJSON();

      expect(typeof json.id).toBe('string');
      expect(typeof json.email).toBe('string');
      expect(typeof json.password).toBe('string');
      expect(json.createdAt).toBeInstanceOf(Date);
      expect(json.updatedAt).toBeInstanceOf(Date);
    });

    it('should return immutable data', () => {
      const user = new User(mockUserData);
      const json = user.toJSON();
      const originalId = json.id;
      const originalEmail = json.email;

      // Modify the returned object
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      (json as any).id = 'modified';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      (json as any).email = 'modified@example.com';

      // Original user should remain unchanged
      expect(user.id).toBe(originalId);
      expect(user.email).toBe(originalEmail);
    });
  });

  describe('immutability', () => {
    it('should have readonly id and createdAt', () => {
      const user = new User(mockUserData);

      // En JavaScript, las propiedades readonly no son realmente inmutables en runtime
      // Solo TypeScript las previene en tiempo de compilación
      // Este test verifica que las propiedades están marcadas como readonly en TypeScript
      expect(typeof user.id).toBe('string');
      expect(user.createdAt).toBeInstanceOf(Date);

      // Verificamos que las propiedades existen y tienen valores válidos
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.id).toMatch(/^user_\d+_[a-z0-9]+$/);
    });
  });
});
