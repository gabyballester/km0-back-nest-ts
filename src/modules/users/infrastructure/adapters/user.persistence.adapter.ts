import { User } from '@/modules/users/domain/entities/user.entity';
import { Prisma } from '@prisma/client';

/**
 * Adaptador de persistencia para la entidad User
 *
 * Responsabilidades:
 * - Conversión entre entidad de dominio y datos de Prisma
 * - Mapeo de tipos de datos
 * - Adaptación de estructuras de datos
 */
export class UserPersistenceAdapter {
  /**
   * Convierte una entidad User a datos de Prisma para crear
   */
  static toPrismaCreate(user: User): Prisma.UserCreateInput {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Convierte una entidad User a datos de Prisma para actualizar
   */
  static toPrismaUpdate(user: Partial<User>): Prisma.UserUpdateInput {
    const updateData: Prisma.UserUpdateInput = {
      updatedAt: new Date(),
    };

    if (user.email !== undefined) {
      updateData.email = user.email;
    }

    if (user.password !== undefined) {
      updateData.password = user.password;
    }

    return updateData;
  }

  /**
   * Convierte datos de Prisma a entidad User
   */
  static fromPrisma(prismaUser: {
    id: string;
    email: string;
    password: string;
    createdAt: Date | string;
    updatedAt: Date | string;
  }): User {
    return new User({
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      createdAt: new Date(prismaUser.createdAt),
      updatedAt: new Date(prismaUser.updatedAt),
    });
  }

  /**
   * Convierte múltiples datos de Prisma a entidades User
   */
  static fromPrismaMany(
    prismaUsers: Array<{
      id: string;
      email: string;
      password: string;
      createdAt: Date | string;
      updatedAt: Date | string;
    }>,
  ): User[] {
    return prismaUsers.map(user => this.fromPrisma(user));
  }
}
