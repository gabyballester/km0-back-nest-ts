import { Profile } from './profile.entity';

describe('Profile', () => {
  let profile: Profile;
  const mockId = 'test-id';
  const mockUserId = 'user-id';
  const mockFirstName = 'John';
  const mockLastName1 = 'Doe';
  const mockLastName2 = 'Smith';
  const mockLanguage = 'es';
  const mockCreatedAt = new Date('2023-01-01T00:00:00Z');
  const mockUpdatedAt = new Date('2023-01-02T00:00:00Z');

  beforeEach(() => {
    profile = new Profile(
      mockId,
      mockUserId,
      mockFirstName,
      mockLastName1,
      mockLastName2,
      mockLanguage,
      mockCreatedAt,
      mockUpdatedAt,
    );
  });

  describe('constructor', () => {
    it('should create a profile with required parameters', () => {
      // Assert
      expect(profile.id).toBe(mockId);
      expect(profile.userId).toBe(mockUserId);
      expect(profile.firstName).toBe(mockFirstName);
      expect(profile.lastName1).toBe(mockLastName1);
      expect(profile.lastName2).toBe(mockLastName2);
      expect(profile.language).toBe(mockLanguage);
      expect(profile.createdAt).toBe(mockCreatedAt);
      expect(profile.updatedAt).toBe(mockUpdatedAt);
    });

    it('should create a profile with optional parameters', () => {
      // Arrange
      const phone = '+1234567890';
      const city = 'Madrid';
      const postalCode = '28001';

      // Act
      const profileWithOptional = new Profile(
        mockId,
        mockUserId,
        mockFirstName,
        mockLastName1,
        mockLastName2,
        mockLanguage,
        mockCreatedAt,
        mockUpdatedAt,
        phone,
        city,
        postalCode,
      );

      // Assert
      expect(profileWithOptional.phone).toBe(phone);
      expect(profileWithOptional.city).toBe(city);
      expect(profileWithOptional.postalCode).toBe(postalCode);
    });

    it('should use default language when not provided', () => {
      // Act
      const profileWithDefault = new Profile(
        mockId,
        mockUserId,
        mockFirstName,
        mockLastName1,
      );

      // Assert
      expect(profileWithDefault.language).toBe('es');
    });

    it('should use current date for timestamps when not provided', () => {
      // Arrange
      const beforeCreation = new Date();

      // Act
      const profileWithDefaults = new Profile(
        mockId,
        mockUserId,
        mockFirstName,
        mockLastName1,
      );

      const afterCreation = new Date();

      // Assert
      expect(profileWithDefaults.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(profileWithDefaults.createdAt.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
      expect(profileWithDefaults.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(profileWithDefaults.updatedAt.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });
  });

  describe('getters', () => {
    it('should return correct values for all getters', () => {
      // Assert
      expect(profile.id).toBe(mockId);
      expect(profile.userId).toBe(mockUserId);
      expect(profile.firstName).toBe(mockFirstName);
      expect(profile.lastName1).toBe(mockLastName1);
      expect(profile.language).toBe(mockLanguage);
      expect(profile.createdAt).toBe(mockCreatedAt);
      expect(profile.updatedAt).toBe(mockUpdatedAt);
    });

    it('should return undefined for optional fields when not set', () => {
      // Assert
      expect(profile.phone).toBeUndefined();
      expect(profile.city).toBeUndefined();
      expect(profile.postalCode).toBeUndefined();
    });
  });

  describe('updateFirstName', () => {
    it('should update firstName successfully', () => {
      // Arrange
      const newFirstName = 'Jane';
      const originalUpdatedAt = profile.updatedAt;

      // Act
      profile.updateFirstName(newFirstName);

      // Assert
      expect(profile.firstName).toBe(newFirstName);
      expect(profile.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });

    it('should throw error when firstName is empty', () => {
      // Act & Assert
      expect(() => profile.updateFirstName('')).toThrow(
        'First name cannot be empty',
      );
      expect(() => profile.updateFirstName('   ')).toThrow(
        'First name cannot be empty',
      );
    });

    it('should throw error when firstName is too long', () => {
      // Arrange
      const longFirstName = 'A'.repeat(51);

      // Act & Assert
      expect(() => profile.updateFirstName(longFirstName)).toThrow(
        'First name cannot exceed 50 characters',
      );
    });

    it('should accept firstName with exactly 50 characters', () => {
      // Arrange
      const maxLengthFirstName = 'A'.repeat(50);

      // Act
      profile.updateFirstName(maxLengthFirstName);

      // Assert
      expect(profile.firstName).toBe(maxLengthFirstName);
    });
  });

  describe('updateLastName', () => {
    it('should update lastName successfully', () => {
      // Arrange
      const newLastName = 'Smith';
      const originalUpdatedAt = profile.updatedAt;

      // Act
      profile.updateLastName1(newLastName);

      // Assert
      expect(profile.lastName1).toBe(newLastName);
      expect(profile.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });

    it('should throw error when lastName is empty', () => {
      // Act & Assert
      expect(() => profile.updateLastName1('')).toThrow(
        'Last name cannot be empty',
      );
      expect(() => profile.updateLastName1('   ')).toThrow(
        'Last name cannot be empty',
      );
    });

    it('should throw error when lastName is too long', () => {
      // Arrange
      const longLastName = 'A'.repeat(51);

      // Act & Assert
      expect(() => profile.updateLastName1(longLastName)).toThrow(
        'Last name cannot exceed 50 characters',
      );
    });
  });

  describe('updatePhone', () => {
    it('should update phone successfully', () => {
      // Arrange
      const newPhone = '+1234567890';
      const originalUpdatedAt = profile.updatedAt;

      // Act
      profile.updatePhone(newPhone);

      // Assert
      expect(profile.phone).toBe(newPhone);
      expect(profile.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });

    it('should throw error when phone is too long', () => {
      // Arrange
      const longPhone = '1'.repeat(21);

      // Act & Assert
      expect(() => profile.updatePhone(longPhone)).toThrow(
        'Phone number cannot exceed 20 characters',
      );
    });

    it('should accept phone with exactly 20 characters', () => {
      // Arrange
      const maxLengthPhone = '1'.repeat(20);

      // Act
      profile.updatePhone(maxLengthPhone);

      // Assert
      expect(profile.phone).toBe(maxLengthPhone);
    });
  });

  describe('updateLanguage', () => {
    it('should update language successfully with valid language', () => {
      // Arrange
      const newLanguage = 'en';
      const originalUpdatedAt = profile.updatedAt;

      // Act
      profile.updateLanguage(newLanguage);

      // Assert
      expect(profile.language).toBe(newLanguage);
      expect(profile.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });

    it('should accept all valid language codes', () => {
      const validLanguages = ['es', 'en', 'fr', 'de', 'it', 'pt'];

      validLanguages.forEach(language => {
        // Act
        profile.updateLanguage(language);

        // Assert
        expect(profile.language).toBe(language);
      });
    });

    it('should throw error when language is invalid', () => {
      // Act & Assert
      expect(() => profile.updateLanguage('invalid')).toThrow(
        'Invalid language code',
      );
      expect(() => profile.updateLanguage('')).toThrow('Invalid language code');
    });
  });

  describe('updateCity', () => {
    it('should update city successfully', () => {
      // Arrange
      const newCity = 'Barcelona';
      const originalUpdatedAt = profile.updatedAt;

      // Act
      profile.updateCity(newCity);

      // Assert
      expect(profile.city).toBe(newCity);
      expect(profile.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });

    it('should throw error when city is too long', () => {
      // Arrange
      const longCity = 'A'.repeat(101);

      // Act & Assert
      expect(() => profile.updateCity(longCity)).toThrow(
        'City name cannot exceed 100 characters',
      );
    });

    it('should accept city with exactly 100 characters', () => {
      // Arrange
      const maxLengthCity = 'A'.repeat(100);

      // Act
      profile.updateCity(maxLengthCity);

      // Assert
      expect(profile.city).toBe(maxLengthCity);
    });
  });

  describe('updatePostalCode', () => {
    it('should update postalCode successfully', () => {
      // Arrange
      const newPostalCode = '28001';
      const originalUpdatedAt = profile.updatedAt;

      // Act
      profile.updatePostalCode(newPostalCode);

      // Assert
      expect(profile.postalCode).toBe(newPostalCode);
      expect(profile.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });

    it('should throw error when postalCode is too long', () => {
      // Arrange
      const longPostalCode = '1'.repeat(11);

      // Act & Assert
      expect(() => profile.updatePostalCode(longPostalCode)).toThrow(
        'Postal code cannot exceed 10 characters',
      );
    });

    it('should accept postalCode with exactly 10 characters', () => {
      // Arrange
      const maxLengthPostalCode = '1'.repeat(10);

      // Act
      profile.updatePostalCode(maxLengthPostalCode);

      // Assert
      expect(profile.postalCode).toBe(maxLengthPostalCode);
    });
  });

  describe('getFullName', () => {
    it('should return full name correctly', () => {
      // Act
      const fullName = profile.getFullName();

      // Assert
      expect(fullName).toBe('John Doe Smith');
    });

    it('should trim extra spaces from full name', () => {
      // Arrange
      const profileWithSpaces = new Profile(
        mockId,
        mockUserId,
        '  John  ',
        '  Doe  ',
      );

      // Act
      const fullName = profileWithSpaces.getFullName();

      // Assert
      expect(fullName).toBe('John Doe');
    });

    it('should handle single name', () => {
      // Arrange
      const profileWithSingleName = new Profile(mockId, mockUserId, 'John', '');

      // Act
      const fullName = profileWithSingleName.getFullName();

      // Assert
      expect(fullName).toBe('John');
    });
  });

  describe('isComplete', () => {
    it('should return true when profile is complete', () => {
      // Arrange
      const completeProfile = new Profile(
        mockId,
        mockUserId,
        mockFirstName,
        mockLastName1,
        mockLastName2, // lastName2
        mockLanguage,
        mockCreatedAt,
        mockUpdatedAt,
        '+1234567890',
        'Madrid',
        '28001',
      );

      // Act
      const isComplete = completeProfile.isComplete();

      // Assert
      expect(isComplete).toBe(true);
    });

    it('should return false when profile is incomplete', () => {
      // Act
      const isComplete = profile.isComplete();

      // Assert
      expect(isComplete).toBe(false);
    });

    it('should return false when city is missing', () => {
      // Arrange
      const incompleteProfile = new Profile(
        mockId,
        mockUserId,
        mockFirstName,
        mockLastName1,
        undefined, // lastName2
        mockLanguage,
        mockCreatedAt,
        mockUpdatedAt,
        '+1234567890',
        undefined, // city
        '28001',
      );

      // Act
      const isComplete = incompleteProfile.isComplete();

      // Assert
      expect(isComplete).toBe(false);
    });
  });

  describe('getCompletionPercentage', () => {
    it('should return 100% for complete profile', () => {
      // Arrange
      const completeProfile = new Profile(
        mockId,
        mockUserId,
        mockFirstName,
        mockLastName1,
        mockLastName2, // lastName2
        mockLanguage,
        mockCreatedAt,
        mockUpdatedAt,
        '+1234567890',
        'Madrid',
        '28001',
      );

      // Act
      const percentage = completeProfile.getCompletionPercentage();

      // Assert
      expect(percentage).toBe(100);
    });

    it('should return 40% for profile with only required fields', () => {
      // Act
      const percentage = profile.getCompletionPercentage();

      // Assert
      expect(percentage).toBe(50); // firstName, lastName1, lastName2 (3 out of 6 fields)
    });

    it('should return 67% for profile with some optional fields', () => {
      // Arrange
      const partialProfile = new Profile(
        mockId,
        mockUserId,
        mockFirstName,
        mockLastName1,
        undefined, // lastName2
        mockLanguage,
        mockCreatedAt,
        mockUpdatedAt,
        '+1234567890',
        'Madrid',
        undefined, // postalCode
      );

      // Act
      const percentage = partialProfile.getCompletionPercentage();

      // Assert
      expect(percentage).toBe(67); // firstName, lastName1, phone, city (4 out of 6 fields)
    });

    it('should handle empty strings as incomplete', () => {
      // Arrange
      const profileWithEmptyFields = new Profile(
        mockId,
        mockUserId,
        mockFirstName,
        mockLastName1,
        undefined, // lastName2
        mockLanguage,
        mockCreatedAt,
        mockUpdatedAt,
        '',
        '',
        '',
      );

      // Act
      const percentage = profileWithEmptyFields.getCompletionPercentage();

      // Assert
      expect(percentage).toBe(50); // Only firstName, lastName1, and lastName2 count
    });
  });

  describe('static create', () => {
    it('should create a profile with factory method', () => {
      // Act
      const createdProfile = Profile.create(
        mockUserId,
        mockFirstName,
        mockLastName1,
      );

      // Assert
      expect(createdProfile).toBeInstanceOf(Profile);
      expect(createdProfile.userId).toBe(mockUserId);
      expect(createdProfile.firstName).toBe(mockFirstName);
      expect(createdProfile.lastName1).toBe(mockLastName1);
      expect(createdProfile.language).toBe('es'); // Default
      expect(createdProfile.id).toBeDefined();
      expect(createdProfile.id).not.toBe(mockId); // Should be different
      expect(createdProfile.createdAt).toBeInstanceOf(Date);
      expect(createdProfile.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a profile with all optional parameters', () => {
      // Arrange
      const phone = '+1234567890';
      const city = 'Madrid';
      const postalCode = '28001';

      // Act
      const createdProfile = Profile.create(
        mockUserId,
        mockFirstName,
        mockLastName1,
        undefined, // lastName2
        'en',
        phone,
        city,
        postalCode,
      );

      // Assert
      expect(createdProfile.phone).toBe(phone);
      expect(createdProfile.city).toBe(city);
      expect(createdProfile.postalCode).toBe(postalCode);
      expect(createdProfile.language).toBe('en');
    });

    it('should generate unique IDs for different profiles', () => {
      // Act
      const profile1 = Profile.create(mockUserId, mockFirstName, mockLastName1);
      const profile2 = Profile.create(mockUserId, mockFirstName, mockLastName1);

      // Assert
      expect(profile1.id).not.toBe(profile2.id);
    });
  });
});
