import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para la respuesta de un usuario (sin información sensible)
 */
export class UserResponseDto {
  constructor() {
    this.id = '';
    this.email = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @ApiProperty({
    description: 'ID único del usuario',
    example: 'user_1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del usuario',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}

/**
 * DTO para la respuesta paginada de usuarios
 */
export class UsersPaginatedResponseDto {
  constructor() {
    this.users = [];
    this.total = 0;
    this.page = 1;
    this.limit = 10;
    this.totalPages = 0;
  }

  @ApiProperty({
    description: 'Lista de usuarios',
    type: [UserResponseDto],
  })
  users: UserResponseDto[];

  @ApiProperty({
    description: 'Número total de usuarios',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Página actual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Número de elementos por página',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Número total de páginas',
    example: 10,
  })
  totalPages: number;
}
