/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from '@/modules/users/application/services/profile.service';
import { Profile } from '@/modules/users/domain/entities/profile.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProfileController', () => {
  let controller: ProfileController;
  let mockProfileService: jest.Mocked<ProfileService>;

  const mockProfile = new Profile(
    'profile-1',
    'user-1',
    'Juan',
    'Pérez',
    'es',
    new Date('2024-01-01'),
    new Date('2024-01-01'),
    '+34 600 123 456',
    'Madrid',
    '28001',
  );

  const mockProfileResponse = {
    id: 'profile-1',
    userId: 'user-1',
    firstName: 'Juan',
    lastName: 'Pérez',
    phone: '+34 600 123 456',
    language: 'es',
    city: 'Madrid',
    postalCode: '28001',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    fullName: 'Juan Pérez',
    isComplete: true,
    completionPercentage: 100,
  };

  beforeEach(async () => {
    const mockService = {
      createProfile: jest.fn(),
      getProfileById: jest.fn(),
      getProfileByUserId: jest.fn(),
      getAllProfiles: jest.fn(),
      updateProfile: jest.fn(),
      updateProfileByUserId: jest.fn(),
      deleteProfile: jest.fn(),
      deleteProfileByUserId: jest.fn(),
      profileExists: jest.fn(),
      getProfileStats: jest.fn(),
      getProfilesByCity: jest.fn(),
      getProfilesByLanguage: jest.fn(),
      getCompleteProfiles: jest.fn(),
      getProfileCompletionPercentage: jest.fn(),
      getProfileFullName: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    mockProfileService = module.get(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProfile', () => {
    const createProfileDto = {
      userId: 'user-1',
      firstName: 'Juan',
      lastName: 'Pérez',
      language: 'es',
      phone: '+34 600 123 456',
      city: 'Madrid',
      postalCode: '28001',
    };

    it('should create a profile successfully', async () => {
      mockProfileService.createProfile.mockResolvedValue(mockProfile);

      const result = await controller.createProfile(createProfileDto);

      expect(mockProfileService.createProfile).toHaveBeenCalledWith(
        createProfileDto,
      );
      expect(result).toEqual(mockProfileResponse);
    });

    it('should handle service exceptions', async () => {
      mockProfileService.createProfile.mockRejectedValue(
        new ConflictException('Profile already exists'),
      );

      await expect(controller.createProfile(createProfileDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getProfileById', () => {
    it('should return profile when found', async () => {
      mockProfileService.getProfileById.mockResolvedValue(mockProfile);

      const result = await controller.getProfileById('profile-1');

      expect(mockProfileService.getProfileById).toHaveBeenCalledWith(
        'profile-1',
      );
      expect(result).toEqual(mockProfileResponse);
    });

    it('should handle not found exception', async () => {
      mockProfileService.getProfileById.mockRejectedValue(
        new NotFoundException('Profile not found'),
      );

      await expect(controller.getProfileById('profile-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getProfileByUserId', () => {
    it('should return profile when found', async () => {
      mockProfileService.getProfileByUserId.mockResolvedValue(mockProfile);

      const result = await controller.getProfileByUserId('user-1');

      expect(mockProfileService.getProfileByUserId).toHaveBeenCalledWith(
        'user-1',
      );
      expect(result).toEqual(mockProfileResponse);
    });
  });

  describe('getAllProfiles', () => {
    const mockResult = {
      profiles: [mockProfile],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    it('should return profiles with pagination', async () => {
      mockProfileService.getAllProfiles.mockResolvedValue(mockResult);

      const result = await controller.getAllProfiles(
        { page: 1, limit: 10 },
        { city: 'Madrid' },
      );

      expect(mockProfileService.getAllProfiles).toHaveBeenCalledWith(
        { page: 1, limit: 10 },
        { city: 'Madrid' },
      );
      expect(result).toEqual({
        profiles: [mockProfileResponse],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
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
        new Date('2024-01-01'),
        new Date('2024-01-02'),
        '+34 600 123 456',
        'Barcelona',
        '28001',
      );

      mockProfileService.updateProfile.mockResolvedValue(updatedProfile);

      const result = await controller.updateProfile(
        'profile-1',
        updateProfileDto,
      );

      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(
        'profile-1',
        updateProfileDto,
      );
      expect(result).toEqual({
        id: 'profile-1',
        userId: 'user-1',
        firstName: 'Juan Carlos',
        lastName: 'Pérez',
        phone: '+34 600 123 456',
        language: 'es',
        city: 'Barcelona',
        postalCode: '28001',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        fullName: 'Juan Carlos Pérez',
        isComplete: true,
        completionPercentage: 100,
      });
    });
  });

  describe('updateProfileByUserId', () => {
    const updateProfileDto = { firstName: 'Juan Carlos' };

    it('should update profile by user ID successfully', async () => {
      mockProfileService.updateProfileByUserId.mockResolvedValue(mockProfile);

      const result = await controller.updateProfileByUserId(
        'user-1',
        updateProfileDto,
      );

      expect(mockProfileService.updateProfileByUserId).toHaveBeenCalledWith(
        'user-1',
        updateProfileDto,
      );
      expect(result).toEqual(mockProfileResponse);
    });
  });

  describe('deleteProfile', () => {
    it('should delete profile successfully', async () => {
      mockProfileService.deleteProfile.mockResolvedValue();

      await controller.deleteProfile('profile-1');

      expect(mockProfileService.deleteProfile).toHaveBeenCalledWith(
        'profile-1',
      );
    });
  });

  describe('deleteProfileByUserId', () => {
    it('should delete profile by user ID successfully', async () => {
      mockProfileService.deleteProfileByUserId.mockResolvedValue();

      await controller.deleteProfileByUserId('user-1');

      expect(mockProfileService.deleteProfileByUserId).toHaveBeenCalledWith(
        'user-1',
      );
    });
  });

  describe('getProfileStats', () => {
    it('should return profile statistics', async () => {
      const stats = {
        total: 10,
        complete: 7,
        incomplete: 3,
        completionRate: 70,
      };

      mockProfileService.getProfileStats.mockResolvedValue(stats);

      const result = await controller.getProfileStats();

      expect(mockProfileService.getProfileStats).toHaveBeenCalled();
      expect(result).toEqual(stats);
    });
  });

  describe('getProfilesByCity', () => {
    it('should return profiles by city', async () => {
      const profiles = [mockProfile];
      mockProfileService.getProfilesByCity.mockResolvedValue(profiles);

      const result = await controller.getProfilesByCity('Madrid');

      expect(mockProfileService.getProfilesByCity).toHaveBeenCalledWith(
        'Madrid',
      );
      expect(result).toEqual([mockProfileResponse]);
    });
  });

  describe('getProfilesByLanguage', () => {
    it('should return profiles by language', async () => {
      const profiles = [mockProfile];
      mockProfileService.getProfilesByLanguage.mockResolvedValue(profiles);

      const result = await controller.getProfilesByLanguage('es');

      expect(mockProfileService.getProfilesByLanguage).toHaveBeenCalledWith(
        'es',
      );
      expect(result).toEqual([mockProfileResponse]);
    });
  });

  describe('getCompleteProfiles', () => {
    it('should return complete profiles', async () => {
      const profiles = [mockProfile];
      mockProfileService.getCompleteProfiles.mockResolvedValue(profiles);

      const result = await controller.getCompleteProfiles();

      expect(mockProfileService.getCompleteProfiles).toHaveBeenCalled();
      expect(result).toEqual([mockProfileResponse]);
    });
  });

  describe('getProfileCompletionPercentage', () => {
    it('should return completion percentage', async () => {
      mockProfileService.getProfileCompletionPercentage.mockResolvedValue(80);

      const result =
        await controller.getProfileCompletionPercentage('profile-1');

      expect(
        mockProfileService.getProfileCompletionPercentage,
      ).toHaveBeenCalledWith('profile-1');
      expect(result).toEqual({ completionPercentage: 80 });
    });
  });

  describe('getProfileFullName', () => {
    it('should return full name', async () => {
      mockProfileService.getProfileFullName.mockResolvedValue('Juan Pérez');

      const result = await controller.getProfileFullName('profile-1');

      expect(mockProfileService.getProfileFullName).toHaveBeenCalledWith(
        'profile-1',
      );
      expect(result).toEqual({ fullName: 'Juan Pérez' });
    });
  });

  describe('profileExists', () => {
    it('should return existence status', async () => {
      mockProfileService.profileExists.mockResolvedValue(true);

      const result = await controller.profileExists('user-1');

      expect(mockProfileService.profileExists).toHaveBeenCalledWith('user-1');
      expect(result).toEqual({ exists: true });
    });
  });

  describe('mapToResponseDto', () => {
    it('should map profile entity to response DTO correctly', () => {
      const result = (controller as any).mapToResponseDto(mockProfile);

      expect(result).toEqual(mockProfileResponse);
    });
  });
});
