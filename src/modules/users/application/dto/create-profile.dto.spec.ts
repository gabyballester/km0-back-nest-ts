import { validate } from 'class-validator';
import { CreateProfileDto } from './create-profile.dto';

describe('CreateProfileDto', () => {
  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      // Arrange
      const dto = new CreateProfileDto();
      dto.userId = 'user_1234567890';
      dto.firstName = 'John';
      dto.lastName1 = 'Doe';
      dto.phone = '+1234567890';
      dto.language = 'es';
      dto.city = 'Madrid';
      dto.postalCode = '28001';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with minimal required data', async () => {
      // Arrange
      const dto = new CreateProfileDto();
      dto.userId = 'user_1234567890';
      dto.firstName = 'John';
      dto.lastName1 = 'Doe';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when userId is missing', async () => {
      // Arrange
      const dto = new CreateProfileDto();
      dto.firstName = 'John';
      dto.lastName1 = 'Doe';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('userId');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail validation when userId is empty', async () => {
      // Arrange
      const dto = new CreateProfileDto();
      dto.userId = '';
      dto.firstName = 'John';
      dto.lastName1 = 'Doe';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('userId');
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail validation when firstName is missing', async () => {
      // Arrange
      const dto = new CreateProfileDto();
      dto.userId = 'user_1234567890';
      dto.lastName1 = 'Doe';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('firstName');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail validation when firstName is empty', async () => {
      // Arrange
      const dto = new CreateProfileDto();
      dto.userId = 'user_1234567890';
      dto.firstName = '';
      dto.lastName1 = 'Doe';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('firstName');
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail validation when firstName is too long', async () => {
      // Arrange
      const dto = new CreateProfileDto();
      dto.userId = 'user_1234567890';
      dto.firstName = 'A'.repeat(51);
      dto.lastName1 = 'Doe';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('firstName');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should fail validation when lastName is missing', async () => {
      // Arrange
      const dto = new CreateProfileDto();
      dto.userId = 'user_1234567890';
      dto.firstName = 'John';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('lastName1');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail validation when lastName is empty', async () => {
      // Arrange
      const dto = new CreateProfileDto();
      dto.userId = 'user_1234567890';
      dto.firstName = 'John';
      dto.lastName1 = '';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('lastName1');
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail validation when lastName is too long', async () => {
      // Arrange
      const dto = new CreateProfileDto();
      dto.userId = 'user_1234567890';
      dto.firstName = 'John';
      dto.lastName1 = 'A'.repeat(51);

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('lastName1');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should fail validation when phone is too long', async () => {
      // Arrange
      const dto = new CreateProfileDto();
      dto.userId = 'user_1234567890';
      dto.firstName = 'John';
      dto.lastName1 = 'Doe';
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
      const dto = new CreateProfileDto();
      dto.userId = 'user_1234567890';
      dto.firstName = 'John';
      dto.lastName1 = 'Doe';
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
        const dto = new CreateProfileDto();
        dto.userId = 'user_1234567890';
        dto.firstName = 'John';
        dto.lastName1 = 'Doe';
        dto.language = language;

        // Act
        const errors = await validate(dto);

        // Assert
        expect(errors).toHaveLength(0);
      }
    });

    it('should fail validation when city is too long', async () => {
      // Arrange
      const dto = new CreateProfileDto();
      dto.userId = 'user_1234567890';
      dto.firstName = 'John';
      dto.lastName1 = 'Doe';
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
      const dto = new CreateProfileDto();
      dto.userId = 'user_1234567890';
      dto.firstName = 'John';
      dto.lastName1 = 'Doe';
      dto.postalCode = 'A'.repeat(11);

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('postalCode');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should pass validation with all optional fields', async () => {
      // Arrange
      const dto = new CreateProfileDto();
      dto.userId = 'user_1234567890';
      dto.firstName = 'John';
      dto.lastName1 = 'Doe';
      dto.phone = '+1234567890';
      dto.language = 'en';
      dto.city = 'Barcelona';
      dto.postalCode = '08001';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should use default language when not provided', async () => {
      // Arrange
      const dto = new CreateProfileDto();
      dto.userId = 'user_1234567890';
      dto.firstName = 'John';
      dto.lastName1 = 'Doe';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
      expect(dto.language).toBe('es');
    });
  });

  describe('edge cases', () => {
    it('should handle very long userId', async () => {
      // Arrange
      const dto = new CreateProfileDto();
      dto.userId = 'A'.repeat(1000);
      dto.firstName = 'John';
      dto.lastName1 = 'Doe';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should handle special characters in names', async () => {
      // Arrange
      const dto = new CreateProfileDto();
      dto.userId = 'user_1234567890';
      dto.firstName = 'José María';
      dto.lastName1 = 'García López';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should reject names with numbers', async () => {
      // Arrange
      const dto = new CreateProfileDto();
      dto.userId = 'user_1234567890';
      dto.firstName = 'John2';
      dto.lastName1 = 'Doe3';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(2);
      expect(errors[0].property).toBe('firstName');
      expect(errors[1].property).toBe('lastName1');
    });

    it('should reject names with hyphens', async () => {
      // Arrange
      const dto = new CreateProfileDto();
      dto.userId = 'user_1234567890';
      dto.firstName = 'José María';
      dto.lastName1 = 'García-López';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('lastName1');
    });
  });
});
