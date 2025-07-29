import {
  Profile,
  SocialLinks,
  UserPreferences,
} from '../entities/profile.entity';
import { CreateProfileDto } from '../../application/dto/create-profile.dto';
import { UpdateProfileDto } from '../../application/dto/update-profile.dto';

/**
 * Interface for profile domain service operations
 * Contains business logic for profile management
 */
export interface IProfileService {
  /**
   * Create a new profile for a user
   */
  createProfile(
    userId: string,
    createProfileDto: CreateProfileDto,
  ): Promise<Profile>;

  /**
   * Get profile by ID
   */
  getProfileById(id: string): Promise<Profile>;

  /**
   * Get profile by user ID
   */
  getProfileByUserId(userId: string): Promise<Profile>;

  /**
   * Get all profiles with pagination
   */
  getAllProfiles(
    page?: number,
    limit?: number,
  ): Promise<{
    profiles: Profile[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

  /**
   * Get public profiles with pagination
   */
  getPublicProfiles(
    page?: number,
    limit?: number,
  ): Promise<{
    profiles: Profile[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

  /**
   * Update profile
   */
  updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile>;

  /**
   * Update profile avatar
   */
  updateAvatar(id: string, avatar: string): Promise<Profile>;

  /**
   * Update profile bio
   */
  updateBio(id: string, bio: string): Promise<Profile>;

  /**
   * Update profile location
   */
  updateLocation(id: string, location: string): Promise<Profile>;

  /**
   * Update profile website
   */
  updateWebsite(id: string, website: string): Promise<Profile>;

  /**
   * Update profile social links
   */
  updateSocialLinks(id: string, socialLinks: SocialLinks): Promise<Profile>;

  /**
   * Update profile preferences
   */
  updatePreferences(id: string, preferences: UserPreferences): Promise<Profile>;

  /**
   * Toggle profile visibility
   */
  toggleProfileVisibility(id: string): Promise<Profile>;

  /**
   * Set profile visibility
   */
  setProfileVisibility(id: string, isPublic: boolean): Promise<Profile>;

  /**
   * Delete profile
   */
  deleteProfile(id: string): Promise<void>;

  /**
   * Check if profile exists for user
   */
  profileExistsForUser(userId: string): Promise<boolean>;

  /**
   * Get profile completion percentage
   */
  getProfileCompletionPercentage(id: string): Promise<number>;

  /**
   * Get profiles by location
   */
  getProfilesByLocation(
    location: string,
    page?: number,
    limit?: number,
  ): Promise<{
    profiles: Profile[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

  /**
   * Get incomplete profiles
   */
  getIncompleteProfiles(
    page?: number,
    limit?: number,
  ): Promise<{
    profiles: Profile[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

  /**
   * Get profile statistics
   */
  getProfileStatistics(): Promise<{
    total: number;
    public: number;
    private: number;
    complete: number;
    incomplete: number;
  }>;
}
