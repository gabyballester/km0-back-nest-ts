import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
 * DTO para crear un nuevo perfil de usuario
 */
export class CreateProfileDto {
  @ApiProperty({
    description: 'ID del usuario al que pertenece el perfil',
    example: 'user_1234567890',
  })
  @IsNotEmpty({ message: 'El userId es requerido' })
  @IsString({ message: 'El userId debe ser una cadena de texto' })
  @MinLength(1, { message: 'El userId no puede estar vacío' })
  userId!: string;

  @ApiName(true, 'first name')
  @IsValidName(true)
  firstName!: string;

  @ApiName(true, 'first last name')
  @IsValidName(true)
  lastName1!: string;

  @ApiName(false, 'second last name')
  @IsValidName(false)
  lastName2?: string;

  @ApiPhone()
  @IsValidPhone()
  phone?: string;

  @ApiLanguage()
  @IsValidLanguage()
  language?: string = 'es';

  @ApiCity()
  @IsValidCity()
  city?: string;

  @ApiPostalCode()
  @IsValidPostalCode()
  postalCode?: string;
}
