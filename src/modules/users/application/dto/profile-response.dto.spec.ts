import { plainToClass } from 'class-transformer';
import { ProfileResponseDto } from './profile-response.dto';

describe('ProfileResponseDto', () => {
  const mockProfileData = {
    id: 'profile-1',
    userId: 'user-1',
    firstName: 'Juan',
    lastName1: 'Pérez',
    lastName2: 'García',
    phone: '+34 600 123 456',
    language: 'es',
    city: 'Madrid',
    postalCode: '28001',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  it('should transform profile data correctly', () => {
    const profileDto = plainToClass(ProfileResponseDto, mockProfileData);

    expect(profileDto.id).toBe('profile-1');
    expect(profileDto.userId).toBe('user-1');
    expect(profileDto.firstName).toBe('Juan');
    expect(profileDto.lastName1).toBe('Pérez');
    expect(profileDto.phone).toBe('+34 600 123 456');
    expect(profileDto.language).toBe('es');
    expect(profileDto.city).toBe('Madrid');
    expect(profileDto.postalCode).toBe('28001');
    expect(profileDto.createdAt).toEqual(new Date('2024-01-01T00:00:00.000Z'));
    expect(profileDto.updatedAt).toEqual(new Date('2024-01-01T00:00:00.000Z'));
    expect(profileDto.fullName).toBe('Juan Pérez García');
    expect(profileDto.completionPercentage).toBe(100);
    expect(profileDto.isComplete).toBe(true);
  });

  it('should handle missing optional fields', () => {
    const incompleteData = {
      ...mockProfileData,
      lastName2: undefined,
      phone: undefined,
      city: undefined,
      postalCode: undefined,
    };

    const profileDto = plainToClass(ProfileResponseDto, incompleteData);

    expect(profileDto.phone).toBeUndefined();
    expect(profileDto.city).toBeUndefined();
    expect(profileDto.postalCode).toBeUndefined();
    expect(profileDto.fullName).toBe('Juan Pérez');
    expect(profileDto.completionPercentage).toBe(33); // 2 out of 6 fields
    expect(profileDto.isComplete).toBe(false);
  });

  it('should handle null values from database', () => {
    const nullData = {
      ...mockProfileData,
      lastName2: null,
      phone: null,
      city: null,
      postalCode: null,
    };

    const profileDto = plainToClass(ProfileResponseDto, nullData);

    expect(profileDto.phone).toBeNull();
    expect(profileDto.city).toBeNull();
    expect(profileDto.postalCode).toBeNull();
    expect(profileDto.completionPercentage).toBe(33);
    expect(profileDto.isComplete).toBe(false);
  });

  it('should calculate completion percentage correctly', () => {
    const partialData = {
      ...mockProfileData,
      lastName2: undefined,
      phone: '123456789',
      city: undefined,
      postalCode: undefined,
    };

    const profileDto = plainToClass(ProfileResponseDto, partialData);

    expect(profileDto.completionPercentage).toBe(50); // 3 out of 6 fields
  });

  it('should handle empty strings as incomplete', () => {
    const emptyData = {
      ...mockProfileData,
      lastName2: '',
      phone: '',
      city: '',
      postalCode: '',
    };

    const profileDto = plainToClass(ProfileResponseDto, emptyData);

    expect(profileDto.completionPercentage).toBe(33); // 2 out of 6 fields
    expect(profileDto.isComplete).toBe(false);
  });
});
