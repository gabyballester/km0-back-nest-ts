import {
  IsValidEmail,
  IsValidPassword,
  ApiEmail,
  ApiPassword,
} from '@/shared/decorators/validation.decorators';

/**
 * DTO para crear un nuevo usuario
 */
export class CreateUserDto {
  constructor() {
    this.email = '';
    this.password = '';
  }

  @ApiEmail(true)
  @IsValidEmail(true)
  email: string;

  @ApiPassword(true)
  @IsValidPassword(true)
  password: string;
}
