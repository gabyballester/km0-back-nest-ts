import {
  IsValidName,
  IsValidPhone,
  IsValidPostalCode,
  IsValidCity,
  IsValidLanguage,
  ApiName,
  ApiPhone,
  ApiPostalCode,
  ApiCity,
  ApiLanguage,
} from '@/shared/decorators/validation.decorators';

/**
 * DTO para actualizar un perfil de usuario existente
 */
export class UpdateProfileDto {
  @ApiName(false, 'first name')
  @IsValidName(false)
  firstName?: string;

  @ApiName(false, 'first last name')
  @IsValidName(false)
  lastName1?: string;

  @ApiName(false, 'second last name')
  @IsValidName(false)
  lastName2?: string;

  @ApiPhone()
  @IsValidPhone()
  phone?: string;

  @ApiLanguage()
  @IsValidLanguage()
  language?: string;

  @ApiCity()
  @IsValidCity()
  city?: string;

  @ApiPostalCode()
  @IsValidPostalCode()
  postalCode?: string;
}
