import { User, UserRole } from '@/modules/users/domain/entities/user.entity';

/**
 * Interfaz del servicio de dominio de usuarios
 *
 * Define los contratos para la lógica de negocio relacionada con usuarios
 * sin depender de implementaciones específicas.
 */
export interface IUserDomainService {
  /**
   * Valida si un email es válido y único
   */
  validateEmail(email: string): Promise<boolean>;

  /**
   * Valida si una contraseña cumple con los requisitos de seguridad
   */
  validatePassword(password: string): boolean;

  /**
   * Encripta una contraseña
   */
  hashPassword(password: string): Promise<string>;

  /**
   * Verifica si una contraseña coincide con su hash
   */
  verifyPassword(password: string, hash: string): Promise<boolean>;

  /**
   * Genera un token de verificación de email
   */
  generateEmailVerificationToken(): string;

  /**
   * Valida un token de verificación de email
   */
  validateEmailVerificationToken(token: string): boolean;

  /**
   * Verifica si un usuario puede realizar una acción específica
   */
  canPerformAction(user: User, action: string): boolean;

  /**
   * Verifica si un usuario puede modificar a otro usuario
   */
  canModifyUser(currentUser: User, targetUser: User): boolean;

  /**
   * Obtiene los permisos de un rol específico
   */
  getRolePermissions(role: UserRole): string[];

  /**
   * Valida si un rol es válido
   */
  isValidRole(role: string): boolean;

  /**
   * Obtiene el rol por defecto para nuevos usuarios
   */
  getDefaultRole(): UserRole;

  /**
   * Valida la información básica de un usuario
   */
  validateUserInfo(params: {
    firstName: string;
    lastName: string;
    email: string;
  }): {
    isValid: boolean;
    errors: string[];
  };
}
