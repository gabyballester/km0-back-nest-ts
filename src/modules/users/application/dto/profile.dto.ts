import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsIn,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para crear un perfil
 */
export class CreateProfileDto {
  @ApiProperty({
    description: 'ID del usuario al que pertenece el perfil',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  firstName!: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  lastName!: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono',
    example: '+34 600 123 456',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({
    description: 'Idioma preferido',
    example: 'es',
    enum: ['es', 'en', 'fr', 'de', 'it', 'pt'],
    default: 'es',
  })
  @IsOptional()
  @IsString()
  @IsIn(['es', 'en', 'fr', 'de', 'it', 'pt'])
  language?: string;

  @ApiPropertyOptional({
    description: 'Ciudad del usuario',
    example: 'Madrid',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({
    description: 'Código postal',
    example: '28001',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  postalCode?: string;
}

/**
 * DTO para actualizar un perfil
 */
export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Nombre del usuario',
    example: 'Juan',
    minLength: 1,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Apellido del usuario',
    example: 'Pérez',
    minLength: 1,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono',
    example: '+34 600 123 456',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({
    description: 'Idioma preferido',
    example: 'es',
    enum: ['es', 'en', 'fr', 'de', 'it', 'pt'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['es', 'en', 'fr', 'de', 'it', 'pt'])
  language?: string;

  @ApiPropertyOptional({
    description: 'Ciudad del usuario',
    example: 'Madrid',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({
    description: 'Código postal',
    example: '28001',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  postalCode?: string;
}

/**
 * DTO para filtros de perfiles
 */
export class ProfileFiltersDto {
  @ApiPropertyOptional({
    description: 'Filtrar por ciudad',
    example: 'Madrid',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por idioma',
    example: 'es',
    enum: ['es', 'en', 'fr', 'de', 'it', 'pt'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['es', 'en', 'fr', 'de', 'it', 'pt'])
  language?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por completitud del perfil',
    example: true,
  })
  @IsOptional()
  isComplete?: boolean;
}

/**
 * DTO para paginación
 */
export class ProfilePaginationDto {
  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Número de elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

/**
 * DTO de respuesta para un perfil
 */
export class ProfileResponseDto {
  @ApiProperty({
    description: 'ID del perfil',
    example: 'clx1234567890abcdef',
  })
  id!: string;

  @ApiProperty({
    description: 'ID del usuario',
    example: 'clx1234567890abcdef',
  })
  userId!: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  firstName!: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  lastName!: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono',
    example: '+34 600 123 456',
  })
  phone?: string;

  @ApiProperty({
    description: 'Idioma preferido',
    example: 'es',
  })
  language!: string;

  @ApiPropertyOptional({
    description: 'Ciudad del usuario',
    example: 'Madrid',
  })
  city?: string;

  @ApiPropertyOptional({
    description: 'Código postal',
    example: '28001',
  })
  postalCode?: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  fullName!: string;

  @ApiProperty({
    description: 'Si el perfil está completo',
    example: true,
  })
  isComplete!: boolean;

  @ApiProperty({
    description: 'Porcentaje de completitud del perfil',
    example: 80,
  })
  completionPercentage!: number;
}

/**
 * DTO de respuesta para lista de perfiles
 */
export class ProfileListResponseDto {
  @ApiProperty({
    description: 'Lista de perfiles',
    type: [ProfileResponseDto],
  })
  profiles!: ProfileResponseDto[];

  @ApiProperty({
    description: 'Total de perfiles',
    example: 100,
  })
  total!: number;

  @ApiProperty({
    description: 'Página actual',
    example: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Elementos por página',
    example: 10,
  })
  limit!: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 10,
  })
  totalPages!: number;
}

/**
 * DTO de respuesta para estadísticas de perfiles
 */
export class ProfileStatsResponseDto {
  @ApiProperty({
    description: 'Total de perfiles',
    example: 100,
  })
  total!: number;

  @ApiProperty({
    description: 'Perfiles completos',
    example: 75,
  })
  complete!: number;

  @ApiProperty({
    description: 'Perfiles incompletos',
    example: 25,
  })
  incomplete!: number;

  @ApiProperty({
    description: 'Porcentaje de completitud',
    example: 75,
  })
  completionRate!: number;
}
