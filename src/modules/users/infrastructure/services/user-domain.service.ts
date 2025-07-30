import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@/modules/users/domain/entities/user.entity';
import { IUserDomainService } from '@/modules/users/domain/services/user.service.interface';
import { UserRepository } from '@/modules/users/infrastructure/repositories/user.repository';

/**
 * Implementación del servicio de dominio para usuarios
 */
@Injectable()
export class UserDomainService implements IUserDomainService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Valida si un email es válido y único
   */
  async validateEmail(email: string): Promise<boolean> {
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    // Verificar que no existe
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const exists = await this.userRepository.existsByEmail(email);
    return !exists;
  }

  /**
   * Valida si una contraseña cumple con los requisitos de seguridad
   */
  validatePassword(password: string): boolean {
    // Mínimo 8 caracteres
    if (password.length < 8) {
      return false;
    }

    // Máximo 128 caracteres
    if (password.length > 128) {
      return false;
    }

    // Debe incluir al menos una minúscula, una mayúscula y un número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    return passwordRegex.test(password);
  }

  /**
   * Encripta una contraseña
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verifica si una contraseña coincide con su hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Genera un token de verificación de email
   */
  generateEmailVerificationToken(): string {
    // Implementación simple - en producción usar JWT o similar
    return (
      Math.random().toString(36).slice(2, 15) +
      Math.random().toString(36).slice(2, 15)
    );
  }

  /**
   * Valida un token de verificación de email
   */
  validateEmailVerificationToken(token: string): boolean {
    // Implementación simple - en producción validar JWT
    return token.length >= 20;
  }

  /**
   * Verifica si un usuario puede realizar una acción específica
   * Por ahora, todos los usuarios pueden realizar todas las acciones
   * TODO: Implementar sistema de roles cuando se añada a la entidad User
   */
  canPerformAction(_user: User, _action: string): boolean {
    // TODO: Implementar lógica de permisos cuando se añadan roles a User
    return true;
  }

  /**
   * Verifica si un usuario puede modificar a otro usuario
   * Por ahora, todos los usuarios pueden modificar a otros
   * TODO: Implementar sistema de roles cuando se añada a la entidad User
   */
  canModifyUser(_currentUser: User, _targetUser: User): boolean {
    // TODO: Implementar lógica de permisos cuando se añadan roles a User
    return true;
  }

  /**
   * Obtiene los permisos de un rol específico
   * TODO: Implementar cuando se añadan roles a la entidad User
   */
  getRolePermissions(_role: string): string[] {
    // TODO: Implementar cuando se añadan roles a la entidad User
    return ['user:read', 'user:write'];
  }

  /**
   * Valida si un rol es válido
   * TODO: Implementar cuando se añadan roles a la entidad User
   */
  isValidRole(role: string): boolean {
    // TODO: Implementar cuando se añadan roles a la entidad User
    return ['user', 'admin', 'moderator'].includes(role);
  }

  /**
   * Obtiene el rol por defecto para nuevos usuarios
   * TODO: Implementar cuando se añadan roles a la entidad User
   */
  getDefaultRole(): string {
    // TODO: Implementar cuando se añadan roles a la entidad User
    return 'user';
  }

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
  } {
    const errors: string[] = [];

    // Validar nombre
    if (!params.firstName || params.firstName.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }
    if (params.firstName && params.firstName.trim().length > 50) {
      errors.push('El nombre no puede exceder 50 caracteres');
    }

    // Validar apellido
    if (!params.lastName || params.lastName.trim().length < 2) {
      errors.push('El apellido debe tener al menos 2 caracteres');
    }
    if (params.lastName && params.lastName.trim().length > 50) {
      errors.push('El apellido no puede exceder 50 caracteres');
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!params.email || !emailRegex.test(params.email)) {
      errors.push('El email debe ser válido');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
