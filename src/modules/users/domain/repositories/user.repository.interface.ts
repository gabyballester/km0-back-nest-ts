import { User } from '@/modules/users/domain/entities/user.entity';

/**
 * Interfaz del repositorio de usuarios
 *
 * Define los contratos para la persistencia de usuarios sin depender
 * de una implementación específica de base de datos.
 */
export interface IUserRepository {
  /**
   * Crea un nuevo usuario
   */
  create(user: User): Promise<User>;

  /**
   * Busca un usuario por su ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Busca un usuario por su email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Busca todos los usuarios con opciones de paginación
   */
  findAll(
    page?: number,
    limit?: number,
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

  /**
   * Actualiza un usuario existente
   */
  update(id: string, user: Partial<User>): Promise<User | null>;

  /**
   * Elimina un usuario
   */
  delete(id: string): Promise<void>;

  /**
   * Verifica si existe un usuario con el email dado
   */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * Cuenta el total de usuarios
   */
  count(): Promise<number>;
}
