import { User } from '@/modules/users/domain/entities/user.entity';
import { CreateUserDto } from '@/modules/users/application/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/application/dto/update-user.dto';
import { UserResponseDto } from '@/modules/users/application/dto/user-response.dto';

export class UserFactory {
  static createUser(overrides: Partial<User> = {}): User {
    return new User({
      id: 'user_test_1234567890',
      email: 'test@example.com',
      password: 'hashedPassword123',
      createdAt: new Date('2024-01-01T10:00:00Z'),
      updatedAt: new Date('2024-01-02T15:30:00Z'),
      ...overrides,
    });
  }

  static createCreateUserDto(
    overrides: Partial<CreateUserDto> = {},
  ): CreateUserDto {
    return {
      email: 'newuser@example.com',
      password: 'Password123',
      ...overrides,
    };
  }

  static createUpdateUserDto(
    overrides: Partial<UpdateUserDto> = {},
  ): UpdateUserDto {
    return {
      email: 'updated@example.com',
      ...overrides,
    };
  }

  static createUserResponseDto(
    overrides: Partial<UserResponseDto> = {},
  ): UserResponseDto {
    return {
      id: 'user_response_1234567890',
      email: 'response@example.com',
      createdAt: new Date('2024-01-01T10:00:00Z'),
      updatedAt: new Date('2024-01-02T15:30:00Z'),
      ...overrides,
    };
  }

  static createUserWithEmail(email: string): User {
    return this.createUser({ email });
  }

  static createUserWithPassword(password: string): User {
    return this.createUser({ password });
  }

  static createUserWithEmptyEmail(): User {
    return this.createUser({ email: '' });
  }

  static createUserWithEmptyPassword(): User {
    return this.createUser({ password: '' });
  }

  static createUserWithExtremeData(): User {
    return this.createUser({
      id: `user_extreme_${'A'.repeat(100)}`,
      email:
        'very.long.email.address.with.many.subdomains.and.special.characters@example.com',
      password: 'A'.repeat(128),
      createdAt: new Date('1900-01-01T00:00:00Z'),
      updatedAt: new Date('2100-12-31T23:59:59Z'),
    });
  }

  static createUserWithSpecialCharacters(): User {
    return this.createUser({
      email: 'test+tag@example.com',
      password: 'P@ssw0rd!123',
    });
  }

  static createUserWithUppercaseEmail(): User {
    return this.createUser({
      email: 'TEST@EXAMPLE.COM',
    });
  }

  static createMultipleUsers(count: number): User[] {
    return Array.from({ length: count }, (_, index) =>
      this.createUser({
        id: `user_${index + 1}_${Date.now()}`,
        email: `user${index + 1}@example.com`,
      }),
    );
  }

  static createInvalidUser(): Partial<User> {
    return {
      id: '',
      email: 'invalid-email',
      password: 'short',
    };
  }

  static createUserForTesting(): User {
    return this.createUser({
      id: 'test_user_id',
      email: 'test@example.com',
      password: 'testPassword123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

export function createUserFactory(overrides: Partial<User> = {}): User {
  return UserFactory.createUser(overrides);
}

export function createCreateUserDtoFactory(
  overrides: Partial<CreateUserDto> = {},
): CreateUserDto {
  return UserFactory.createCreateUserDto(overrides);
}

export function createUpdateUserDtoFactory(
  overrides: Partial<UpdateUserDto> = {},
): UpdateUserDto {
  return UserFactory.createUpdateUserDto(overrides);
}

export function createUserResponseDtoFactory(
  overrides: Partial<UserResponseDto> = {},
): UserResponseDto {
  return UserFactory.createUserResponseDto(overrides);
}
