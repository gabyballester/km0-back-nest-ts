import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from '@/modules/users/domain/entities/user.entity';

describe('CreateUserDto', () => {
  let createUserDto: CreateUserDto;

  beforeEach(() => {
    createUserDto = new CreateUserDto();
  });

  describe('Constructor', () => {
    it('should create instance with default values', () => {
      expect(createUserDto.email).toBe('');
      expect(createUserDto.password).toBe('');
      expect(createUserDto.firstName).toBe('');
      expect(createUserDto.lastName).toBe('');
    });
  });

  describe('Validation', () => {
    it('should pass validation with valid data', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'Password123';
      createUserDto.firstName = 'John';
      createUserDto.lastName = 'Doe';
      createUserDto.role = UserRole.USER;
      createUserDto.isActive = true;

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid email', async () => {
      createUserDto.email = 'invalid-email';
      createUserDto.password = 'Password123';
      createUserDto.firstName = 'John';
      createUserDto.lastName = 'Doe';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints?.isEmail).toBe('El email debe ser válido');
    });

    it('should fail validation with empty email', async () => {
      createUserDto.email = '';
      createUserDto.password = 'Password123';
      createUserDto.firstName = 'John';
      createUserDto.lastName = 'Doe';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with weak password', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'weak';
      createUserDto.firstName = 'John';
      createUserDto.lastName = 'Doe';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints?.minLength).toBe(
        'La contraseña debe tener al menos 8 caracteres',
      );
    });

    it('should fail validation with password without uppercase', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'password123';
      createUserDto.firstName = 'John';
      createUserDto.lastName = 'Doe';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints?.matches).toBe(
        'La contraseña debe incluir al menos una minúscula, una mayúscula y un número',
      );
    });

    it('should fail validation with password without lowercase', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'PASSWORD123';
      createUserDto.firstName = 'John';
      createUserDto.lastName = 'Doe';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints?.matches).toBe(
        'La contraseña debe incluir al menos una minúscula, una mayúscula y un número',
      );
    });

    it('should fail validation with password without number', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'PasswordABC';
      createUserDto.firstName = 'John';
      createUserDto.lastName = 'Doe';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints?.matches).toBe(
        'La contraseña debe incluir al menos una minúscula, una mayúscula y un número',
      );
    });

    it('should fail validation with password too long', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'A'.repeat(129);
      createUserDto.firstName = 'John';
      createUserDto.lastName = 'Doe';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints?.maxLength).toBe(
        'La contraseña no puede exceder 128 caracteres',
      );
    });

    it('should fail validation with short firstName', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'Password123';
      createUserDto.firstName = 'J';
      createUserDto.lastName = 'Doe';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('firstName');
      expect(errors[0].constraints?.minLength).toBe(
        'El nombre debe tener al menos 2 caracteres',
      );
    });

    it('should fail validation with long firstName', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'Password123';
      createUserDto.firstName = 'A'.repeat(51);
      createUserDto.lastName = 'Doe';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('firstName');
      expect(errors[0].constraints?.maxLength).toBe(
        'El nombre no puede exceder 50 caracteres',
      );
    });

    it('should fail validation with short lastName', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'Password123';
      createUserDto.firstName = 'John';
      createUserDto.lastName = 'D';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('lastName');
      expect(errors[0].constraints?.minLength).toBe(
        'El apellido debe tener al menos 2 caracteres',
      );
    });

    it('should fail validation with long lastName', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'Password123';
      createUserDto.firstName = 'John';
      createUserDto.lastName = 'A'.repeat(51);

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('lastName');
      expect(errors[0].constraints?.maxLength).toBe(
        'El apellido no puede exceder 50 caracteres',
      );
    });

    it('should pass validation with valid role', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'Password123';
      createUserDto.firstName = 'John';
      createUserDto.lastName = 'Doe';
      createUserDto.role = UserRole.ADMIN;

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with valid moderator role', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'Password123';
      createUserDto.firstName = 'John';
      createUserDto.lastName = 'Doe';
      createUserDto.role = UserRole.MODERATOR;

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation without optional fields', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'Password123';
      createUserDto.firstName = 'John';
      createUserDto.lastName = 'Doe';

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with boolean isActive', async () => {
      createUserDto.email = 'test@example.com';
      createUserDto.password = 'Password123';
      createUserDto.firstName = 'John';
      createUserDto.lastName = 'Doe';
      createUserDto.isActive = false;

      const errors = await validate(createUserDto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Multiple validation errors', () => {
    it('should return multiple validation errors', async () => {
      createUserDto.email = 'invalid-email';
      createUserDto.password = 'weak';
      createUserDto.firstName = 'J';
      createUserDto.lastName = 'D';

      const errors = await validate(createUserDto);
      expect(errors.length).toBeGreaterThan(1);

      const errorProperties = errors.map(error => error.property);
      expect(errorProperties).toContain('email');
      expect(errorProperties).toContain('password');
      expect(errorProperties).toContain('firstName');
      expect(errorProperties).toContain('lastName');
    });
  });
});
