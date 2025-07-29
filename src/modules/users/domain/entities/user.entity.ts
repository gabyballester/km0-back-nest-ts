import { createId } from '@paralleldrive/cuid2';

/**
 * Entidad User - Representa un usuario en el dominio de negocio
 *
 * Esta entidad encapsula la lógica de negocio relacionada con los usuarios
 * y es independiente de la infraestructura de persistencia.
 */
export class User {
  public readonly id: string;
  public email: string;
  public password: string;
  public firstName: string;
  public lastName: string;
  public isActive: boolean;
  public role: UserRole;
  public phone?: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(params: {
    id?: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isActive?: boolean;
    role?: UserRole;
    phone?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id ?? createId();
    this.email = params.email;
    this.password = params.password;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.isActive = params.isActive ?? true;
    this.role = params.role ?? UserRole.USER;
    this.phone = params.phone;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  /**
   * Obtiene el nombre completo del usuario
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  /**
   * Verifica si el usuario es administrador
   */
  get isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  /**
   * Verifica si el usuario está activo
   */
  get isUserActive(): boolean {
    return this.isActive;
  }

  /**
   * Desactiva el usuario
   */
  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  /**
   * Activa el usuario
   */
  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  /**
   * Actualiza la información básica del usuario
   */
  updateInfo(params: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }): void {
    if (params.firstName) {
      this.firstName = params.firstName;
    }
    if (params.lastName) {
      this.lastName = params.lastName;
    }
    if (params.email) {
      this.email = params.email;
    }
    if (params.phone) {
      this.phone = params.phone;
    }
    this.updatedAt = new Date();
  }

  /**
   * Cambia el rol del usuario
   */
  changeRole(newRole: UserRole): void {
    this.role = newRole;
    this.updatedAt = new Date();
  }

  /**
   * Cambia la contraseña del usuario
   */
  changePassword(newPassword: string): void {
    this.password = newPassword;
    this.updatedAt = new Date();
  }

  /**
   * Convierte la entidad a un objeto plano para persistencia
   */
  toJSON(): Record<string, string | boolean | Date | undefined> {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      isActive: this.isActive,
      role: this.role,
      phone: this.phone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Crea una instancia de User desde datos de persistencia
   */
  static fromJSON(data: {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    role: string;
    phone?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
  }): User {
    return new User({
      id: data.id,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      isActive: data.isActive,
      role: data.role as UserRole,
      phone: data.phone,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }
}

/**
 * Roles de usuario disponibles
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

/**
 * Tipos de usuario para validación
 */
export type UserRoleType = keyof typeof UserRole;
