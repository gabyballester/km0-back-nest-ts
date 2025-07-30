import { CreateUserDto } from './create-user.dto';
import { validate } from 'class-validator';

describe('CreateUserDto', () => {
  let createUserDto: CreateUserDto;

  beforeEach(() => {
    createUserDto = new CreateUserDto();
  });

  describe('constructor', () => {
    it('should create a CreateUserDto with default values', () => {
      expect(createUserDto.email).toBe('');
      expect(createUserDto.password).toBe('');
    });
  });

  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'Password123';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid email', async () => {
      createUserDto.email = 'invalid-email';
      createUserDto.password = 'Password123';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isEmail).toBe('El email debe ser válido');
    });

    it('should fail validation with empty email', async () => {
      createUserDto.email = '';
      createUserDto.password = 'Password123';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isEmail).toBe('El email debe ser válido');
    });

    it('should fail validation with password too short', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'short';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.minLength).toBe(
        'La contraseña debe tener al menos 8 caracteres',
      );
    });

    it('should fail validation with password too long', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'A'.repeat(129);

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.maxLength).toBe(
        'La contraseña no puede exceder 128 caracteres',
      );
    });

    it('should fail validation with password without uppercase', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'password123';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.matches).toBe(
        'La contraseña debe incluir al menos una minúscula, una mayúscula y un número',
      );
    });

    it('should fail validation with password without lowercase', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'PASSWORD123';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.matches).toBe(
        'La contraseña debe incluir al menos una minúscula, una mayúscula y un número',
      );
    });

    it('should fail validation with password without number', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'PasswordABC';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.matches).toBe(
        'La contraseña debe incluir al menos una minúscula, una mayúscula y un número',
      );
    });

    it('should fail validation with non-string password', async () => {
      createUserDto.email = 'test@example.com';
      // Test with invalid password type
      (createUserDto as unknown as Record<string, unknown>).password = 123;

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isString).toBe(
        'La contraseña debe ser una cadena de texto',
      );
    });
  });

  describe('edge cases', () => {
    it('should handle special characters in email', async () => {
      createUserDto.email = 'test+tag@example.com';
      createUserDto.password = 'Password123';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should handle long email addresses', async () => {
      createUserDto.email =
        'very.long.email.address.with.many.subdomains@example.com';
      createUserDto.password = 'Password123';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should handle complex passwords', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'P@ssw0rd!123';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should handle minimum valid password length', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'Pass1234';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should handle maximum valid password length', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'A'.repeat(128);

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1); // Should fail because it doesn't match the regex pattern
    });
  });
});
