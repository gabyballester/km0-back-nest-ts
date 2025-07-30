import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from '@/modules/users/application/services/user.service';
import { CreateUserDto } from '@/modules/users/application/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/application/dto/update-user.dto';
import {
  UserResponseDto,
  UsersPaginatedResponseDto,
} from '@/modules/users/application/dto/user-response.dto';
import { UserRole } from '@/shared/constants/user-roles';

/**
 * Controlador para la gestión de usuarios
 */
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Datos del usuario a crear',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o contraseña débil',
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está registrado',
  })
  async createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description:
      'Obtiene una lista paginada de usuarios con opciones de filtrado',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (por defecto: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Elementos por página (por defecto: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filtrar por estado activo',
    example: true,
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: UserRole,
    description: 'Filtrar por rol',
    example: UserRole.USER,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
    type: UsersPaginatedResponseDto,
  })
  async getAllUsers(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<UsersPaginatedResponseDto> {
    return this.userService.getAllUsers(page, limit);
  }

  // TODO: Implementar cuando se añadan los roles a la entidad User
  /*
  @Get('active')
  @ApiOperation({
    summary: 'Obtener usuarios activos',
    description: 'Obtiene una lista de todos los usuarios activos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios activos obtenida exitosamente',
    type: [UserResponseDto],
  })
  async getActiveUsers(): Promise<UserResponseDto[]> {
    return this.userService.getActiveUsers();
  }

  @Get('count')
  @ApiOperation({
    summary: 'Contar usuarios',
    description: 'Cuenta el total de usuarios con opciones de filtrado',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filtrar por estado activo',
    example: true,
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: UserRole,
    description: 'Filtrar por rol',
    example: UserRole.USER,
  })
  @ApiResponse({
    status: 200,
    description: 'Conteo de usuarios',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 100 },
      },
    },
  })
  async countUsers(): Promise<{ count: number }> {
    const count = await this.userService.countUsers();
    return { count };
  }
  */

  // TODO: Implementar cuando se añadan los roles a la entidad User
  /*
  @Get('role/:role')
  @ApiOperation({
    summary: 'Obtener usuarios por rol',
    description: 'Obtiene una lista de usuarios con un rol específico',
  })
  @ApiParam({
    name: 'role',
    enum: UserRole,
    description: 'Rol de los usuarios a obtener',
    example: UserRole.USER,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios por rol obtenida exitosamente',
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Rol inválido',
  })
  async getUsersByRole(
    @Param('role') role: string,
  ): Promise<UserResponseDto[]> {
    return this.userService.getUsersByRole(role);
  }
  */

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener usuario por ID',
    description: 'Obtiene un usuario específico por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario obtenido exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }

  @Get('email/:email')
  @ApiOperation({
    summary: 'Obtener usuario por email',
    description: 'Obtiene un usuario específico por su email',
  })
  @ApiParam({
    name: 'email',
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario obtenido exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getUserByEmail(
    @Param('email') email: string,
  ): Promise<UserResponseDto> {
    return this.userService.getUserByEmail(email);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar usuario',
    description: 'Actualiza la información de un usuario existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a actualizar',
    example: 'clx1234567890abcdef',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Datos del usuario a actualizar',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está registrado',
  })
  async updateUser(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(id, updateUserDto);
  }

  /**
   * Elimina un usuario
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar usuario',
    description: 'Elimina un usuario específico por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario',
    example: 'user_1234567890',
  })
  @ApiResponse({
    status: 204,
    description: 'Usuario eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
