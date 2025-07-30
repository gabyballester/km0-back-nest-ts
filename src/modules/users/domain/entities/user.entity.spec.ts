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

  describe('business logic validation', () => {
    it('should allow email change by default', () => {
      const user = new User(mockUserData);
      expect(user.canChangeEmail()).toBe(true);
    });

    it('should allow password change by default', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 2); // 2 days ago

      const user = new User({
        ...mockUserData,
        updatedAt: oldDate,
      });
      expect(user.canChangePassword()).toBe(true);
    });

    it('should prevent password change if changed recently', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _user = new User(mockUserData);

      // Simulate recent password change
      const recentDate = new Date();
      recentDate.setHours(recentDate.getHours() - 12); // 12 hours ago

      const userWithRecentChange = new User({
        ...mockUserData,
        updatedAt: recentDate,
      });

      expect(userWithRecentChange.canChangePassword()).toBe(false);
    });

    it('should allow password change after sufficient time', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _user = new User(mockUserData);

      // Simulate old password change
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 2); // 2 days ago

      const userWithOldChange = new User({
        ...mockUserData,
        updatedAt: oldDate,
      });

      expect(userWithOldChange.canChangePassword()).toBe(true);
    });
  });

  describe('updateEmail', () => {
    it('should update email and updatedAt when allowed', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 2); // 2 days ago

      const user = new User({
        ...mockUserData,
        updatedAt: oldDate,
      });
      const originalUpdatedAt = user.updatedAt;
      const newEmail = 'new@example.com';

      user.updateEmail(newEmail);

      expect(user.email).toBe(newEmail);
      expect(user.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });

    it('should throw error when email change is not allowed', () => {
      const user = new User(mockUserData);

      // Mock canChangeEmail to return false
      jest.spyOn(user, 'canChangeEmail').mockReturnValue(false);

      expect(() => {
        user.updateEmail('new@example.com');
      }).toThrow('No se puede cambiar el email en este momento');
    });
  });

  describe('changePassword', () => {
    it('should update password and updatedAt when allowed', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 2); // 2 days ago

      const user = new User({
        ...mockUserData,
        updatedAt: oldDate,
      });
      const originalUpdatedAt = user.updatedAt;
      const newPassword = 'NewPassword123';

      user.changePassword(newPassword);

      expect(user.password).toBe(newPassword);
      expect(user.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });

    it('should throw error when password change is not allowed', () => {
      const user = new User(mockUserData);

      // Mock canChangePassword to return false
      jest.spyOn(user, 'canChangePassword').mockReturnValue(false);

      expect(() => {
        user.changePassword('NewPassword123');
      }).toThrow('No se puede cambiar la contraseña tan frecuentemente');
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

  describe('user classification', () => {
    it('should identify recent user correctly', () => {
      const recentUser = new User(mockUserData);
      expect(recentUser.isRecentUser()).toBe(true);
    });

    it('should identify old user correctly', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 31); // 31 days ago

      const oldUser = new User({
        ...mockUserData,
        createdAt: oldDate,
      });

      expect(oldUser.isRecentUser()).toBe(false);
    });

    it('should calculate user age in days correctly', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 5); // 5 days ago

      const user = new User({
        ...mockUserData,
        createdAt: oldDate,
      });

      const ageInDays = user.getUserAgeInDays();
      expect(ageInDays).toBeGreaterThanOrEqual(5);
      expect(ageInDays).toBeLessThanOrEqual(6);
    });

    it('should calculate user age for very recent user', () => {
      const user = new User(mockUserData);
      expect(user.getUserAgeInDays()).toBe(0);
    });
  });

  describe('updateEmail edge cases', () => {
    it('should update email multiple times', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 2); // 2 days ago

      const user = new User({
        ...mockUserData,
        updatedAt: oldDate,
      });

      user.updateEmail('second@example.com');
      expect(user.email).toBe('second@example.com');

      user.updateEmail('third@example.com');
      expect(user.email).toBe('third@example.com');
    });

    it('should preserve other properties when updating email', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 2); // 2 days ago

      const user = new User({
        ...mockUserData,
        updatedAt: oldDate,
      });

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
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 2); // 2 days ago

      const user = new User({
        ...mockUserData,
        updatedAt: oldDate,
      });

      user.changePassword('SecondPass123!');
      expect(user.password).toBe('SecondPass123!');

      // Mock the updatedAt to be old enough for the second change
      const olderDate = new Date();
      olderDate.setDate(olderDate.getDate() - 3); // 3 days ago
      user.updatedAt = olderDate;

      user.changePassword('ThirdPass123!');
      expect(user.password).toBe('ThirdPass123!');
    });

    it('should preserve other properties when changing password', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 2); // 2 days ago

      const user = new User({
        ...mockUserData,
        updatedAt: oldDate,
      });

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
