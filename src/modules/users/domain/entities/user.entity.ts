/**
 * Genera un ID único simple
 */
function createId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Entidad User - Representa un usuario en el dominio de negocio
 *
 * Esta entidad encapsula la lógica de negocio relacionada con los usuarios
 * y es independiente de la infraestructura de persistencia.
 * Los datos personales están en la entidad Profile relacionada.
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
    this.id = params.id ?? createId();
    this.email = params.email;
    this.password = params.password;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  /**
   * Verifica si el email es válido
   */
  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  /**
   * Verifica si la contraseña cumple con los requisitos mínimos
   */
  isValidPassword(): boolean {
    return this.password.length >= 8;
  }

  /**
   * Actualiza el email del usuario
   */
  updateEmail(newEmail: string): void {
    this.email = newEmail;
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
