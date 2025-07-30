import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { User } from '@/modules/users/domain/entities/user.entity';
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
    // Verificar que el email no existe
    const emailExists = await this.userRepository.existsByEmail(
      createUserDto.email,
    );
    if (emailExists) {
      throw new ConflictException('El email ya está registrado');
    }

    // Validar email
    const isEmailValid = await this.userDomainService.validateEmail(
      createUserDto.email,
    );
    if (!isEmailValid) {
      throw new BadRequestException('El email no es válido');
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
  async getAllUsers(
    page?: number,
    limit?: number,
  ): Promise<UsersPaginatedResponseDto> {
    const result = await this.userRepository.findAll(page, limit);

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

    await this.userRepository.delete(id);
  }

  /**
   * Cuenta usuarios
   */
  async countUsers(): Promise<number> {
    return this.userRepository.count();
  }

  /**
   * Mapea una entidad User a UserResponseDto
   */
  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
