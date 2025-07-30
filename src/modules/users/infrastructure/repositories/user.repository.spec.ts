/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { User } from '@/modules/users/domain/entities/user.entity';
import { createUserFactory } from '../../../../../test/factories/user.factory';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    prismaService = module.get(PrismaService);

    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const userData = createUserFactory();
      const userEntity = new User(userData);
      const prismaUser = {
        id: userEntity.id,
        email: userEntity.email,
        password: userEntity.password,
        createdAt: userEntity.createdAt,
        updatedAt: userEntity.updatedAt,
      };

      mockPrismaService.user.create.mockResolvedValue(prismaUser);

      // Act
      const result = await repository.create(userEntity);

      // Assert
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          id: userEntity.id,
          email: userEntity.email,
          password: userEntity.password,
          createdAt: userEntity.createdAt,
          updatedAt: userEntity.updatedAt,
        },
      });
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(userEntity.id);
      expect(result.email).toBe(userEntity.email);
    });

    it('should handle Prisma errors during user creation', async () => {
      // Arrange
      const userData = createUserFactory();
      const userEntity = new User(userData);
      const prismaError = new Error('Database connection failed');

      mockPrismaService.user.create.mockRejectedValue(prismaError);

      // Act & Assert
      await expect(repository.create(userEntity)).rejects.toThrow(
        'Database connection failed',
      );
      expect(prismaService.user.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should find a user by ID successfully', async () => {
      // Arrange
      const userId = 'user-123';
      const prismaUser = {
        id: userId,
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(prismaUser);

      // Act
      const result = await repository.findById(userId);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe(userId);
    });

    it('should return null when user is not found', async () => {
      // Arrange
      const userId = 'non-existent-user';
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findById(userId);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toBeNull();
    });

    it('should handle Prisma errors during findById', async () => {
      // Arrange
      const userId = 'user-123';
      const prismaError = new Error('Database error');

      mockPrismaService.user.findUnique.mockRejectedValue(prismaError);

      // Act & Assert
      await expect(repository.findById(userId)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email successfully', async () => {
      // Arrange
      const email = 'test@example.com';
      const prismaUser = {
        id: 'user-123',
        email,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(prismaUser);

      // Act
      const result = await repository.findByEmail(email);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeInstanceOf(User);
      expect(result?.email).toBe(email);
    });

    it('should return null when user is not found by email', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findByEmail(email);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should find all users with pagination successfully', async () => {
      // Arrange
      const page = 2;
      const limit = 5;
      const skip = (page - 1) * limit;
      const total = 15;

      const prismaUsers = [
        {
          id: 'user-1',
          email: 'user1@example.com',
          password: 'hashedPassword1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'user-2',
          email: 'user2@example.com',
          password: 'hashedPassword2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(prismaUsers);
      mockPrismaService.user.count.mockResolvedValue(total);

      // Act
      const result = await repository.findAll(page, limit);

      // Assert
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });
      expect(prismaService.user.count).toHaveBeenCalled();
      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(total);
      expect(result.page).toBe(page);
      expect(result.limit).toBe(limit);
      expect(result.totalPages).toBe(3); // Math.ceil(15 / 5)
      expect(result.users[0]).toBeInstanceOf(User);
    });

    it('should use default pagination values when not provided', async () => {
      // Arrange
      const prismaUsers = [
        {
          id: 'user-1',
          email: 'user1@example.com',
          password: 'hashedPassword1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(prismaUsers);
      mockPrismaService.user.count.mockResolvedValue(1);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    it('should handle empty results', async () => {
      // Arrange
      mockPrismaService.user.findMany.mockResolvedValue([]);
      mockPrismaService.user.count.mockResolvedValue(0);

      // Act
      const result = await repository.findAll(1, 10);

      // Assert
      expect(result.users).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      // Arrange
      const userId = 'user-123';
      const updateData = {
        email: 'updated@example.com',
        password: 'newHashedPassword',
      };

      const updatedPrismaUser = {
        id: userId,
        email: updateData.email,
        password: updateData.password,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.update.mockResolvedValue(updatedPrismaUser);

      // Act
      const result = await repository.update(userId, updateData);

      // Assert
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          email: updateData.email,
          password: updateData.password,
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toBeInstanceOf(User);
      expect(result.email).toBe(updateData.email);
    });

    it('should handle partial updates', async () => {
      // Arrange
      const userId = 'user-123';
      const updateData = {
        email: 'partial@example.com',
      };

      const updatedPrismaUser = {
        id: userId,
        email: updateData.email,
        password: 'existingPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.update.mockResolvedValue(updatedPrismaUser);

      // Act
      const result = await repository.update(userId, updateData);

      // Assert
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          email: updateData.email,
          password: undefined,
          updatedAt: expect.any(Date),
        },
      });
      expect(result.email).toBe(updateData.email);
    });

    it('should handle Prisma errors during update', async () => {
      // Arrange
      const userId = 'user-123';
      const updateData = { email: 'test@example.com' };
      const prismaError = new Error('Update failed');

      mockPrismaService.user.update.mockRejectedValue(prismaError);

      // Act & Assert
      await expect(repository.update(userId, updateData)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      // Arrange
      const userId = 'user-123';
      const existingUser = {
        id: userId,
        email: 'deleted@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.delete.mockResolvedValue(existingUser);

      // Act
      await repository.delete(userId);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should handle Prisma errors during delete', async () => {
      // Arrange
      const userId = 'user-123';
      const existingUser = {
        id: userId,
        email: 'deleted@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const prismaError = new Error('Delete failed');

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.delete.mockRejectedValue(prismaError);

      // Act & Assert
      await expect(repository.delete(userId)).rejects.toThrow('Delete failed');
    });
  });

  describe('existsByEmail', () => {
    it('should return true when user exists', async () => {
      // Arrange
      const email = 'existing@example.com';
      const prismaUser = {
        id: 'user-123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(prismaUser);

      // Act
      const result = await repository.existsByEmail(email);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
        select: { id: true },
      });
      expect(result).toBe(true);
    });

    it('should return false when user does not exist', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.existsByEmail(email);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
        select: { id: true },
      });
      expect(result).toBe(false);
    });
  });

  describe('count', () => {
    it('should return the total number of users', async () => {
      // Arrange
      const totalUsers = 42;
      mockPrismaService.user.count.mockResolvedValue(totalUsers);

      // Act
      const result = await repository.count();

      // Assert
      expect(prismaService.user.count).toHaveBeenCalled();
      expect(result).toBe(totalUsers);
    });

    it('should return 0 when no users exist', async () => {
      // Arrange
      mockPrismaService.user.count.mockResolvedValue(0);

      // Act
      const result = await repository.count();

      // Assert
      expect(result).toBe(0);
    });
  });

  describe('findByFilters', () => {
    it('should find users by email filter', async () => {
      // Arrange
      const filters = { email: 'test@example.com' };
      const prismaUsers = [
        {
          id: 'user-123',
          email: 'test@example.com',
          password: 'hashedPassword',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(prismaUsers);

      // Act
      const result = await repository.findByFilters(filters);

      // Assert
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        where: {
          email: {
            contains: filters.email,
            mode: 'insensitive',
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(User);
      expect(result[0].email).toBe(filters.email);
    });

    it('should find users by createdAt filter', async () => {
      // Arrange
      const createdAt = new Date('2024-01-01');
      const filters = { createdAt };
      const prismaUsers = [
        {
          id: 'user-123',
          email: 'test@example.com',
          password: 'hashedPassword',
          createdAt,
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(prismaUsers);

      // Act
      const result = await repository.findByFilters(filters);

      // Assert
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            gte: filters.createdAt,
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
    });

    it('should find users with multiple filters', async () => {
      // Arrange
      const filters = {
        email: 'test@example.com',
        createdAt: new Date('2024-01-01'),
      };
      const prismaUsers = [
        {
          id: 'user-123',
          email: 'test@example.com',
          password: 'hashedPassword',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(prismaUsers);

      // Act
      const result = await repository.findByFilters(filters);

      // Assert
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        where: {
          email: {
            contains: filters.email,
            mode: 'insensitive',
          },
          createdAt: {
            gte: filters.createdAt,
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no users match filters', async () => {
      // Arrange
      const filters = { email: 'nonexistent@example.com' };
      mockPrismaService.user.findMany.mockResolvedValue([]);

      // Act
      const result = await repository.findByFilters(filters);

      // Assert
      expect(result).toHaveLength(0);
    });

    it('should handle empty filters', async () => {
      // Arrange
      const filters = {};
      const prismaUsers = [
        {
          id: 'user-123',
          email: 'test@example.com',
          password: 'hashedPassword',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(prismaUsers);

      // Act
      const result = await repository.findByFilters(filters);

      // Assert
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
    });
  });
});
