/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { eq, and, desc, asc, sql } from 'drizzle-orm';
import { User as UserEntity } from '@/modules/users/domain/entities/user.entity';
import { IUserRepository } from '@/modules/users/domain/repositories/user.repository.interface';
import { users } from '@/infrastructure/database/schemas/user.schema';
import { DatabaseService } from '@/infrastructure/database/database.service';

// Tipos específicos para Drizzle
type DrizzleDatabase = any; // TODO: Definir tipo específico cuando esté disponible
type UserInsertData = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};
type UserSelectResult = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Implementación del repositorio de usuarios usando Drizzle ORM
 */
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Helper method to get database instance
   */
  private getDatabase(): DrizzleDatabase {
    const adapter = this.databaseService.getAdapter();
    if (!adapter) {
      throw new Error('Database adapter not available');
    }
    return adapter.getOrmInstance() as DrizzleDatabase;
  }

  /**
   * Crea un nuevo usuario
   */
  async create(user: UserEntity): Promise<UserEntity> {
    const db = this.getDatabase();

    const userData: UserInsertData = {
      id: user.id,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const [createdUser] = await db.insert(users).values(userData).returning();

    return UserEntity.fromJSON(createdUser as UserSelectResult);
  }

  /**
   * Busca un usuario por su ID
   */
  async findById(id: string): Promise<UserEntity | null> {
    const db = this.getDatabase();

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user ? UserEntity.fromJSON(user as UserSelectResult) : null;
  }

  /**
   * Busca un usuario por su email
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    const db = this.getDatabase();

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user ? UserEntity.fromJSON(user as UserSelectResult) : null;
  }

  /**
   * Busca todos los usuarios con opciones de paginación
   */
  async findAll(options?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    role?: string;
  }): Promise<{
    users: UserEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const db = this.getDatabase();

    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const offset = (page - 1) * limit;

    // Construir condiciones de filtro
    const conditions = [];
    if (options?.isActive !== undefined) {
      conditions.push(eq(users.isActive, options.isActive));
    }
    if (options?.role) {
      conditions.push(eq(users.role, options.role));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Obtener usuarios
    const userResults = await db
      .select()
      .from(users)
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    // Obtener total de registros
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause);

    const total = totalResult[0]?.count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      users: userResults.map((user: UserSelectResult) =>
        UserEntity.fromJSON(user),
      ),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Actualiza un usuario
   */
  async update(
    id: string,
    userData: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    const db = this.getDatabase();

    // Preparar datos para actualización
    const updateData: Partial<UserInsertData> = {};
    if (userData.email !== undefined) updateData.email = userData.email;
    if (userData.password !== undefined)
      updateData.password = userData.password;
    if (userData.firstName !== undefined)
      updateData.firstName = userData.firstName;
    if (userData.lastName !== undefined)
      updateData.lastName = userData.lastName;
    if (userData.isActive !== undefined)
      updateData.isActive = userData.isActive;
    if (userData.role !== undefined) updateData.role = userData.role;
    updateData.updatedAt = new Date();

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    return updatedUser
      ? UserEntity.fromJSON(updatedUser as UserSelectResult)
      : null;
  }

  /**
   * Elimina un usuario
   */
  async delete(id: string): Promise<boolean> {
    const db = this.getDatabase();

    const result = await db.delete(users).where(eq(users.id, id)).returning();

    return result.length > 0;
  }

  /**
   * Activa un usuario
   */
  async activate(id: string): Promise<UserEntity | null> {
    const db = this.getDatabase();

    const [activatedUser] = await db
      .update(users)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return activatedUser
      ? UserEntity.fromJSON(activatedUser as UserSelectResult)
      : null;
  }

  /**
   * Desactiva un usuario
   */
  async deactivate(id: string): Promise<UserEntity | null> {
    const db = this.getDatabase();

    const [deactivatedUser] = await db
      .update(users)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return deactivatedUser
      ? UserEntity.fromJSON(deactivatedUser as UserSelectResult)
      : null;
  }

  /**
   * Cambia el rol de un usuario
   */
  async changeRole(id: string, role: string): Promise<UserEntity | null> {
    const db = this.getDatabase();

    const [updatedUser] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return updatedUser
      ? UserEntity.fromJSON(updatedUser as UserSelectResult)
      : null;
  }

  /**
   * Cambia la contraseña de un usuario
   */
  async changePassword(
    id: string,
    newPassword: string,
  ): Promise<UserEntity | null> {
    const db = this.getDatabase();

    const [updatedUser] = await db
      .update(users)
      .set({ password: newPassword, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return updatedUser
      ? UserEntity.fromJSON(updatedUser as UserSelectResult)
      : null;
  }

  /**
   * Verifica si existe un usuario con el email dado
   */
  async existsByEmail(email: string): Promise<boolean> {
    const db = this.getDatabase();

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return !!user;
  }

  /**
   * Busca usuarios por rol
   */
  async findByRole(role: string): Promise<UserEntity[]> {
    const db = this.getDatabase();

    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.role, role))
      .orderBy(asc(users.createdAt));

    return userResults.map((user: UserSelectResult) =>
      UserEntity.fromJSON(user),
    );
  }

  /**
   * Busca usuarios activos
   */
  async findActiveUsers(): Promise<UserEntity[]> {
    const db = this.getDatabase();

    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.isActive, true))
      .orderBy(asc(users.createdAt));

    return userResults.map((user: UserSelectResult) =>
      UserEntity.fromJSON(user),
    );
  }

  /**
   * Cuenta usuarios con filtros opcionales
   */
  async count(options?: {
    isActive?: boolean;
    role?: string;
  }): Promise<number> {
    const db = this.getDatabase();

    // Construir condiciones de filtro
    const conditions = [];
    if (options?.isActive !== undefined) {
      conditions.push(eq(users.isActive, options.isActive));
    }
    if (options?.role) {
      conditions.push(eq(users.role, options.role));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause);

    return result[0]?.count ?? 0;
  }
}
