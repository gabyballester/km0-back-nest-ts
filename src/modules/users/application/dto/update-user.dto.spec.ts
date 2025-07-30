import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

describe('UpdateUserDto', () => {
  let updateUserDto: UpdateUserDto;

  beforeEach(() => {
    updateUserDto = new UpdateUserDto();
  });

  describe('validation', () => {
    it('should pass validation with valid email', async () => {
      updateUserDto.email = 'test@example.com';

      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with undefined email', async () => {
      updateUserDto.email = undefined;

      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid email', async () => {
      updateUserDto.email = 'invalid-email';

      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isEmail).toBe('El email debe ser válido');
    });

    it('should fail validation with empty email', async () => {
      updateUserDto.email = '';

      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isEmail).toBe('El email debe ser válido');
    });

    it('should fail validation with non-string email', async () => {
      (updateUserDto as Record<string, unknown>).email = 123;

      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isEmail).toBe('El email debe ser válido');
    });
  });

  describe('edge cases', () => {
    it('should handle special characters in email', async () => {
      updateUserDto.email = 'test+tag@example.com';

      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should handle long email addresses', async () => {
      updateUserDto.email =
        'very.long.email.address.with.many.subdomains@example.com';

      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should handle email with multiple dots', async () => {
      updateUserDto.email = 'test.user@subdomain.example.com';

      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should handle email with numbers', async () => {
      updateUserDto.email = 'user123@example.com';

      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should handle email with hyphens', async () => {
      updateUserDto.email = 'test-user@example.com';

      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });
  });
});
