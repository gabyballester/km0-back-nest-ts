import { User, UserRole } from '@/modules/users/domain/entities/user.entity';
import { CreateUserDto } from '@/modules/users/application/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/application/dto/update-user.dto';
import { UserResponseDto } from '@/modules/users/application/dto/user-response.dto';

/**
 * Factory para generar datos de prueba de usuarios
 * Siguiendo el patrón Mother Object y Factory Pattern
 */
export class UserFactory {
  /**
   * Crea un usuario con datos por defecto
   */
  static createUser(overrides: Partial<User> = {}): User {
    return new User({
      id: 'test-user-id',
      email: 'test@example.com',
      password: 'hashedPassword123',
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
      role: UserRole.USER,
      createdAt: new Date('2024-01-01T10:00:00Z'),
      updatedAt: new Date('2024-01-02T15:30:00Z'),
      ...overrides,
    });
  }

  /**
   * Crea un usuario administrador
   */
  static createAdminUser(overrides: Partial<User> = {}): User {
    return this.createUser({
      id: 'admin-user-id',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      ...overrides,
    });
  }

  /**
   * Crea un usuario moderador
   */
  static createModeratorUser(overrides: Partial<User> = {}): User {
    return this.createUser({
      id: 'moderator-user-id',
      email: 'moderator@example.com',
      firstName: 'Moderator',
      lastName: 'User',
      role: UserRole.MODERATOR,
      ...overrides,
    });
  }

  /**
   * Crea un usuario inactivo
   */
  static createInactiveUser(overrides: Partial<User> = {}): User {
    return this.createUser({
      id: 'inactive-user-id',
      email: 'inactive@example.com',
      firstName: 'Inactive',
      lastName: 'User',
      isActive: false,
      ...overrides,
    });
  }

  /**
   * Crea múltiples usuarios para testing
   */
  static createUsers(count: number, overrides: Partial<User> = {}): User[] {
    return Array.from({ length: count }, (_, index) =>
      this.createUser({
        id: `user-${index + 1}`,
        email: `user${index + 1}@example.com`,
        firstName: `User${index + 1}`,
        lastName: `LastName${index + 1}`,
        ...overrides,
      }),
    );
  }

  /**
   * Crea un CreateUserDto con datos por defecto
   */
  static createCreateUserDto(
    overrides: Partial<CreateUserDto> = {},
  ): CreateUserDto {
    return {
      email: 'new@example.com',
      password: 'Password123',
      firstName: 'Jane',
      lastName: 'Smith',
      role: UserRole.USER,
      isActive: true,
      ...overrides,
    };
  }

  /**
   * Crea un UpdateUserDto con datos por defecto
   */
  static createUpdateUserDto(
    overrides: Partial<UpdateUserDto> = {},
  ): UpdateUserDto {
    return {
      email: 'updated@example.com',
      firstName: 'Updated',
      lastName: 'Name',
      role: UserRole.ADMIN,
      isActive: false,
      ...overrides,
    };
  }

  /**
   * Crea un UserResponseDto desde una entidad User
   */
  static createUserResponseDto(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.firstName = user.firstName;
    dto.lastName = user.lastName;
    dto.fullName = `${user.firstName} ${user.lastName}`;
    dto.isActive = user.isActive;
    dto.role = user.role;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }

  /**
   * Crea múltiples UserResponseDto desde entidades User
   */
  static createUserResponseDtos(users: User[]): UserResponseDto[] {
    return users.map(user => this.createUserResponseDto(user));
  }

  /**
   * Crea datos de usuario para inserción en base de datos
   */
  static createUserData(
    overrides: Partial<{
      id: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
      role: string;
      createdAt: Date;
      updatedAt: Date;
    }> = {},
  ): {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: 'test-user-id',
      email: 'test@example.com',
      password: 'hashedPassword123',
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
      role: UserRole.USER,
      createdAt: new Date('2024-01-01T10:00:00Z'),
      updatedAt: new Date('2024-01-02T15:30:00Z'),
      ...overrides,
    };
  }

  /**
   * Crea un usuario con email inválido para testing de validación
   */
  static createUserWithInvalidEmail(): User {
    return this.createUser({
      email: 'invalid-email',
    });
  }

  /**
   * Crea un usuario con contraseña débil para testing de validación
   */
  static createUserWithWeakPassword(): User {
    return this.createUser({
      password: 'weak',
    });
  }

  /**
   * Crea un usuario con nombres vacíos para testing de validación
   */
  static createUserWithEmptyNames(): User {
    return this.createUser({
      firstName: '',
      lastName: '',
    });
  }
}
