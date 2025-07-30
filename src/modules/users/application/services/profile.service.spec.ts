/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import {
  IProfileRepository,
  PROFILE_REPOSITORY,
} from '@/modules/users/domain/repositories/profile.repository.interface';
import { Profile } from '@/modules/users/domain/entities/profile.entity';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

describe('ProfileService', () => {
  let service: ProfileService;
  let mockProfileRepository: jest.Mocked<IProfileRepository>;

  const mockProfile = new Profile(
    'profile-1',
    'user-1',
    'Juan',
    'Pérez',
    'es',
    '2024-01-01',
    '2024-01-01',
    '+34 600 123 456',
    'Madrid',
    '28001',
  );

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByUserId: jest.fn(),
      count: jest.fn(),
      findByCity: jest.fn(),
      findByLanguage: jest.fn(),
      findCompleteProfiles: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PROFILE_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    mockProfileRepository = module.get(PROFILE_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProfile', () => {
    const createProfileDto = {
      userId: 'user-1',
      firstName: 'Juan',
      lastName1: 'Pérez',
      lastName2: 'García',
      language: 'es',
      phone: '+34 600 123 456',
      city: 'Madrid',
      postalCode: '28001',
    };

    it('should create a new profile successfully', async () => {
      mockProfileRepository.findByUserId.mockResolvedValue(null);
      mockProfileRepository.create.mockResolvedValue(mockProfile);

      const result = await service.createProfile(createProfileDto);

      expect(mockProfileRepository.findByUserId).toHaveBeenCalledWith('user-1');
      expect(mockProfileRepository.create).toHaveBeenCalled();
      expect(result).toBe(mockProfile);
    });

    it('should throw ConflictException if profile already exists for user', async () => {
      mockProfileRepository.findByUserId.mockResolvedValue(mockProfile);

      await expect(service.createProfile(createProfileDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockProfileRepository.findByUserId).toHaveBeenCalledWith('user-1');
      expect(mockProfileRepository.create).not.toHaveBeenCalled();
    });

    it('should use default language if not provided', async () => {
      const dtoWithoutLanguage = { ...createProfileDto };
      delete (dtoWithoutLanguage as Record<string, unknown>).language;

      mockProfileRepository.findByUserId.mockResolvedValue(null);
      mockProfileRepository.create.mockResolvedValue(mockProfile);

      await service.createProfile(dtoWithoutLanguage);

      expect(mockProfileRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          language: 'es',
        }),
      );
    });
  });

  describe('getProfileById', () => {
    it('should return profile when found', async () => {
      mockProfileRepository.findById.mockResolvedValue(mockProfile);

      const result = await service.getProfileById('profile-1');

      expect(mockProfileRepository.findById).toHaveBeenCalledWith('profile-1');
      expect(result).toBe(mockProfile);
    });

    it('should throw NotFoundException when profile not found', async () => {
      mockProfileRepository.findById.mockResolvedValue(null);

      await expect(service.getProfileById('profile-1')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockProfileRepository.findById).toHaveBeenCalledWith('profile-1');
    });
  });

  describe('getProfileByUserId', () => {
    it('should return profile when found', async () => {
      mockProfileRepository.findByUserId.mockResolvedValue(mockProfile);

      const result = await service.getProfileByUserId('user-1');

      expect(mockProfileRepository.findByUserId).toHaveBeenCalledWith('user-1');
      expect(result).toBe(mockProfile);
    });

    it('should throw NotFoundException when profile not found', async () => {
      mockProfileRepository.findByUserId.mockResolvedValue(null);

      await expect(service.getProfileByUserId('user-1')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockProfileRepository.findByUserId).toHaveBeenCalledWith('user-1');
    });
  });

  describe('getAllProfiles', () => {
    const mockProfiles = [mockProfile];
    const mockResult = {
      profiles: mockProfiles,
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    it('should return profiles with default pagination', async () => {
      mockProfileRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.getAllProfiles();

      expect(mockProfileRepository.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(mockResult);
    });

    it('should return profiles with custom pagination', async () => {
      mockProfileRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.getAllProfiles({ page: 2, limit: 5 });

      expect(mockProfileRepository.findAll).toHaveBeenCalledWith(2, 5);
      expect(result).toEqual(mockResult);
    });

    it('should throw BadRequestException for invalid page', async () => {
      await expect(
        service.getAllProfiles({ page: 0, limit: 10 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid limit', async () => {
      await expect(
        service.getAllProfiles({ page: 1, limit: 0 }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        service.getAllProfiles({ page: 1, limit: 101 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should apply filters correctly', async () => {
      mockProfileRepository.findAll.mockResolvedValue(mockResult);

      const filters = { city: 'Madrid', language: 'es', isComplete: true };
      await service.getAllProfiles({ page: 1, limit: 10 }, filters);

      expect(mockProfileRepository.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('updateProfile', () => {
    const updateProfileDto = {
      firstName: 'Juan Carlos',
      city: 'Barcelona',
    };

    it('should update profile successfully', async () => {
      const updatedProfile = new Profile(
        'profile-1',
        'user-1',
        'Juan Carlos',
        'Pérez',
        'es',
        '2024-01-01',
        '2024-01-02',
        '+34 600 123 456',
        'Barcelona',
        '28001',
      );

      mockProfileRepository.findById.mockResolvedValue(mockProfile);
      mockProfileRepository.update.mockResolvedValue(updatedProfile);

      const result = await service.updateProfile('profile-1', updateProfileDto);

      expect(mockProfileRepository.findById).toHaveBeenCalledWith('profile-1');
      expect(mockProfileRepository.update).toHaveBeenCalledWith(
        'profile-1',
        expect.objectContaining({
          id: 'profile-1',
          firstName: 'Juan Carlos',
          lastName1: 'Pérez',
        }),
      );
      expect(result).toBe(updatedProfile);
    });

    it('should throw NotFoundException when profile not found', async () => {
      mockProfileRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateProfile('profile-1', updateProfileDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update only provided fields', async () => {
      mockProfileRepository.findById.mockResolvedValue(mockProfile);
      mockProfileRepository.update.mockResolvedValue(mockProfile);

      await service.updateProfile('profile-1', { firstName: 'Juan Carlos' });

      expect(mockProfileRepository.update).toHaveBeenCalledWith(
        'profile-1',
        expect.objectContaining({
          id: 'profile-1',
          firstName: 'Juan Carlos',
        }),
      );
    });
  });

  describe('updateProfileByUserId', () => {
    const updateProfileDto = { firstName: 'Juan Carlos' };

    it('should update profile by user ID successfully', async () => {
      mockProfileRepository.findByUserId.mockResolvedValue(mockProfile);
      mockProfileRepository.findById.mockResolvedValue(mockProfile);
      mockProfileRepository.update.mockResolvedValue(mockProfile);

      const result = await service.updateProfileByUserId(
        'user-1',
        updateProfileDto,
      );

      expect(mockProfileRepository.findByUserId).toHaveBeenCalledWith('user-1');
      expect(mockProfileRepository.update).toHaveBeenCalledWith(
        'profile-1',
        expect.objectContaining({
          id: 'profile-1',
        }),
      );
      expect(result).toBe(mockProfile);
    });

    it('should throw NotFoundException when profile not found', async () => {
      mockProfileRepository.findByUserId.mockResolvedValue(null);

      await expect(
        service.updateProfileByUserId('user-1', updateProfileDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteProfile', () => {
    it('should delete profile successfully', async () => {
      mockProfileRepository.findById.mockResolvedValue(mockProfile);
      mockProfileRepository.delete.mockResolvedValue();

      await service.deleteProfile('profile-1');

      expect(mockProfileRepository.findById).toHaveBeenCalledWith('profile-1');
      expect(mockProfileRepository.delete).toHaveBeenCalledWith('profile-1');
    });

    it('should throw NotFoundException when profile not found', async () => {
      mockProfileRepository.findById.mockResolvedValue(null);

      await expect(service.deleteProfile('profile-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteProfileByUserId', () => {
    it('should delete profile by user ID successfully', async () => {
      mockProfileRepository.findByUserId.mockResolvedValue(mockProfile);
      mockProfileRepository.delete.mockResolvedValue();

      await service.deleteProfileByUserId('user-1');

      expect(mockProfileRepository.findByUserId).toHaveBeenCalledWith('user-1');
      expect(mockProfileRepository.delete).toHaveBeenCalledWith('profile-1');
    });

    it('should throw NotFoundException when profile not found', async () => {
      mockProfileRepository.findByUserId.mockResolvedValue(null);

      await expect(service.deleteProfileByUserId('user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('profileExists', () => {
    it('should return true when profile exists', async () => {
      mockProfileRepository.existsByUserId.mockResolvedValue(true);

      const result = await service.profileExists('user-1');

      expect(mockProfileRepository.existsByUserId).toHaveBeenCalledWith(
        'user-1',
      );
      expect(result).toBe(true);
    });

    it('should return false when profile does not exist', async () => {
      mockProfileRepository.existsByUserId.mockResolvedValue(false);

      const result = await service.profileExists('user-1');

      expect(mockProfileRepository.existsByUserId).toHaveBeenCalledWith(
        'user-1',
      );
      expect(result).toBe(false);
    });
  });

  describe('getProfileStats', () => {
    it('should return correct statistics', async () => {
      const completeProfiles = [mockProfile];
      mockProfileRepository.count.mockResolvedValue(10);
      mockProfileRepository.findCompleteProfiles.mockResolvedValue(
        completeProfiles,
      );

      const result = await service.getProfileStats();

      expect(mockProfileRepository.count).toHaveBeenCalled();
      expect(mockProfileRepository.findCompleteProfiles).toHaveBeenCalled();
      expect(result).toEqual({
        total: 10,
        complete: 1,
        incomplete: 9,
        completionRate: 10,
      });
    });

    it('should handle zero profiles correctly', async () => {
      mockProfileRepository.count.mockResolvedValue(0);
      mockProfileRepository.findCompleteProfiles.mockResolvedValue([]);

      const result = await service.getProfileStats();

      expect(result).toEqual({
        total: 0,
        complete: 0,
        incomplete: 0,
        completionRate: 0,
      });
    });
  });

  describe('getProfilesByCity', () => {
    it('should return profiles by city', async () => {
      const profiles = [mockProfile];
      mockProfileRepository.findByCity.mockResolvedValue(profiles);

      const result = await service.getProfilesByCity('Madrid');

      expect(mockProfileRepository.findByCity).toHaveBeenCalledWith('Madrid');
      expect(result).toBe(profiles);
    });
  });

  describe('getProfilesByLanguage', () => {
    it('should return profiles by language', async () => {
      const profiles = [mockProfile];
      mockProfileRepository.findByLanguage.mockResolvedValue(profiles);

      const result = await service.getProfilesByLanguage('es');

      expect(mockProfileRepository.findByLanguage).toHaveBeenCalledWith('es');
      expect(result).toBe(profiles);
    });
  });

  describe('getCompleteProfiles', () => {
    it('should return complete profiles', async () => {
      const profiles = [mockProfile];
      mockProfileRepository.findCompleteProfiles.mockResolvedValue(profiles);

      const result = await service.getCompleteProfiles();

      expect(mockProfileRepository.findCompleteProfiles).toHaveBeenCalled();
      expect(result).toBe(profiles);
    });
  });

  describe('getProfileCompletionPercentage', () => {
    it('should return completion percentage', async () => {
      mockProfileRepository.findById.mockResolvedValue(mockProfile);

      const result = await service.getProfileCompletionPercentage('profile-1');

      expect(mockProfileRepository.findById).toHaveBeenCalledWith('profile-1');
      expect(result).toBe(mockProfile.getCompletionPercentage());
    });
  });

  describe('getProfileFullName', () => {
    it('should return full name', async () => {
      mockProfileRepository.findById.mockResolvedValue(mockProfile);

      const result = await service.getProfileFullName('profile-1');

      expect(mockProfileRepository.findById).toHaveBeenCalledWith('profile-1');
      expect(result).toBe(mockProfile.getFullName());
    });
  });
});
