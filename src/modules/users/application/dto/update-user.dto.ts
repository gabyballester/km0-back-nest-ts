import {
  IsValidEmail,
  ApiEmail,
} from '@/shared/decorators/validation.decorators';

/**
 * DTO para actualizar un usuario existente
 */
export class UpdateUserDto {
  @ApiEmail(false)
  @IsValidEmail(false)
  email?: string;
}
