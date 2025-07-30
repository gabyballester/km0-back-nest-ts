import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { Profile } from '@/modules/users/domain/entities/profile.entity';
import {
  PROFILE_REPOSITORY,
  type IProfileRepository,
} from '@/modules/users/domain/repositories/profile.repository.interface';

/**
 * DTOs para las operaciones del servicio
 */
export interface CreateProfileDto {
  userId: string;
  firstName: string;
  lastName: string;
  language?: string;
  phone?: string;
  city?: string;
  postalCode?: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  language?: string;
  phone?: string;
  city?: string;
  postalCode?: string;
}

export interface ProfileFiltersDto {
  city?: string;
  language?: string;
  isComplete?: boolean;
}

export interface ProfilePaginationDto {
  page?: number;
  limit?: number;
}

/**
 * Servicio de aplicación para perfiles
 * Contiene la lógica de negocio y orquesta las operaciones
 */
@Injectable()
export class ProfileService {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: IProfileRepository,
  ) {}

  /**
   * Crea un nuevo perfil
   */
  async createProfile(createProfileDto: CreateProfileDto): Promise<Profile> {
    // Verificar si ya existe un perfil para este usuario
    const existingProfile = await this.profileRepository.findByUserId(
      createProfileDto.userId,
    );
    if (existingProfile) {
      throw new ConflictException(
        `Profile already exists for user ${createProfileDto.userId}`,
      );
    }

    // Crear el perfil usando la entidad de dominio
    const profile = Profile.create(
      createProfileDto.userId,
      createProfileDto.firstName,
      createProfileDto.lastName,
      createProfileDto.language ?? 'es',
      createProfileDto.phone,
      createProfileDto.city,
      createProfileDto.postalCode,
    );

    // Guardar en el repositorio
    return await this.profileRepository.create(profile);
  }

  /**
   * Obtiene un perfil por ID
   */
  async getProfileById(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findById(id);
    if (!profile) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
    return profile;
  }

  /**
   * Obtiene un perfil por ID de usuario
   */
  async getProfileByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }
    return profile;
  }

  /**
   * Obtiene todos los perfiles con paginación y filtros
   */
  async getAllProfiles(
    pagination: ProfilePaginationDto = {},
    filters: ProfileFiltersDto = {},
  ): Promise<{
    profiles: Profile[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10 } = pagination;

    // Validar parámetros de paginación
    if (page < 1) {
      throw new BadRequestException('Page must be greater than 0');
    }
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }

    // Por ahora, el repositorio no soporta filtros complejos
    // En una implementación más avanzada, se podrían agregar
    const result = await this.profileRepository.findAll(page, limit);

    // Aplicar filtros en memoria si es necesario
    let filteredProfiles = result.profiles;

    if (filters.city) {
      filteredProfiles = filteredProfiles.filter(profile =>
        profile.city?.toLowerCase().includes(filters.city?.toLowerCase() ?? ''),
      );
    }

    if (filters.language) {
      filteredProfiles = filteredProfiles.filter(
        profile => profile.language === filters.language,
      );
    }

    if (filters.isComplete !== undefined) {
      filteredProfiles = filteredProfiles.filter(
        profile => profile.isComplete() === filters.isComplete,
      );
    }

    return {
      profiles: filteredProfiles,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  /**
   * Actualiza un perfil
   */
  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    // Verificar que el perfil existe
    const existingProfile = await this.profileRepository.findById(id);
    if (!existingProfile) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }

    // Aplicar las actualizaciones usando los métodos de la entidad
    if (updateProfileDto.firstName !== undefined) {
      existingProfile.updateFirstName(updateProfileDto.firstName);
    }

    if (updateProfileDto.lastName !== undefined) {
      existingProfile.updateLastName(updateProfileDto.lastName);
    }

    if (updateProfileDto.phone !== undefined) {
      existingProfile.updatePhone(updateProfileDto.phone);
    }

    if (updateProfileDto.language !== undefined) {
      existingProfile.updateLanguage(updateProfileDto.language);
    }

    if (updateProfileDto.city !== undefined) {
      existingProfile.updateCity(updateProfileDto.city);
    }

    if (updateProfileDto.postalCode !== undefined) {
      existingProfile.updatePostalCode(updateProfileDto.postalCode);
    }

    // Guardar los cambios
    return await this.profileRepository.update(id, existingProfile);
  }

  /**
   * Actualiza un perfil por ID de usuario
   */
  async updateProfileByUserId(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }

    return await this.updateProfile(profile.id, updateProfileDto);
  }

  /**
   * Elimina un perfil
   */
  async deleteProfile(id: string): Promise<void> {
    // Verificar que el perfil existe
    const existingProfile = await this.profileRepository.findById(id);
    if (!existingProfile) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }

    await this.profileRepository.delete(id);
  }

  /**
   * Elimina un perfil por ID de usuario
   */
  async deleteProfileByUserId(userId: string): Promise<void> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }

    await this.profileRepository.delete(profile.id);
  }

  /**
   * Verifica si existe un perfil para un usuario
   */
  async profileExists(userId: string): Promise<boolean> {
    return await this.profileRepository.existsByUserId(userId);
  }

  /**
   * Obtiene estadísticas de perfiles
   */
  async getProfileStats(): Promise<{
    total: number;
    complete: number;
    incomplete: number;
    completionRate: number;
  }> {
    const total = await this.profileRepository.count();
    const completeProfiles =
      await this.profileRepository.findCompleteProfiles();
    const complete = completeProfiles.length;
    const incomplete = total - complete;
    const completionRate = total > 0 ? Math.round((complete / total) * 100) : 0;

    return {
      total,
      complete,
      incomplete,
      completionRate,
    };
  }

  /**
   * Busca perfiles por ciudad
   */
  async getProfilesByCity(city: string): Promise<Profile[]> {
    return await this.profileRepository.findByCity(city);
  }

  /**
   * Busca perfiles por idioma
   */
  async getProfilesByLanguage(language: string): Promise<Profile[]> {
    return await this.profileRepository.findByLanguage(language);
  }

  /**
   * Obtiene perfiles completos
   */
  async getCompleteProfiles(): Promise<Profile[]> {
    return await this.profileRepository.findCompleteProfiles();
  }

  /**
   * Obtiene el porcentaje de completitud de un perfil
   */
  async getProfileCompletionPercentage(id: string): Promise<number> {
    const profile = await this.getProfileById(id);
    return profile.getCompletionPercentage();
  }

  /**
   * Obtiene el nombre completo de un perfil
   */
  async getProfileFullName(id: string): Promise<string> {
    const profile = await this.getProfileById(id);
    return profile.getFullName();
  }
}
