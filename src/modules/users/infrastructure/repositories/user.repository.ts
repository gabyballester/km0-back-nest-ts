import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { IUserRepository } from '@/modules/users/domain/repositories/user.repository.interface';
import { User } from '@/modules/users/domain/entities/user.entity';

/**
 * Implementación del repositorio de usuarios usando Prisma ORM
 */
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crea un nuevo usuario
   */
  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    return User.fromJSON(createdUser);
  }

  /**
   * Busca un usuario por su ID
   */
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? User.fromJSON(user) : null;
  }

  /**
   * Busca un usuario por su email
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? User.fromJSON(user) : null;
  }

  /**
   * Busca todos los usuarios con paginación
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users: users.map(user => User.fromJSON(user)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Actualiza un usuario
   */
  async update(id: string, userData: Partial<User>): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        email: userData.email,
        password: userData.password,
        updatedAt: new Date(),
      },
    });

    return User.fromJSON(updatedUser);
  }

  /**
   * Elimina un usuario
   */
  async delete(id: string): Promise<void> {
    const existingUser = await this.findById(id);
    if (!existingUser) {
      throw new Error(`User with id ${id} not found`);
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Verifica si existe un usuario por email
   */
  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    return !!user;
  }

  /**
   * Cuenta el total de usuarios
   */
  async count(): Promise<number> {
    return await this.prisma.user.count();
  }

  /**
   * Busca usuarios por filtros
   */
  async findByFilters(filters: {
    email?: string;
    createdAt?: Date;
  }): Promise<User[]> {
    const where: {
      email?: { contains: string; mode: 'insensitive' };
      createdAt?: { gte: Date };
    } = {};

    if (filters.email) {
      where.email = { contains: filters.email, mode: 'insensitive' };
    }

    if (filters.createdAt) {
      where.createdAt = { gte: filters.createdAt };
    }

    const users = await this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return users.map(user => User.fromJSON(user));
  }
}
