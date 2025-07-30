/**
 * Entidad User - Representa un usuario en el dominio de negocio
 *
 * Esta entidad encapsula ÚNICAMENTE la lógica de negocio relacionada con los usuarios
 * y es independiente de la infraestructura de persistencia.
 *
 * Responsabilidades:
 * - Lógica de negocio específica del usuario
 * - Reglas de dominio (no validaciones de formato)
 * - Comportamientos del usuario
 *
 * NO incluye:
 * - Validaciones de formato (responsabilidad de DTOs)
 * - Lógica de persistencia (responsabilidad de repositorios)
 * - Conversiones de datos (responsabilidad de adaptadores)
 */
export class User {
  public readonly id: string;
  public email: string;
  public password: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(params: {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id ?? this.generateId();
    this.email = params.email;
    this.password = params.password;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  /**
   * Genera un ID único para el usuario
   * Lógica de negocio: cómo se generan los IDs en el dominio
   */
  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Verifica si el usuario puede cambiar su email
   * Lógica de negocio: reglas para cambios de email
   */
  canChangeEmail(): boolean {
    // Ejemplo: no permitir cambios si el usuario está bloqueado
    // Esta es lógica de negocio, no validación de formato
    return true; // Implementar según reglas de negocio
  }

  /**
   * Verifica si el usuario puede cambiar su contraseña
   * Lógica de negocio: reglas para cambios de contraseña
   */
  canChangePassword(): boolean {
    // Ejemplo: verificar si no ha cambiado la contraseña recientemente
    const lastPasswordChange = this.updatedAt;
    const minDaysBetweenChanges = 1;
    const daysSinceLastChange =
      (Date.now() - lastPasswordChange.getTime()) / (1000 * 60 * 60 * 24);

    return daysSinceLastChange >= minDaysBetweenChanges;
  }

  /**
   * Actualiza el email del usuario
   * Lógica de negocio: cómo se actualiza el email
   */
  updateEmail(newEmail: string): void {
    if (!this.canChangeEmail()) {
      throw new Error('No se puede cambiar el email en este momento');
    }

    this.email = newEmail;
    this.updatedAt = new Date();
  }

  /**
   * Cambia la contraseña del usuario
   * Lógica de negocio: cómo se cambia la contraseña
   */
  changePassword(newPassword: string): void {
    if (!this.canChangePassword()) {
      throw new Error('No se puede cambiar la contraseña tan frecuentemente');
    }

    this.password = newPassword;
    this.updatedAt = new Date();
  }

  /**
   * Verifica si el usuario es reciente (creado en los últimos 30 días)
   * Lógica de negocio: clasificación de usuarios
   */
  isRecentUser(): boolean {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.createdAt > thirtyDaysAgo;
  }

  /**
   * Obtiene la edad del usuario en días
   * Lógica de negocio: cálculo de métricas del usuario
   */
  getUserAgeInDays(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Convierte la entidad a un objeto plano para persistencia
   * NOTA: Esta responsabilidad debería estar en el adaptador de persistencia
   * Se mantiene por compatibilidad temporal
   */
  toJSON(): Record<string, string | Date> {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Crea una instancia de User desde datos de persistencia
   * NOTA: Esta responsabilidad debería estar en el adaptador de persistencia
   * Se mantiene por compatibilidad temporal
   */
  static fromJSON(data: {
    id: string;
    email: string;
    password: string;
    createdAt: string | Date;
    updatedAt: string | Date;
  }): User {
    return new User({
      id: data.id,
      email: data.email,
      password: data.password,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }
}
