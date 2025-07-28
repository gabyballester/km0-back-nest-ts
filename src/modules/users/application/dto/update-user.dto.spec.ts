import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';
import { UserRole } from '@/modules/users/domain/entities/user.entity';

describe('UpdateUserDto', () => {
  let updateUserDto: UpdateUserDto;

  beforeEach(() => {
    updateUserDto = new UpdateUserDto();
  });

  describe('Validation', () => {
    it('should pass validation with valid data', async () => {
      updateUserDto.email = 'test@example.com';
      updateUserDto.firstName = 'John';
      updateUserDto.lastName = 'Doe';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      updateUserDto.role = UserRole.ADMIN;
      updateUserDto.isActive = true;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with empty object', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial data', async () => {
      updateUserDto.email = 'test@example.com';
      updateUserDto.firstName = 'John';

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid email', async () => {
      updateUserDto.email = 'invalid-email';

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(errors[0].property).toBe('email');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(errors[0].constraints?.isEmail).toBe('El email debe ser válido');
    });

    it('should fail validation with empty email string', async () => {
      updateUserDto.email = '';

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with short firstName', async () => {
      updateUserDto.firstName = 'J';

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(errors[0].property).toBe('firstName');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(errors[0].constraints?.minLength).toBe(
        'El nombre debe tener al menos 2 caracteres',
      );
    });

    it('should fail validation with long firstName', async () => {
      updateUserDto.firstName = 'A'.repeat(51);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(errors[0].property).toBe('firstName');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(errors[0].constraints?.maxLength).toBe(
        'El nombre no puede exceder 50 caracteres',
      );
    });

    it('should fail validation with short lastName', async () => {
      updateUserDto.lastName = 'D';

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(errors[0].property).toBe('lastName');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(errors[0].constraints?.minLength).toBe(
        'El apellido debe tener al menos 2 caracteres',
      );
    });

    it('should fail validation with long lastName', async () => {
      updateUserDto.lastName = 'A'.repeat(51);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(errors[0].property).toBe('lastName');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(errors[0].constraints?.maxLength).toBe(
        'El apellido no puede exceder 50 caracteres',
      );
    });

    it('should pass validation with valid user role', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      updateUserDto.role = UserRole.USER;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with valid admin role', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      updateUserDto.role = UserRole.ADMIN;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with valid moderator role', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      updateUserDto.role = UserRole.MODERATOR;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with boolean isActive true', async () => {
      updateUserDto.isActive = true;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with boolean isActive false', async () => {
      updateUserDto.isActive = false;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with minimum valid firstName', async () => {
      updateUserDto.firstName = 'Jo';

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with maximum valid firstName', async () => {
      updateUserDto.firstName = 'A'.repeat(50);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with minimum valid lastName', async () => {
      updateUserDto.lastName = 'Do';

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with maximum valid lastName', async () => {
      updateUserDto.lastName = 'A'.repeat(50);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Multiple validation errors', () => {
    it('should return multiple validation errors', async () => {
      updateUserDto.email = 'invalid-email';
      updateUserDto.firstName = 'J';
      updateUserDto.lastName = 'D';

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(errors.length).toBeGreaterThan(1);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      const errorProperties = errors.map((error: any) => error.property);
      expect(errorProperties).toContain('email');
      expect(errorProperties).toContain('firstName');
      expect(errorProperties).toContain('lastName');
    });

    it('should return multiple validation errors with all fields invalid', async () => {
      updateUserDto.email = 'invalid-email';
      updateUserDto.firstName = 'A'.repeat(51);
      updateUserDto.lastName = 'A'.repeat(51);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(errors.length).toBeGreaterThan(1);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      const errorProperties = errors.map((error: any) => error.property);
      expect(errorProperties).toContain('email');
      expect(errorProperties).toContain('firstName');
      expect(errorProperties).toContain('lastName');
    });
  });

  describe('Edge cases', () => {
    it('should pass validation with only email', async () => {
      updateUserDto.email = 'test@example.com';

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only firstName', async () => {
      updateUserDto.firstName = 'John';

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only lastName', async () => {
      updateUserDto.lastName = 'Doe';

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only role', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      updateUserDto.role = UserRole.USER;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only isActive', async () => {
      updateUserDto.isActive = true;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const errors = await validate(updateUserDto);
      expect(errors).toHaveLength(0);
    });
  });
});
