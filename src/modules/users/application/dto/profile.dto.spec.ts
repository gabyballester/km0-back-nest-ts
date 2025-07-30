import { validate } from 'class-validator';
import {
  CreateProfileDto,
  UpdateProfileDto,
  ProfileFiltersDto,
  ProfilePaginationDto,
  ProfileResponseDto,
  ProfileListResponseDto,
  ProfileStatsResponseDto,
} from './profile.dto';

describe('Profile DTOs', () => {
  describe('CreateProfileDto', () => {
    it('should validate a valid create profile dto', async () => {
      const dto = new CreateProfileDto();
      dto.userId = 'user-1';
      dto.firstName = 'Juan';
      dto.lastName = 'Pérez';
      dto.language = 'es';
      dto.phone = '+34 600 123 456';
      dto.city = 'Madrid';
      dto.postalCode = '28001';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with minimal required fields', async () => {
      const dto = new CreateProfileDto();
      dto.userId = 'user-1';
      dto.firstName = 'Juan';
      dto.lastName = 'Pérez';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with missing required fields', async () => {
      const dto = new CreateProfileDto();
      dto.firstName = 'Juan';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'userId')).toBe(true);
      expect(errors.some(e => e.property === 'lastName')).toBe(true);
    });

    it('should validate language enum values', async () => {
      const dto = new CreateProfileDto();
      dto.userId = 'user-1';
      dto.firstName = 'Juan';
      dto.lastName = 'Pérez';
      dto.language = 'en';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid language', async () => {
      const dto = new CreateProfileDto();
      dto.userId = 'user-1';
      dto.firstName = 'Juan';
      dto.lastName = 'Pérez';
      dto.language = 'invalid';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'language')).toBe(true);
    });

    it('should validate field length constraints', async () => {
      const dto = new CreateProfileDto();
      dto.userId = 'user-1';
      dto.firstName = 'A'.repeat(51); // Too long
      dto.lastName = 'Pérez';
      dto.phone = 'A'.repeat(21); // Too long
      dto.city = 'A'.repeat(101); // Too long
      dto.postalCode = 'A'.repeat(11); // Too long

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'firstName')).toBe(true);
      expect(errors.some(e => e.property === 'phone')).toBe(true);
      expect(errors.some(e => e.property === 'city')).toBe(true);
      expect(errors.some(e => e.property === 'postalCode')).toBe(true);
    });
  });

  describe('UpdateProfileDto', () => {
    it('should validate a valid update profile dto', async () => {
      const dto = new UpdateProfileDto();
      dto.firstName = 'Juan Carlos';
      dto.language = 'en';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with empty dto (all optional)', async () => {
      const dto = new UpdateProfileDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate language enum values', async () => {
      const dto = new UpdateProfileDto();
      dto.language = 'fr';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid language', async () => {
      const dto = new UpdateProfileDto();
      dto.language = 'invalid';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'language')).toBe(true);
    });
  });

  describe('ProfileFiltersDto', () => {
    it('should validate a valid filters dto', async () => {
      const dto = new ProfileFiltersDto();
      dto.city = 'Madrid';
      dto.language = 'es';
      dto.isComplete = true;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with empty dto (all optional)', async () => {
      const dto = new ProfileFiltersDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate language enum values', async () => {
      const dto = new ProfileFiltersDto();
      dto.language = 'de';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid language', async () => {
      const dto = new ProfileFiltersDto();
      dto.language = 'invalid';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'language')).toBe(true);
    });
  });

  describe('ProfilePaginationDto', () => {
    it('should validate a valid pagination dto', async () => {
      const dto = new ProfilePaginationDto();
      dto.page = 1;
      dto.limit = 10;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with empty dto (uses defaults)', async () => {
      const dto = new ProfilePaginationDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid page', async () => {
      const dto = new ProfilePaginationDto();
      dto.page = 0; // Must be >= 1

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'page')).toBe(true);
    });

    it('should fail validation with invalid limit', async () => {
      const dto = new ProfilePaginationDto();
      dto.limit = 0; // Must be >= 1

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'limit')).toBe(true);
    });

    it('should fail validation with limit too high', async () => {
      const dto = new ProfilePaginationDto();
      dto.limit = 101; // Must be <= 100

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'limit')).toBe(true);
    });

    it('should fail validation with negative page', async () => {
      const dto = new ProfilePaginationDto();
      dto.page = -1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'page')).toBe(true);
    });

    it('should fail validation with negative limit', async () => {
      const dto = new ProfilePaginationDto();
      dto.limit = -1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'limit')).toBe(true);
    });

    it('should validate boundary values', async () => {
      const dto = new ProfilePaginationDto();
      dto.page = 1;
      dto.limit = 100;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('ProfileResponseDto', () => {
    it('should create a valid response DTO', () => {
      const dto = new ProfileResponseDto();
      dto.id = 'clx1234567890abcdef';
      dto.userId = 'clx1234567890abcdef';
      dto.firstName = 'Juan';
      dto.lastName = 'Pérez';
      dto.phone = '+34 600 123 456';
      dto.language = 'es';
      dto.city = 'Madrid';
      dto.postalCode = '28001';
      dto.createdAt = new Date();
      dto.updatedAt = new Date();
      dto.fullName = 'Juan Pérez';
      dto.isComplete = true;
      dto.completionPercentage = 80;

      expect(dto.id).toBe('clx1234567890abcdef');
      expect(dto.fullName).toBe('Juan Pérez');
      expect(dto.isComplete).toBe(true);
      expect(dto.completionPercentage).toBe(80);
    });

    it('should handle optional fields', () => {
      const dto = new ProfileResponseDto();
      dto.id = 'clx1234567890abcdef';
      dto.userId = 'clx1234567890abcdef';
      dto.firstName = 'Juan';
      dto.lastName = 'Pérez';
      dto.language = 'es';
      dto.createdAt = new Date();
      dto.updatedAt = new Date();
      dto.fullName = 'Juan Pérez';
      dto.isComplete = false;
      dto.completionPercentage = 50;

      expect(dto.phone).toBeUndefined();
      expect(dto.city).toBeUndefined();
      expect(dto.postalCode).toBeUndefined();
      expect(dto.isComplete).toBe(false);
    });
  });

  describe('ProfileListResponseDto', () => {
    it('should create a valid list response DTO', () => {
      const dto = new ProfileListResponseDto();
      dto.profiles = [];
      dto.total = 100;
      dto.page = 1;
      dto.limit = 10;
      dto.totalPages = 10;

      expect(dto.total).toBe(100);
      expect(dto.totalPages).toBe(10);
      expect(dto.profiles).toEqual([]);
    });

    it('should handle profiles array', () => {
      const dto = new ProfileListResponseDto();
      const profile = new ProfileResponseDto();
      profile.id = 'clx1234567890abcdef';
      profile.userId = 'clx1234567890abcdef';
      profile.firstName = 'Juan';
      profile.lastName = 'Pérez';
      profile.language = 'es';
      profile.createdAt = new Date();
      profile.updatedAt = new Date();
      profile.fullName = 'Juan Pérez';
      profile.isComplete = true;
      profile.completionPercentage = 100;

      dto.profiles = [profile];
      dto.total = 1;
      dto.page = 1;
      dto.limit = 10;
      dto.totalPages = 1;

      expect(dto.profiles).toHaveLength(1);
      expect(dto.profiles[0].fullName).toBe('Juan Pérez');
    });
  });

  describe('ProfileStatsResponseDto', () => {
    it('should create a valid stats response DTO', () => {
      const dto = new ProfileStatsResponseDto();
      dto.total = 100;
      dto.complete = 75;
      dto.incomplete = 25;
      dto.completionRate = 75;

      expect(dto.total).toBe(100);
      expect(dto.complete).toBe(75);
      expect(dto.incomplete).toBe(25);
      expect(dto.completionRate).toBe(75);
    });

    it('should handle zero values', () => {
      const dto = new ProfileStatsResponseDto();
      dto.total = 0;
      dto.complete = 0;
      dto.incomplete = 0;
      dto.completionRate = 0;

      expect(dto.total).toBe(0);
      expect(dto.completionRate).toBe(0);
    });
  });
});
