/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { ProfileRepository } from './profile.repository';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { Profile } from '@/modules/users/domain/entities/profile.entity';

describe('ProfileRepository', () => {
  let repository: ProfileRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPrismaService = {
    profile: {
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
        ProfileRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<ProfileRepository>(ProfileRepository);
    prismaService = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new profile successfully', async () => {
      const profileData = {
        id: 'test-profile-id',
        userId: 'test-user-id',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        language: 'es',
        city: 'Madrid',
        postalCode: '28001',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-02T15:30:00Z'),
      };

      const profileEntity = new Profile(
        profileData.id,
        profileData.userId,
        profileData.firstName,
        profileData.lastName,
        undefined, // lastName2
        profileData.language,
        profileData.createdAt,
        profileData.updatedAt,
        profileData.phone,
        profileData.city,
        profileData.postalCode,
      );

      mockPrismaService.profile.create.mockResolvedValue(profileData);

      const result = await repository.create(profileEntity);

      expect(prismaService.profile.create).toHaveBeenCalledWith({
        data: {
          id: profileEntity.id,
          userId: profileEntity.userId,
          firstName: profileEntity.firstName,
          lastName1: profileEntity.lastName1,
          lastName2: profileEntity.lastName2,
          phone: profileEntity.phone,
          language: profileEntity.language,
          city: profileEntity.city,
          postalCode: profileEntity.postalCode,
          createdAt: profileEntity.createdAt,
          updatedAt: profileEntity.updatedAt,
        },
      });
      expect(result).toBeInstanceOf(Profile);
      expect(result.id).toBe(profileEntity.id);
      expect(result.firstName).toBe(profileEntity.firstName);
    });
  });

  describe('findById', () => {
    it('should find profile by id', async () => {
      const profileData = {
        id: 'test-profile-id',
        userId: 'test-user-id',
        firstName: 'John',
        lastName1: 'Doe',
        lastName2: undefined,
        phone: '+1234567890',
        language: 'es',
        city: 'Madrid',
        postalCode: '28001',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-02T15:30:00Z'),
      };

      const profileEntity = new Profile(
        profileData.id,
        profileData.userId,
        profileData.firstName,
        profileData.lastName1,
        profileData.lastName2,
        profileData.language,
        profileData.createdAt,
        profileData.updatedAt,
        profileData.phone,
        profileData.city,
        profileData.postalCode,
      );

      mockPrismaService.profile.findUnique.mockResolvedValue(profileData);

      const result = await repository.findById('test-profile-id');

      expect(prismaService.profile.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-profile-id' },
      });
      expect(result).toBeInstanceOf(Profile);
      expect(result?.id).toBe(profileEntity.id);
    });

    it('should return null when profile not found', async () => {
      mockPrismaService.profile.findUnique.mockResolvedValue(null);

      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });
});
