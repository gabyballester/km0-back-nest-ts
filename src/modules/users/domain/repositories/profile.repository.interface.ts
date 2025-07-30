import { Profile } from '../entities/profile.entity';

/**
 * Injection token for ProfileRepository
 * Used for dependency injection in NestJS
 */
export const PROFILE_REPOSITORY = 'PROFILE_REPOSITORY';

/**
 * Interface for profile repository operations
 * Follows Repository pattern for domain-driven design
 */
export interface IProfileRepository {
  /**
   * Create a new profile
   */
  create(profile: Profile): Promise<Profile>;

  /**
   * Find profile by ID
   */
  findById(id: string): Promise<Profile | null>;

  /**
   * Find profile by user ID
   */
  findByUserId(userId: string): Promise<Profile | null>;

  /**
   * Find all profiles with pagination
   */
  findAll(
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
  update(id: string, profile: Partial<Profile>): Promise<Profile>;

  /**
   * Delete profile
   */
  delete(id: string): Promise<void>;

  /**
   * Check if profile exists by user ID
   */
  existsByUserId(userId: string): Promise<boolean>;

  /**
   * Count total profiles
   */
  count(): Promise<number>;

  /**
   * Find profiles by city
   */
  findByCity(city: string): Promise<Profile[]>;

  /**
   * Find profiles by language
   */
  findByLanguage(language: string): Promise<Profile[]>;

  /**
   * Find complete profiles (with basic information)
   */
  findCompleteProfiles(): Promise<Profile[]>;
}
