import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ProfileService } from '@/modules/users/application/services/profile.service';
import {
  CreateProfileDto,
  UpdateProfileDto,
  ProfileFiltersDto,
  ProfilePaginationDto,
  ProfileResponseDto,
  ProfileListResponseDto,
  ProfileStatsResponseDto,
} from '@/modules/users/application/dto/profile.dto';
import { Profile } from '@/modules/users/domain/entities/profile.entity';

/**
 * Controlador para la gestión de perfiles de usuario
 * Proporciona endpoints REST para operaciones CRUD de perfiles
 */
@ApiTags('Profiles')
@Controller('profiles')
@UsePipes(new ValidationPipe({ transform: true }))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Crea un nuevo perfil
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo perfil',
    description: 'Crea un nuevo perfil para un usuario específico',
  })
  @ApiBody({
    type: CreateProfileDto,
    description: 'Datos del perfil a crear',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Perfil creado exitosamente',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Ya existe un perfil para este usuario',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  async createProfile(
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileService.createProfile(createProfileDto);
    return this.mapToResponseDto(profile);
  }

  /**
   * Obtiene un perfil por ID
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener perfil por ID',
    description: 'Obtiene un perfil específico por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del perfil',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Perfil encontrado',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Perfil no encontrado',
  })
  async getProfileById(@Param('id') id: string): Promise<ProfileResponseDto> {
    const profile = await this.profileService.getProfileById(id);
    return this.mapToResponseDto(profile);
  }

  /**
   * Obtiene un perfil por ID de usuario
   */
  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener perfil por ID de usuario',
    description: 'Obtiene el perfil asociado a un usuario específico',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Perfil encontrado',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Perfil no encontrado',
  })
  async getProfileByUserId(
    @Param('userId') userId: string,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileService.getProfileByUserId(userId);
    return this.mapToResponseDto(profile);
  }

  /**
   * Obtiene todos los perfiles con paginación y filtros
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener todos los perfiles',
    description:
      'Obtiene una lista paginada de perfiles con filtros opcionales',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Elementos por página',
    example: 10,
  })
  @ApiQuery({
    name: 'city',
    required: false,
    description: 'Filtrar por ciudad',
    example: 'Madrid',
  })
  @ApiQuery({
    name: 'language',
    required: false,
    description: 'Filtrar por idioma',
    example: 'es',
  })
  @ApiQuery({
    name: 'isComplete',
    required: false,
    description: 'Filtrar por completitud',
    example: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de perfiles obtenida exitosamente',
    type: ProfileListResponseDto,
  })
  async getAllProfiles(
    @Query() pagination: ProfilePaginationDto,
    @Query() filters: ProfileFiltersDto,
  ): Promise<ProfileListResponseDto> {
    const result = await this.profileService.getAllProfiles(
      pagination,
      filters,
    );

    return {
      profiles: result.profiles.map(profile => this.mapToResponseDto(profile)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  /**
   * Actualiza un perfil por ID
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar perfil por ID',
    description: 'Actualiza un perfil específico por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del perfil',
    example: 'clx1234567890abcdef',
  })
  @ApiBody({
    type: UpdateProfileDto,
    description: 'Datos del perfil a actualizar',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Perfil actualizado exitosamente',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Perfil no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileService.updateProfile(
      id,
      updateProfileDto,
    );
    return this.mapToResponseDto(profile);
  }

  /**
   * Actualiza un perfil por ID de usuario
   */
  @Put('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar perfil por ID de usuario',
    description: 'Actualiza el perfil asociado a un usuario específico',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    example: 'clx1234567890abcdef',
  })
  @ApiBody({
    type: UpdateProfileDto,
    description: 'Datos del perfil a actualizar',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Perfil actualizado exitosamente',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Perfil no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  async updateProfileByUserId(
    @Param('userId') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileService.updateProfileByUserId(
      userId,
      updateProfileDto,
    );
    return this.mapToResponseDto(profile);
  }

  /**
   * Elimina un perfil por ID
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar perfil por ID',
    description: 'Elimina un perfil específico por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del perfil',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Perfil eliminado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Perfil no encontrado',
  })
  async deleteProfile(@Param('id') id: string): Promise<void> {
    await this.profileService.deleteProfile(id);
  }

  /**
   * Elimina un perfil por ID de usuario
   */
  @Delete('user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar perfil por ID de usuario',
    description: 'Elimina el perfil asociado a un usuario específico',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Perfil eliminado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Perfil no encontrado',
  })
  async deleteProfileByUserId(@Param('userId') userId: string): Promise<void> {
    await this.profileService.deleteProfileByUserId(userId);
  }

  /**
   * Obtiene estadísticas de perfiles
   */
  @Get('stats/overview')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener estadísticas de perfiles',
    description: 'Obtiene estadísticas generales sobre los perfiles',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estadísticas obtenidas exitosamente',
    type: ProfileStatsResponseDto,
  })
  async getProfileStats(): Promise<ProfileStatsResponseDto> {
    return await this.profileService.getProfileStats();
  }

  /**
   * Obtiene perfiles por ciudad
   */
  @Get('city/:city')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener perfiles por ciudad',
    description: 'Obtiene todos los perfiles de una ciudad específica',
  })
  @ApiParam({
    name: 'city',
    description: 'Nombre de la ciudad',
    example: 'Madrid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Perfiles encontrados',
    type: [ProfileResponseDto],
  })
  async getProfilesByCity(
    @Param('city') city: string,
  ): Promise<ProfileResponseDto[]> {
    const profiles = await this.profileService.getProfilesByCity(city);
    return profiles.map(profile => this.mapToResponseDto(profile));
  }

  /**
   * Obtiene perfiles por idioma
   */
  @Get('language/:language')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener perfiles por idioma',
    description: 'Obtiene todos los perfiles que usan un idioma específico',
  })
  @ApiParam({
    name: 'language',
    description: 'Código de idioma',
    example: 'es',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Perfiles encontrados',
    type: [ProfileResponseDto],
  })
  async getProfilesByLanguage(
    @Param('language') language: string,
  ): Promise<ProfileResponseDto[]> {
    const profiles = await this.profileService.getProfilesByLanguage(language);
    return profiles.map(profile => this.mapToResponseDto(profile));
  }

  /**
   * Obtiene perfiles completos
   */
  @Get('complete/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener perfiles completos',
    description: 'Obtiene todos los perfiles que están completos',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Perfiles completos encontrados',
    type: [ProfileResponseDto],
  })
  async getCompleteProfiles(): Promise<ProfileResponseDto[]> {
    const profiles = await this.profileService.getCompleteProfiles();
    return profiles.map(profile => this.mapToResponseDto(profile));
  }

  /**
   * Obtiene el porcentaje de completitud de un perfil
   */
  @Get(':id/completion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener porcentaje de completitud',
    description: 'Obtiene el porcentaje de completitud de un perfil específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del perfil',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Porcentaje de completitud',
    schema: {
      type: 'object',
      properties: {
        completionPercentage: {
          type: 'number',
          example: 80,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Perfil no encontrado',
  })
  async getProfileCompletionPercentage(
    @Param('id') id: string,
  ): Promise<{ completionPercentage: number }> {
    const percentage =
      await this.profileService.getProfileCompletionPercentage(id);
    return { completionPercentage: percentage };
  }

  /**
   * Obtiene el nombre completo de un perfil
   */
  @Get(':id/full-name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener nombre completo',
    description: 'Obtiene el nombre completo de un perfil específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del perfil',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Nombre completo',
    schema: {
      type: 'object',
      properties: {
        fullName: {
          type: 'string',
          example: 'Juan Pérez',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Perfil no encontrado',
  })
  async getProfileFullName(
    @Param('id') id: string,
  ): Promise<{ fullName: string }> {
    const fullName = await this.profileService.getProfileFullName(id);
    return { fullName };
  }

  /**
   * Verifica si existe un perfil para un usuario
   */
  @Get('exists/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verificar existencia de perfil',
    description: 'Verifica si existe un perfil para un usuario específico',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resultado de la verificación',
    schema: {
      type: 'object',
      properties: {
        exists: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  async profileExists(
    @Param('userId') userId: string,
  ): Promise<{ exists: boolean }> {
    const exists = await this.profileService.profileExists(userId);
    return { exists };
  }

  /**
   * Mapea una entidad Profile a ProfileResponseDto
   */
  private mapToResponseDto(profile: Profile): ProfileResponseDto {
    return {
      id: profile.id,
      userId: profile.userId,
      firstName: profile.firstName,
      lastName1: profile.lastName1,
      lastName2: profile.lastName2,
      phone: profile.phone,
      language: profile.language,
      city: profile.city,
      postalCode: profile.postalCode,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      fullName: profile.getFullName(),
      isComplete: profile.isComplete(),
      completionPercentage: profile.getCompletionPercentage(),
    };
  }
}
