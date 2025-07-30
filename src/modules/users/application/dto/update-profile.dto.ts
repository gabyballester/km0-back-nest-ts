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
  @ApiName(false, 'nombre')
  @IsValidName(false)
  firstName?: string;

  @ApiName(false, 'apellido')
  @IsValidName(false)
  lastName?: string;

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
