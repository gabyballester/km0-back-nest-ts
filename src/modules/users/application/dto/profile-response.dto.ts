import { Expose, Transform } from 'class-transformer';

/**
 * Social links response DTO
 */
export class SocialLinksResponseDto {
  @Expose()
  twitter?: string;

  @Expose()
  linkedin?: string;

  @Expose()
  github?: string;

  @Expose()
  instagram?: string;

  @Expose()
  facebook?: string;
}

/**
 * Notification preferences response DTO
 */
export class NotificationPreferencesResponseDto {
  @Expose()
  email?: boolean;

  @Expose()
  push?: boolean;

  @Expose()
  sms?: boolean;
}

/**
 * Privacy settings response DTO
 */
export class PrivacySettingsResponseDto {
  @Expose()
  profileVisibility?: 'public' | 'private' | 'friends';

  @Expose()
  showEmail?: boolean;

  @Expose()
  showPhone?: boolean;
}

/**
 * User preferences response DTO
 */
export class UserPreferencesResponseDto {
  @Expose()
  theme?: 'light' | 'dark' | 'auto';

  @Expose()
  language?: string;

  @Expose()
  @Transform(({ value }) =>
    value ? new NotificationPreferencesResponseDto() : undefined,
  )
  notifications?: NotificationPreferencesResponseDto;

  @Expose()
  @Transform(({ value }) =>
    value ? new PrivacySettingsResponseDto() : undefined,
  )
  privacy?: PrivacySettingsResponseDto;
}

/**
 * DTO for profile responses
 */
export class ProfileResponseDto {
  @Expose()
  id!: string;

  @Expose()
  userId!: string;

  @Expose()
  avatar?: string;

  @Expose()
  bio?: string;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : undefined))
  dateOfBirth?: Date;

  @Expose()
  location?: string;

  @Expose()
  website?: string;

  @Expose()
  @Transform(({ value }) => (value ? new SocialLinksResponseDto() : undefined))
  socialLinks?: SocialLinksResponseDto;

  @Expose()
  @Transform(({ value }) =>
    value ? new UserPreferencesResponseDto() : undefined,
  )
  preferences?: UserPreferencesResponseDto;

  @Expose()
  isPublic!: boolean;

  @Expose()
  @Transform(({ value }) => new Date(value).toISOString())
  createdAt!: Date;

  @Expose()
  @Transform(({ value }) => new Date(value).toISOString())
  updatedAt!: Date;

  // Computed properties
  @Expose()
  age?: number;

  @Expose()
  completionPercentage!: number;

  @Expose()
  isComplete!: boolean;
}
