/**
 * Profile entity representing user profile information
 * Follows Domain-Driven Design principles
 */
export class Profile {
  private readonly _id: string;
  private readonly _userId: string;
  private _firstName: string;
  private _lastName: string;
  private _phone?: string;
  private _language: string;
  private _city?: string;
  private _postalCode?: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    firstName: string,
    lastName: string,
    language: string = 'es',
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    phone?: string,
    city?: string,
    postalCode?: string,
  ) {
    this._id = id;
    this._userId = userId;
    this._firstName = firstName;
    this._lastName = lastName;
    this._language = language;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._phone = phone;
    this._city = city;
    this._postalCode = postalCode;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get phone(): string | undefined {
    return this._phone;
  }

  get language(): string {
    return this._language;
  }

  get city(): string | undefined {
    return this._city;
  }

  get postalCode(): string | undefined {
    return this._postalCode;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business logic methods
  /**
   * Update first name
   */
  updateFirstName(firstName: string): void {
    this.validateFirstName(firstName);
    this._firstName = firstName;
    this._updatedAt = new Date();
  }

  /**
   * Update last name
   */
  updateLastName(lastName: string): void {
    this.validateLastName(lastName);
    this._lastName = lastName;
    this._updatedAt = new Date();
  }

  /**
   * Update phone
   */
  updatePhone(phone: string): void {
    this.validatePhone(phone);
    this._phone = phone;
    this._updatedAt = new Date();
  }

  /**
   * Update language
   */
  updateLanguage(language: string): void {
    this.validateLanguage(language);
    this._language = language;
    this._updatedAt = new Date();
  }

  /**
   * Update city
   */
  updateCity(city: string): void {
    this.validateCity(city);
    this._city = city;
    this._updatedAt = new Date();
  }

  /**
   * Update postal code
   */
  updatePostalCode(postalCode: string): void {
    this.validatePostalCode(postalCode);
    this._postalCode = postalCode;
    this._updatedAt = new Date();
  }

  /**
   * Get full name
   */
  getFullName(): string {
    return `${this._firstName} ${this._lastName}`.replace(/\s+/g, ' ').trim();
  }

  /**
   * Check if profile is complete (has basic information)
   */
  isComplete(): boolean {
    return !!(this._firstName && this._lastName && this._city);
  }

  /**
   * Get profile completion percentage
   */
  getCompletionPercentage(): number {
    const fields = [
      this._firstName,
      this._lastName,
      this._phone,
      this._city,
      this._postalCode,
    ];

    const completedFields = fields.filter(
      field => field !== undefined && field !== null && field !== '',
    ).length;
    return Math.round((completedFields / fields.length) * 100);
  }

  // Validation methods
  private validateFirstName(firstName: string): void {
    if (!firstName || firstName.trim().length === 0) {
      throw new Error('First name cannot be empty');
    }
    if (firstName.length > 50) {
      throw new Error('First name cannot exceed 50 characters');
    }
  }

  private validateLastName(lastName: string): void {
    if (!lastName || lastName.trim().length === 0) {
      throw new Error('Last name cannot be empty');
    }
    if (lastName.length > 50) {
      throw new Error('Last name cannot exceed 50 characters');
    }
  }

  private validatePhone(phone: string): void {
    if (phone && phone.length > 20) {
      throw new Error('Phone number cannot exceed 20 characters');
    }
  }

  private validateLanguage(language: string): void {
    const validLanguages = ['es', 'en', 'fr', 'de', 'it', 'pt'];
    if (!validLanguages.includes(language)) {
      throw new Error('Invalid language code');
    }
  }

  private validateCity(city: string): void {
    if (city && city.length > 100) {
      throw new Error('City name cannot exceed 100 characters');
    }
  }

  private validatePostalCode(postalCode: string): void {
    if (postalCode && postalCode.length > 10) {
      throw new Error('Postal code cannot exceed 10 characters');
    }
  }

  // Factory method
  static create(
    userId: string,
    firstName: string,
    lastName: string,
    language: string = 'es',
    phone?: string,
    city?: string,
    postalCode?: string,
  ): Profile {
    const id = crypto.randomUUID();
    return new Profile(
      id,
      userId,
      firstName,
      lastName,
      language,
      new Date(),
      new Date(),
      phone,
      city,
      postalCode,
    );
  }

  // Factory method to create from JSON data
  static fromJSON(data: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone?: string;
    language: string;
    city?: string;
    postalCode?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
  }): Profile {
    return new Profile(
      data.id,
      data.userId,
      data.firstName,
      data.lastName,
      data.language,
      new Date(data.createdAt),
      new Date(data.updatedAt),
      data.phone,
      data.city,
      data.postalCode,
    );
  }
}
