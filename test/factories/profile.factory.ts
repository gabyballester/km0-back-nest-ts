import { Profile } from '@/modules/users/domain/entities/profile.entity';
import { CreateProfileDto } from '@/modules/users/application/dto/create-profile.dto';
import { UpdateProfileDto } from '@/modules/users/application/dto/update-profile.dto';
import { ProfileResponseDto } from '@/modules/users/application/dto/profile-response.dto';

export class ProfileFactory {
  static createProfile(
    overrides: Partial<{
      id: string;
      userId: string;
      firstName: string;
      lastName: string;
      phone?: string;
      language: string;
      city?: string;
      postalCode?: string;
      createdAt: Date;
      updatedAt: Date;
    }> = {},
  ): Profile {
    const defaults = {
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

    const data = { ...defaults, ...overrides };

    return new Profile(
      data.id,
      data.userId,
      data.firstName,
      data.lastName,
      data.language,
      data.createdAt,
      data.updatedAt,
      data.phone,
      data.city,
      data.postalCode,
    );
  }

  static createCreateProfileDto(
    overrides: Partial<CreateProfileDto> = {},
  ): CreateProfileDto {
    return {
      userId: 'new-user-id',
      firstName: 'New',
      lastName1: 'Profile',
      lastName2: 'Factory',
      phone: '+1234567890',
      language: 'es',
      city: 'Madrid',
      postalCode: '28001',
      ...overrides,
    };
  }

  static createUpdateProfileDto(
    overrides: Partial<UpdateProfileDto> = {},
  ): UpdateProfileDto {
    return {
      firstName: 'Updated',
      lastName1: 'Profile',
      lastName2: 'Factory',
      phone: '+0987654321',
      language: 'en',
      city: 'Barcelona',
      postalCode: '08001',
      ...overrides,
    };
  }

  static createProfileResponseDto(
    overrides: Partial<ProfileResponseDto> = {},
  ): ProfileResponseDto {
    return {
      id: 'profile-response-id',
      userId: 'user-id',
      firstName: 'Response',
      lastName1: 'Profile',
      lastName2: 'Factory',
      fullName: 'Response Profile Factory',
      phone: '+1234567890',
      language: 'es',
      city: 'Madrid',
      postalCode: '28001',
      completionPercentage: 100,
      isComplete: true,
      createdAt: new Date('2024-01-01T10:00:00Z'),
      updatedAt: new Date('2024-01-02T15:30:00Z'),
      ...overrides,
    };
  }

  static createProfileWithMinimalData(): Profile {
    return this.createProfile({
      firstName: 'Minimal',
      lastName: 'Profile',
      phone: undefined,
      language: 'es',
      city: undefined,
      postalCode: undefined,
    });
  }

  static createProfileWithCompleteData(): Profile {
    return this.createProfile({
      firstName: 'Complete',
      lastName: 'Profile',
      phone: '+1234567890',
      language: 'en',
      city: 'Barcelona',
      postalCode: '08001',
    });
  }

  static createProfileWithSpecialCharacters(): Profile {
    return this.createProfile({
      firstName: 'José María',
      lastName: "O'Connor",
      phone: '+34 612 345 678',
      city: 'San Sebastián',
      postalCode: '20001',
    });
  }

  static createProfileWithLongData(): Profile {
    return this.createProfile({
      firstName: 'A'.repeat(50),
      lastName: 'B'.repeat(50),
      phone: '+12345678901234567890',
      city: 'C'.repeat(100),
      postalCode: '1234567890',
    });
  }

  static createMultipleProfiles(count: number): Profile[] {
    return Array.from({ length: count }, (_, index) =>
      this.createProfile({
        id: `profile_${index + 1}_${Date.now()}`,
        userId: `user_${index + 1}_${Date.now()}`,
        firstName: `User${index + 1}`,
        lastName: `Profile${index + 1}`,
      }),
    );
  }

  static createProfileForTesting(): Profile {
    return this.createProfile({
      id: 'test_profile_id',
      userId: 'test_user_id',
      firstName: 'Test',
      lastName: 'Profile',
      phone: '+1234567890',
      language: 'es',
      city: 'Test City',
      postalCode: '12345',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

export function createProfileFactory(
  overrides: Partial<{
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone?: string;
    language: string;
    city?: string;
    postalCode?: string;
    createdAt: Date;
    updatedAt: Date;
  }> = {},
): Profile {
  return ProfileFactory.createProfile(overrides);
}

export function createCreateProfileDtoFactory(
  overrides: Partial<CreateProfileDto> = {},
): CreateProfileDto {
  return ProfileFactory.createCreateProfileDto(overrides);
}

export function createUpdateProfileDtoFactory(
  overrides: Partial<UpdateProfileDto> = {},
): UpdateProfileDto {
  return ProfileFactory.createUpdateProfileDto(overrides);
}

export function createProfileResponseDtoFactory(
  overrides: Partial<ProfileResponseDto> = {},
): ProfileResponseDto {
  return ProfileFactory.createProfileResponseDto(overrides);
}
