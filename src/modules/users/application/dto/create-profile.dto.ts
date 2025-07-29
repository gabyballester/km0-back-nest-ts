import {
  IsOptional,
  IsString,
  IsUrl,
  IsBoolean,
  IsDateString,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Social links DTO for profile creation
 */
export class CreateSocialLinksDto {
  @IsOptional()
  @IsUrl()
  twitter?: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsUrl()
  github?: string;

  @IsOptional()
  @IsUrl()
  instagram?: string;

  @IsOptional()
  @IsUrl()
  facebook?: string;
}

/**
 * Notification preferences DTO for profile creation
 */
export class CreateNotificationPreferencesDto {
  @IsOptional()
  @IsBoolean()
  email?: boolean;

  @IsOptional()
  @IsBoolean()
  push?: boolean;

  @IsOptional()
  @IsBoolean()
  sms?: boolean;
}

/**
 * Privacy settings DTO for profile creation
 */
export class CreatePrivacySettingsDto {
  @IsOptional()
  @IsEnum(['public', 'private', 'friends'])
  profileVisibility?: 'public' | 'private' | 'friends';

  @IsOptional()
  @IsBoolean()
  showEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  showPhone?: boolean;
}

/**
 * User preferences DTO for profile creation
 */
export class CreateUserPreferencesDto {
  @IsOptional()
  @IsEnum(['light', 'dark', 'auto'])
  theme?: 'light' | 'dark' | 'auto';

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateNotificationPreferencesDto)
  notifications?: CreateNotificationPreferencesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePrivacySettingsDto)
  privacy?: CreatePrivacySettingsDto;
}

/**
 * DTO for creating a user profile
 */
export class CreateProfileDto {
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSocialLinksDto)
  socialLinks?: CreateSocialLinksDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserPreferencesDto)
  preferences?: CreateUserPreferencesDto;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
