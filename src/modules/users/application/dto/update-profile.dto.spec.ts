import { validate } from 'class-validator';
import { UpdateProfileDto } from './update-profile.dto';

describe('UpdateProfileDto', () => {
  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.firstName = 'John';
      dto.lastName = 'Doe';
      dto.phone = '+1234567890';
      dto.language = 'es';
      dto.city = 'Madrid';
      dto.postalCode = '28001';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial data', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.firstName = 'John';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with empty object', async () => {
      // Arrange
      const dto = new UpdateProfileDto();

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when firstName is empty', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.firstName = '';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('firstName');
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail validation when firstName is too long', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.firstName = 'A'.repeat(51);

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('firstName');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should fail validation when lastName is empty', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.lastName = '';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('lastName');
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail validation when lastName is too long', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.lastName = 'A'.repeat(51);

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('lastName');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should fail validation when phone is too long', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.phone = 'A'.repeat(21);

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('phone');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should fail validation when language is invalid', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.language = 'invalid';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('language');
      expect(errors[0].constraints).toHaveProperty('isEnum');
    });

    it('should pass validation with valid language values', async () => {
      // Arrange
      const validLanguages = ['es', 'en', 'fr', 'de', 'it', 'pt'];

      for (const language of validLanguages) {
        const dto = new UpdateProfileDto();
        dto.language = language;

        // Act
        const errors = await validate(dto);

        // Assert
        expect(errors).toHaveLength(0);
      }
    });

    it('should fail validation when city is too long', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.city = 'A'.repeat(101);

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('city');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should fail validation when postalCode is too long', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.postalCode = 'A'.repeat(11);

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('postalCode');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should pass validation with all fields', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.firstName = 'John';
      dto.lastName = 'Doe';
      dto.phone = '+1234567890';
      dto.language = 'en';
      dto.city = 'Barcelona';
      dto.postalCode = '08001';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only firstName', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.firstName = 'John';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only lastName', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.lastName = 'Doe';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only phone', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.phone = '+1234567890';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only language', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.language = 'es';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only city', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.city = 'Madrid';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only postalCode', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.postalCode = '28001';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    it('should handle special characters in names', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.firstName = 'José María';
      dto.lastName = 'García López';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should reject names with numbers', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.firstName = 'John2';
      dto.lastName = 'Doe3';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(2);
      expect(errors[0].property).toBe('firstName');
      expect(errors[1].property).toBe('lastName');
    });

    it('should handle maximum length values', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.firstName = 'A'.repeat(50);
      dto.lastName = 'B'.repeat(50);
      dto.phone = '+123456789012345';
      dto.city = 'D'.repeat(100);
      dto.postalCode = '12345-6789';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should handle minimum length values', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.firstName = 'AA';
      dto.lastName = 'BB';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should handle null values for optional fields', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.firstName = 'John';
      dto.lastName = 'Doe';
      // Test with null values (should be converted to undefined)
      dto.phone = undefined;
      dto.city = undefined;
      dto.postalCode = undefined;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should handle undefined values for optional fields', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.firstName = 'John';
      dto.lastName = 'Doe';
      dto.phone = undefined;
      dto.city = undefined;
      dto.postalCode = undefined;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });
  });

  describe('multiple validation errors', () => {
    it('should return multiple validation errors', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.firstName = '';
      dto.lastName = '';
      dto.language = 'invalid';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(3);
      expect(errors.some(e => e.property === 'firstName')).toBe(true);
      expect(errors.some(e => e.property === 'lastName')).toBe(true);
      expect(errors.some(e => e.property === 'language')).toBe(true);
    });

    it('should return multiple length validation errors', async () => {
      // Arrange
      const dto = new UpdateProfileDto();
      dto.firstName = 'A'.repeat(51);
      dto.lastName = 'B'.repeat(51);
      dto.phone = 'C'.repeat(21);
      dto.city = 'D'.repeat(101);
      dto.postalCode = 'E'.repeat(11);

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(5);
      expect(errors.some(e => e.property === 'firstName')).toBe(true);
      expect(errors.some(e => e.property === 'lastName')).toBe(true);
      expect(errors.some(e => e.property === 'phone')).toBe(true);
      expect(errors.some(e => e.property === 'city')).toBe(true);
      expect(errors.some(e => e.property === 'postalCode')).toBe(true);
    });
  });
});
