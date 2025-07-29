import { Profile } from '../entities/profile.entity';
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
   * Update profile
   */
  updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile>;

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
   * Count total profiles
   */
  count(): Promise<number>;
}
