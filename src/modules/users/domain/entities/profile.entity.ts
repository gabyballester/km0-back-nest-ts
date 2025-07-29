import {
  IsOptional,
  IsString,
  IsUrl,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Social links configuration
 */
export class SocialLinks {
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
 * Notification preferences
 */
export class NotificationPreferences {
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
 * Privacy settings
 */
export class PrivacySettings {
  @IsOptional()
  @IsString()
  profileVisibility?: 'public' | 'private' | 'friends';

  @IsOptional()
  @IsBoolean()
  showEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  showPhone?: boolean;
}

/**
 * User preferences
 */
export class UserPreferences {
  @IsOptional()
  @IsString()
  theme?: 'light' | 'dark' | 'auto';

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationPreferences)
  notifications?: NotificationPreferences;

  @IsOptional()
  @ValidateNested()
  @Type(() => PrivacySettings)
  privacy?: PrivacySettings;
}

/**
 * Profile entity representing user profile information
 * Follows Domain-Driven Design principles
 */
export class Profile {
  private readonly _id: string;
  private readonly _userId: string;
  private _avatar?: string; // todo: quitar esta propiedad
  private _bio?: string; // todo: quitar esta propiedad
  private _dateOfBirth?: Date;
  private _location?: string; // todo: quitar esta propiedad
  private _website?: string; // todo: quitar esta propiedad
  private _socialLinks?: SocialLinks; // todo: quitar esta propiedad
  private _preferences?: UserPreferences; // todo: quitar esta propiedad
  private _isPublic: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    isPublic: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    avatar?: string,
    bio?: string,
    dateOfBirth?: Date,
    location?: string,
    website?: string,
    socialLinks?: SocialLinks,
    preferences?: UserPreferences,
  ) {
    this._id = id;
    this._userId = userId;
    this._isPublic = isPublic;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._avatar = avatar;
    this._bio = bio;
    this._dateOfBirth = dateOfBirth;
    this._location = location;
    this._website = website;
    this._socialLinks = socialLinks;
    this._preferences = preferences;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get avatar(): string | undefined {
    return this._avatar;
  }

  get bio(): string | undefined {
    return this._bio;
  }

  get dateOfBirth(): Date | undefined {
    return this._dateOfBirth;
  }

  get location(): string | undefined {
    return this._location;
  }

  get website(): string | undefined {
    return this._website;
  }

  get socialLinks(): SocialLinks | undefined {
    return this._socialLinks;
  }

  get preferences(): UserPreferences | undefined {
    return this._preferences;
  }

  get isPublic(): boolean {
    return this._isPublic;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business logic methods
  /**
   * Update profile avatar
   */
  updateAvatar(avatar: string): void {
    this.validateAvatarUrl(avatar);
    this._avatar = avatar;
    this._updatedAt = new Date();
  }

  /**
   * Update profile bio
   */
  updateBio(bio: string): void {
    this.validateBio(bio);
    this._bio = bio;
    this._updatedAt = new Date();
  }

  /**
   * Update date of birth
   */
  updateDateOfBirth(dateOfBirth: Date): void {
    this.validateDateOfBirth(dateOfBirth);
    this._dateOfBirth = dateOfBirth;
    this._updatedAt = new Date();
  }

  /**
   * Update location
   */
  updateLocation(location: string): void {
    this.validateLocation(location);
    this._location = location;
    this._updatedAt = new Date();
  }

  /**
   * Update website
   */
  updateWebsite(website: string): void {
    this.validateWebsite(website);
    this._website = website;
    this._updatedAt = new Date();
  }

  /**
   * Update social links
   */
  updateSocialLinks(socialLinks: SocialLinks): void {
    this.validateSocialLinks(socialLinks);
    this._socialLinks = socialLinks;
    this._updatedAt = new Date();
  }

  /**
   * Update preferences
   */
  updatePreferences(preferences: UserPreferences): void {
    this.validatePreferences(preferences);
    this._preferences = preferences;
    this._updatedAt = new Date();
  }

  /**
   * Toggle profile visibility
   */
  toggleVisibility(): void {
    this._isPublic = !this._isPublic;
    this._updatedAt = new Date();
  }

  /**
   * Set profile visibility
   */
  setVisibility(isPublic: boolean): void {
    this._isPublic = isPublic;
    this._updatedAt = new Date();
  }

  /**
   * Get user age based on date of birth
   */
  getAge(): number | null {
    if (!this._dateOfBirth) {
      return null;
    }

    const today = new Date();
    const birthDate = new Date(this._dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  /**
   * Check if profile is complete (has basic information)
   */
  isComplete(): boolean {
    return !!(this._bio && this._location && this._avatar);
  }

  /**
   * Get profile completion percentage
   */
  getCompletionPercentage(): number {
    const fields = [
      this._avatar,
      this._bio,
      this._dateOfBirth,
      this._location,
      this._website,
      this._socialLinks,
      this._preferences,
    ];

    const completedFields = fields.filter(
      field => field !== undefined && field !== null,
    ).length;
    return Math.round((completedFields / fields.length) * 100);
  }

  // Validation methods
  private validateAvatarUrl(avatar: string): void {
    if (avatar && avatar.length > 500) {
      throw new Error('Avatar URL cannot exceed 500 characters');
    }
  }

  private validateBio(bio: string): void {
    if (bio && bio.length > 1000) {
      throw new Error('Bio cannot exceed 1000 characters');
    }
  }

  private validateDateOfBirth(dateOfBirth: Date): void {
    const today = new Date();
    if (dateOfBirth > today) {
      throw new Error('Date of birth cannot be in the future');
    }

    const minAge = 13;
    const maxAge = 120;
    const age = this.calculateAge(dateOfBirth);

    if (age < minAge || age > maxAge) {
      throw new Error(`Age must be between ${minAge} and ${maxAge} years`);
    }
  }

  private validateLocation(location: string): void {
    if (location && location.length > 100) {
      throw new Error('Location cannot exceed 100 characters');
    }
  }

  private validateWebsite(website: string): void {
    if (website && website.length > 255) {
      throw new Error('Website URL cannot exceed 255 characters');
    }
  }

  private validateSocialLinks(_socialLinks: SocialLinks): void {
    // Validation is handled by class-validator decorators
  }

  private validatePreferences(_preferences: UserPreferences): void {
    // Validation is handled by class-validator decorators
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
    ) {
      age--;
    }

    return age;
  }

  // Factory method
  static create(
    userId: string,
    avatar?: string,
    bio?: string,
    dateOfBirth?: Date,
    location?: string,
    website?: string,
    socialLinks?: SocialLinks,
    preferences?: UserPreferences,
  ): Profile {
    const id = crypto.randomUUID();
    return new Profile(
      id,
      userId,
      true,
      new Date(),
      new Date(),
      avatar,
      bio,
      dateOfBirth,
      location,
      website,
      socialLinks,
      preferences,
    );
  }
}
