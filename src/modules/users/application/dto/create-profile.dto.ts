import { IsString, IsOptional, IsEnum } from 'class-validator';

/**
 * DTO for creating a user profile
 */
export class CreateProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(['es', 'en', 'fr', 'de', 'it', 'pt'])
  language?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;
}
