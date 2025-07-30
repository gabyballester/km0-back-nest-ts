import { UserPersistenceAdapter } from './user.persistence.adapter';
import { User } from '@/modules/users/domain/entities/user.entity';

describe('UserPersistenceAdapter', () => {
  let mockUser: User;
  let mockPrismaUser: {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  };

  beforeEach(() => {
    const now = new Date();
    mockUser = new User({
      id: 'user_1234567890_abc123',
      email: 'test@example.com',
      password: 'hashedPassword123',
      createdAt: now,
      updatedAt: now,
    });

    mockPrismaUser = {
      id: 'user_1234567890_abc123',
      email: 'test@example.com',
      password: 'hashedPassword123',
      createdAt: now,
      updatedAt: now,
    };
  });

  describe('toPrismaCreate', () => {
    it('should convert User entity to Prisma create input', () => {
      const result = UserPersistenceAdapter.toPrismaCreate(mockUser);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        password: mockUser.password,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should handle user without explicit id', () => {
      const userWithoutId = new User({
        email: 'test@example.com',
        password: 'hashedPassword123',
      });

      const result = UserPersistenceAdapter.toPrismaCreate(userWithoutId);

      expect(result.id).toBeDefined();
      expect(result.email).toBe(userWithoutId.email);
      expect(result.password).toBe(userWithoutId.password);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('toPrismaUpdate', () => {
    it('should convert User entity to Prisma update input', () => {
      const result = UserPersistenceAdapter.toPrismaUpdate(mockUser);

      expect(result.email).toBe(mockUser.email);
      expect(result.password).toBe(mockUser.password);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.id).toBeUndefined();
      expect(result.createdAt).toBeUndefined();
    });

    it('should not include id in update input', () => {
      const result = UserPersistenceAdapter.toPrismaUpdate(mockUser);

      expect(result.id).toBeUndefined();
      expect(result.createdAt).toBeUndefined();
    });

    it('should handle partial updates correctly', () => {
      const partialUser = { email: 'new@example.com' };
      const result = UserPersistenceAdapter.toPrismaUpdate(partialUser);

      expect(result.email).toBe('new@example.com');
      expect(result.password).toBeUndefined();
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle empty partial update', () => {
      const result = UserPersistenceAdapter.toPrismaUpdate({});

      expect(result.email).toBeUndefined();
      expect(result.password).toBeUndefined();
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('fromPrisma', () => {
    it('should convert Prisma user data to User entity', () => {
      const result = UserPersistenceAdapter.fromPrisma(mockPrismaUser);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(mockPrismaUser.id);
      expect(result.email).toBe(mockPrismaUser.email);
      expect(result.password).toBe(mockPrismaUser.password);
      expect(result.createdAt).toEqual(mockPrismaUser.createdAt);
      expect(result.updatedAt).toEqual(mockPrismaUser.updatedAt);
    });

    it('should handle date strings from database', () => {
      const prismaUserWithStringDates = {
        ...mockPrismaUser,
        createdAt: mockPrismaUser.createdAt.toISOString(),
        updatedAt: mockPrismaUser.updatedAt.toISOString(),
      };

      const result = UserPersistenceAdapter.fromPrisma(
        prismaUserWithStringDates,
      );

      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('fromPrismaMany', () => {
    it('should convert multiple Prisma user data to User entities', () => {
      const multiplePrismaUsers = [
        mockPrismaUser,
        {
          ...mockPrismaUser,
          id: 'user_1234567890_def456',
          email: 'test2@example.com',
        },
      ];

      const result = UserPersistenceAdapter.fromPrismaMany(multiplePrismaUsers);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(User);
      expect(result[1]).toBeInstanceOf(User);
      expect(result[0].id).toBe(mockPrismaUser.id);
      expect(result[1].id).toBe('user_1234567890_def456');
    });

    it('should return empty array for empty input', () => {
      const result = UserPersistenceAdapter.fromPrismaMany([]);

      expect(result).toEqual([]);
    });
  });

  describe('round-trip conversion', () => {
    it('should maintain data integrity through create conversion', () => {
      const prismaData = UserPersistenceAdapter.toPrismaCreate(mockUser);
      const convertedBack = UserPersistenceAdapter.fromPrisma({
        ...prismaData,
        id: mockUser.id, // Ensure id is defined
        createdAt: mockUser.createdAt, // Ensure createdAt is defined
        updatedAt: mockUser.updatedAt, // Ensure updatedAt is defined
      });

      expect(convertedBack.id).toBe(mockUser.id);
      expect(convertedBack.email).toBe(mockUser.email);
      expect(convertedBack.password).toBe(mockUser.password);
      expect(convertedBack.createdAt).toEqual(mockUser.createdAt);
      expect(convertedBack.updatedAt).toEqual(mockUser.updatedAt);
    });

    it('should maintain data integrity through update conversion', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _prismaUpdateData = UserPersistenceAdapter.toPrismaUpdate(mockUser);

      // Simulate update by creating new user with updated data
      const updatedUser = new User({
        ...mockUser,
        email: 'updated@example.com',
        updatedAt: new Date(),
      });

      const updatedPrismaData =
        UserPersistenceAdapter.toPrismaUpdate(updatedUser);

      expect(updatedPrismaData.email).toBe('updated@example.com');
      expect(updatedPrismaData.id).toBeUndefined();
    });
  });
});
