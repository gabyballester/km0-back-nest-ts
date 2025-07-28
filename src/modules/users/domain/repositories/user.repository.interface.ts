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
  findAll(options?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    role?: string;
  }): Promise<{
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
   * Elimina un usuario (soft delete)
   */
  delete(id: string): Promise<boolean>;

  /**
   * Activa un usuario
   */
  activate(id: string): Promise<User | null>;

  /**
   * Desactiva un usuario
   */
  deactivate(id: string): Promise<User | null>;

  /**
   * Cambia el rol de un usuario
   */
  changeRole(id: string, role: string): Promise<User | null>;

  /**
   * Cambia la contraseña de un usuario
   */
  changePassword(id: string, newPassword: string): Promise<User | null>;

  /**
   * Verifica si existe un usuario con el email dado
   */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * Busca usuarios por rol
   */
  findByRole(role: string): Promise<User[]>;

  /**
   * Busca usuarios activos
   */
  findActiveUsers(): Promise<User[]>;

  /**
   * Cuenta el total de usuarios
   */
  count(options?: { isActive?: boolean; role?: string }): Promise<number>;
}
