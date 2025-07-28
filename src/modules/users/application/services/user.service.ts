import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { User, UserRole } from '@/modules/users/domain/entities/user.entity';
import { UserRepository } from '@/modules/users/infrastructure/repositories/user.repository';
import { UserDomainService } from '@/modules/users/infrastructure/services/user-domain.service';
import { CreateUserDto } from '@/modules/users/application/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/application/dto/update-user.dto';
import {
  UserResponseDto,
  UsersPaginatedResponseDto,
} from '@/modules/users/application/dto/user-response.dto';

/**
 * Servicio de aplicación para usuarios
 *
 * Orquesta la lógica de negocio y coordina entre el dominio y la infraestructura
 */
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userDomainService: UserDomainService,
  ) {}

  /**
   * Crea un nuevo usuario
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Validar email único
    const emailExists = await this.userRepository.existsByEmail(
      createUserDto.email,
    );
    if (emailExists) {
      throw new ConflictException('El email ya está registrado');
    }

    // Validar información del usuario
    const validation = this.userDomainService.validateUserInfo({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
    });

    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(', '));
    }

    // Validar contraseña
    if (!this.userDomainService.validatePassword(createUserDto.password)) {
      throw new BadRequestException(
        'La contraseña no cumple con los requisitos de seguridad',
      );
    }

    // Encriptar contraseña
    const hashedPassword = await this.userDomainService.hashPassword(
      createUserDto.password,
    );

    // Crear entidad de usuario
    const user = new User({
      email: createUserDto.email,
      password: hashedPassword,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      role: createUserDto.role ?? this.userDomainService.getDefaultRole(),
      isActive: createUserDto.isActive ?? true,
    });

    // Guardar usuario
    const savedUser = await this.userRepository.create(user);

    return this.mapToResponseDto(savedUser);
  }

  /**
   * Obtiene un usuario por ID
   */
  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.mapToResponseDto(user);
  }

  /**
   * Obtiene un usuario por email
   */
  async getUserByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.mapToResponseDto(user);
  }

  /**
   * Obtiene todos los usuarios con paginación
   */
  async getAllUsers(options?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    role?: string;
  }): Promise<UsersPaginatedResponseDto> {
    const result = await this.userRepository.findAll(options);

    return {
      users: result.users.map(user => this.mapToResponseDto(user)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  /**
   * Actualiza un usuario
   */
  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // Verificar que el usuario existe
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Validar email único si se está actualizando
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.userRepository.existsByEmail(
        updateUserDto.email,
      );
      if (emailExists) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    // Validar rol si se está actualizando
    if (
      updateUserDto.role &&
      !this.userDomainService.isValidRole(updateUserDto.role)
    ) {
      throw new BadRequestException('Rol inválido');
    }

    // Actualizar usuario
    const updatedUser = await this.userRepository.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('Error al actualizar el usuario');
    }

    return this.mapToResponseDto(updatedUser);
  }

  /**
   * Elimina un usuario (soft delete)
   */
  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new BadRequestException('Error al eliminar el usuario');
    }
  }

  /**
   * Activa un usuario
   */
  async activateUser(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.activate(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.mapToResponseDto(user);
  }

  /**
   * Desactiva un usuario
   */
  async deactivateUser(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.deactivate(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.mapToResponseDto(user);
  }

  /**
   * Cambia el rol de un usuario
   */
  async changeUserRole(id: string, role: UserRole): Promise<UserResponseDto> {
    if (!this.userDomainService.isValidRole(role)) {
      throw new BadRequestException('Rol inválido');
    }

    const user = await this.userRepository.changeRole(id, role);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.mapToResponseDto(user);
  }

  /**
   * Cambia la contraseña de un usuario
   */
  async changeUserPassword(
    id: string,
    newPassword: string,
  ): Promise<UserResponseDto> {
    if (!this.userDomainService.validatePassword(newPassword)) {
      throw new BadRequestException(
        'La contraseña no cumple con los requisitos de seguridad',
      );
    }

    const hashedPassword =
      await this.userDomainService.hashPassword(newPassword);
    const user = await this.userRepository.changePassword(id, hashedPassword);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.mapToResponseDto(user);
  }

  /**
   * Obtiene usuarios por rol
   */
  async getUsersByRole(role: string): Promise<UserResponseDto[]> {
    if (!this.userDomainService.isValidRole(role)) {
      throw new BadRequestException('Rol inválido');
    }

    const users = await this.userRepository.findByRole(role);
    return users.map(user => this.mapToResponseDto(user));
  }

  /**
   * Obtiene usuarios activos
   */
  async getActiveUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findActiveUsers();
    return users.map(user => this.mapToResponseDto(user));
  }

  /**
   * Cuenta usuarios
   */
  async countUsers(options?: {
    isActive?: boolean;
    role?: string;
  }): Promise<number> {
    return this.userRepository.count(options);
  }

  /**
   * Mapea una entidad User a UserResponseDto
   */
  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      isActive: user.isActive,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
