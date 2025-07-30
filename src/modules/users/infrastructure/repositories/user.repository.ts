import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { IUserRepository } from '@/modules/users/domain/repositories/user.repository.interface';
import { User } from '@/modules/users/domain/entities/user.entity';
import { UserPersistenceAdapter } from '@/modules/users/infrastructure/adapters/user.persistence.adapter';

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
    const prismaData = UserPersistenceAdapter.toPrismaCreate(user);

    const createdUser = await this.prisma.user.create({
      data: prismaData,
    });

    return UserPersistenceAdapter.fromPrisma(createdUser);
  }

  /**
   * Busca un usuario por su ID
   */
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? UserPersistenceAdapter.fromPrisma(user) : null;
  }

  /**
   * Busca un usuario por su email
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? UserPersistenceAdapter.fromPrisma(user) : null;
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
      users: UserPersistenceAdapter.fromPrismaMany(users),
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
    const updateData = UserPersistenceAdapter.toPrismaUpdate(userData);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    return UserPersistenceAdapter.fromPrisma(updatedUser);
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

    return UserPersistenceAdapter.fromPrismaMany(users);
  }
}
