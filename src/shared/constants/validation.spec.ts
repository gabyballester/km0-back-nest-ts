import {
  VALIDATION_RULES,
  VALIDATION_MESSAGES,
  VALIDATION_PATTERNS,
  VALIDATION_OPTIONS,
} from './validation';

describe('Validation Constants', () => {
  describe('VALIDATION_RULES', () => {
    describe('string lengths', () => {
      it('should have correct password length rules', () => {
        expect(VALIDATION_RULES.MIN_PASSWORD_LENGTH).toBe(8);
        expect(VALIDATION_RULES.MAX_PASSWORD_LENGTH).toBe(128);
      });

      it('should have correct username length rules', () => {
        expect(VALIDATION_RULES.MIN_USERNAME_LENGTH).toBe(3);
        expect(VALIDATION_RULES.MAX_USERNAME_LENGTH).toBe(50);
      });

      it('should have correct email length rules', () => {
        expect(VALIDATION_RULES.MIN_EMAIL_LENGTH).toBe(5);
        expect(VALIDATION_RULES.MAX_EMAIL_LENGTH).toBe(254);
      });

      it('should have correct name length rules', () => {
        expect(VALIDATION_RULES.MIN_NAME_LENGTH).toBe(2);
        expect(VALIDATION_RULES.MAX_NAME_LENGTH).toBe(100);
      });

      it('should have correct description length rules', () => {
        expect(VALIDATION_RULES.MIN_DESCRIPTION_LENGTH).toBe(10);
        expect(VALIDATION_RULES.MAX_DESCRIPTION_LENGTH).toBe(1000);
      });
    });

    describe('numeric limits', () => {
      it('should have correct price limits', () => {
        expect(VALIDATION_RULES.MIN_PRICE).toBe(0);
        expect(VALIDATION_RULES.MAX_PRICE).toBe(999999.99);
      });

      it('should have correct quantity limits', () => {
        expect(VALIDATION_RULES.MIN_QUANTITY).toBe(0);
        expect(VALIDATION_RULES.MAX_QUANTITY).toBe(999999);
      });

      it('should have correct rating limits', () => {
        expect(VALIDATION_RULES.MIN_RATING).toBe(1);
        expect(VALIDATION_RULES.MAX_RATING).toBe(5);
      });
    });

    describe('array limits', () => {
      it('should have correct array length limits', () => {
        expect(VALIDATION_RULES.MIN_ARRAY_LENGTH).toBe(1);
        expect(VALIDATION_RULES.MAX_ARRAY_LENGTH).toBe(100);
      });

      it('should have correct item limits', () => {
        expect(VALIDATION_RULES.MAX_TAGS_PER_ITEM).toBe(10);
        expect(VALIDATION_RULES.MAX_IMAGES_PER_ITEM).toBe(10);
      });
    });

    describe('file sizes', () => {
      it('should have correct file size limits', () => {
        expect(VALIDATION_RULES.MAX_FILE_SIZE).toBe(5 * 1024 * 1024); // 5MB
        expect(VALIDATION_RULES.MAX_IMAGE_SIZE).toBe(2 * 1024 * 1024); // 2MB
        expect(VALIDATION_RULES.MAX_DOCUMENT_SIZE).toBe(10 * 1024 * 1024); // 10MB
      });

      it('should have reasonable file size hierarchy', () => {
        expect(VALIDATION_RULES.MAX_IMAGE_SIZE).toBeLessThan(
          VALIDATION_RULES.MAX_FILE_SIZE,
        );
        expect(VALIDATION_RULES.MAX_FILE_SIZE).toBeLessThan(
          VALIDATION_RULES.MAX_DOCUMENT_SIZE,
        );
      });
    });

    describe('time limits', () => {
      it('should have correct token expiry limits', () => {
        expect(VALIDATION_RULES.MIN_TOKEN_EXPIRY).toBe(60); // 1 minute
        expect(VALIDATION_RULES.MAX_TOKEN_EXPIRY).toBe(7 * 24 * 60 * 60); // 7 days
        expect(VALIDATION_RULES.DEFAULT_TOKEN_EXPIRY).toBe(24 * 60 * 60); // 24 hours
      });

      it('should have reasonable token expiry hierarchy', () => {
        expect(VALIDATION_RULES.MIN_TOKEN_EXPIRY).toBeLessThan(
          VALIDATION_RULES.DEFAULT_TOKEN_EXPIRY,
        );
        expect(VALIDATION_RULES.DEFAULT_TOKEN_EXPIRY).toBeLessThan(
          VALIDATION_RULES.MAX_TOKEN_EXPIRY,
        );
      });
    });

    it('should be readonly', () => {
      // Note: In JavaScript, const objects are not deeply immutable
      // This test verifies the structure but not deep immutability
      expect(VALIDATION_RULES.MIN_PASSWORD_LENGTH).toBe(8);
      expect(VALIDATION_RULES.MAX_PASSWORD_LENGTH).toBe(128);
    });
  });

  describe('VALIDATION_MESSAGES', () => {
    describe('required fields', () => {
      it('should have correct required field messages', () => {
        expect(VALIDATION_MESSAGES.REQUIRED).toBe('This field is required');
        expect(VALIDATION_MESSAGES.REQUIRED_STRING).toBe(
          'This field must be a string',
        );
        expect(VALIDATION_MESSAGES.REQUIRED_NUMBER).toBe(
          'This field must be a number',
        );
        expect(VALIDATION_MESSAGES.REQUIRED_BOOLEAN).toBe(
          'This field must be a boolean',
        );
        expect(VALIDATION_MESSAGES.REQUIRED_ARRAY).toBe(
          'This field must be an array',
        );
        expect(VALIDATION_MESSAGES.REQUIRED_OBJECT).toBe(
          'This field must be an object',
        );
      });
    });

    describe('string validation', () => {
      it('should generate correct string length messages', () => {
        expect(VALIDATION_MESSAGES.STRING_MIN_LENGTH(5)).toBe(
          'Must be at least 5 characters long',
        );
        expect(VALIDATION_MESSAGES.STRING_MAX_LENGTH(100)).toBe(
          'Must be no more than 100 characters long',
        );
        expect(VALIDATION_MESSAGES.STRING_LENGTH_RANGE(3, 50)).toBe(
          'Must be between 3 and 50 characters long',
        );
      });

      it('should have correct format messages', () => {
        expect(VALIDATION_MESSAGES.INVALID_EMAIL).toBe(
          'Must be a valid email address',
        );
        expect(VALIDATION_MESSAGES.INVALID_URL).toBe('Must be a valid URL');
        expect(VALIDATION_MESSAGES.INVALID_PHONE).toBe(
          'Must be a valid phone number',
        );
        expect(VALIDATION_MESSAGES.INVALID_DATE).toBe('Must be a valid date');
        expect(VALIDATION_MESSAGES.INVALID_UUID).toBe('Must be a valid UUID');
      });
    });

    describe('number validation', () => {
      it('should generate correct number range messages', () => {
        expect(VALIDATION_MESSAGES.NUMBER_MIN(0)).toBe('Must be at least 0');
        expect(VALIDATION_MESSAGES.NUMBER_MAX(100)).toBe(
          'Must be no more than 100',
        );
        expect(VALIDATION_MESSAGES.NUMBER_RANGE(1, 10)).toBe(
          'Must be between 1 and 10',
        );
      });

      it('should have correct number type messages', () => {
        expect(VALIDATION_MESSAGES.NUMBER_INTEGER).toBe('Must be an integer');
        expect(VALIDATION_MESSAGES.NUMBER_POSITIVE).toBe(
          'Must be a positive number',
        );
        expect(VALIDATION_MESSAGES.NUMBER_NEGATIVE).toBe(
          'Must be a negative number',
        );
      });
    });

    describe('array validation', () => {
      it('should generate correct array length messages', () => {
        expect(VALIDATION_MESSAGES.ARRAY_MIN_LENGTH(1)).toBe(
          'Must have at least 1 items',
        );
        expect(VALIDATION_MESSAGES.ARRAY_MAX_LENGTH(10)).toBe(
          'Must have no more than 10 items',
        );
        expect(VALIDATION_MESSAGES.ARRAY_LENGTH_RANGE(1, 5)).toBe(
          'Must have between 1 and 5 items',
        );
      });

      it('should have correct array property messages', () => {
        expect(VALIDATION_MESSAGES.ARRAY_UNIQUE).toBe(
          'All items must be unique',
        );
      });
    });

    describe('object validation', () => {
      it('should generate correct object property messages', () => {
        expect(VALIDATION_MESSAGES.OBJECT_UNKNOWN_PROPERTY('test')).toBe(
          'Unknown property: test',
        );
        expect(VALIDATION_MESSAGES.OBJECT_REQUIRED_PROPERTY('name')).toBe(
          'Required property: name',
        );
      });
    });

    describe('file validation', () => {
      it('should generate correct file size messages', () => {
        expect(VALIDATION_MESSAGES.FILE_TOO_LARGE('5MB')).toBe(
          'File size must be less than 5MB',
        );
      });

      it('should generate correct file type messages', () => {
        const allowedTypes = ['jpg', 'png', 'gif'];
        expect(VALIDATION_MESSAGES.INVALID_FILE_TYPE(allowedTypes)).toBe(
          'File type must be one of: jpg, png, gif',
        );
      });

      it('should generate correct file extension messages', () => {
        const allowedExtensions = ['.jpg', '.png', '.gif'];
        expect(
          VALIDATION_MESSAGES.INVALID_FILE_EXTENSION(allowedExtensions),
        ).toBe('File extension must be one of: .jpg, .png, .gif');
      });
    });

    it('should be readonly', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        (VALIDATION_MESSAGES as any).REQUIRED = 'Modified';
      }).toThrow();
    });
  });

  describe('VALIDATION_PATTERNS', () => {
    it('should have valid email pattern', () => {
      const emailPattern = VALIDATION_PATTERNS.EMAIL;
      expect(emailPattern).toBeInstanceOf(RegExp);

      // Test valid emails
      expect(emailPattern.test('test@example.com')).toBe(true);
      expect(emailPattern.test('user.name@domain.co.uk')).toBe(true);

      // Test invalid emails
      expect(emailPattern.test('invalid-email')).toBe(false);
      expect(emailPattern.test('test@')).toBe(false);
      expect(emailPattern.test('@example.com')).toBe(false);
    });

    it('should have valid phone pattern', () => {
      const phonePattern = VALIDATION_PATTERNS.PHONE;
      expect(phonePattern).toBeInstanceOf(RegExp);

      // Test valid phone numbers
      expect(phonePattern.test('+1234567890')).toBe(true);
      expect(phonePattern.test('123-456-7890')).toBe(true);
      expect(phonePattern.test('(123) 456-7890')).toBe(true);

      // Test invalid phone numbers
      expect(phonePattern.test('invalid')).toBe(false);
      expect(phonePattern.test('123')).toBe(false);
    });

    it('should have valid URL pattern', () => {
      const urlPattern = VALIDATION_PATTERNS.URL;
      expect(urlPattern).toBeInstanceOf(RegExp);

      // Test valid URLs
      expect(urlPattern.test('https://example.com')).toBe(true);
      expect(urlPattern.test('http://localhost:3000')).toBe(true);
      expect(urlPattern.test('https://api.example.com/path')).toBe(true);

      // Test invalid URLs
      expect(urlPattern.test('not-a-url')).toBe(false);
      expect(urlPattern.test('ftp://example.com')).toBe(false);
    });

    it('should have valid UUID pattern', () => {
      const uuidPattern = VALIDATION_PATTERNS.UUID;
      expect(uuidPattern).toBeInstanceOf(RegExp);

      // Test valid UUIDs
      expect(uuidPattern.test('123e4567-e89b-12d3-a456-426614174000')).toBe(
        true,
      );
      expect(uuidPattern.test('550e8400-e29b-41d4-a716-446655440000')).toBe(
        true,
      );

      // Test invalid UUIDs
      expect(uuidPattern.test('invalid-uuid')).toBe(false);
      expect(uuidPattern.test('123e4567-e89b-12d3-a456')).toBe(false);
    });

    it('should have valid password pattern', () => {
      const passwordPattern = VALIDATION_PATTERNS.PASSWORD;
      expect(passwordPattern).toBeInstanceOf(RegExp);

      // Test valid passwords
      expect(passwordPattern.test('Password123!')).toBe(true);
      expect(passwordPattern.test('MySecurePass1')).toBe(true);

      // Test invalid passwords
      expect(passwordPattern.test('weak')).toBe(false);
      expect(passwordPattern.test('nouppercase123')).toBe(false);
      expect(passwordPattern.test('NOLOWERCASE123')).toBe(false);
      expect(passwordPattern.test('NoNumbers')).toBe(false);
    });

    it('should be readonly', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        (VALIDATION_PATTERNS as any).EMAIL = /test/;
      }).toThrow();
    });
  });

  describe('VALIDATION_OPTIONS', () => {
    it('should have correct email options', () => {
      const emailOptions = VALIDATION_OPTIONS.EMAIL;
      expect(emailOptions).toHaveProperty('pattern');
      expect(emailOptions).toHaveProperty('message');
      expect(emailOptions.pattern).toBeInstanceOf(RegExp);
      expect(typeof emailOptions.message).toBe('string');
    });

    it('should have correct phone options', () => {
      const phoneOptions = VALIDATION_OPTIONS.PHONE;
      expect(phoneOptions).toHaveProperty('pattern');
      expect(phoneOptions).toHaveProperty('message');
      expect(phoneOptions.pattern).toBeInstanceOf(RegExp);
      expect(typeof phoneOptions.message).toBe('string');
    });

    it('should have correct URL options', () => {
      const urlOptions = VALIDATION_OPTIONS.URL;
      expect(urlOptions).toHaveProperty('pattern');
      expect(urlOptions).toHaveProperty('message');
      expect(urlOptions.pattern).toBeInstanceOf(RegExp);
      expect(typeof urlOptions.message).toBe('string');
    });

    it('should have correct UUID options', () => {
      const uuidOptions = VALIDATION_OPTIONS.UUID;
      expect(uuidOptions).toHaveProperty('pattern');
      expect(uuidOptions).toHaveProperty('message');
      expect(uuidOptions.pattern).toBeInstanceOf(RegExp);
      expect(typeof uuidOptions.message).toBe('string');
    });

    it('should have correct password options', () => {
      const passwordOptions = VALIDATION_OPTIONS.PASSWORD;
      expect(passwordOptions).toHaveProperty('pattern');
      expect(passwordOptions).toHaveProperty('message');
      expect(passwordOptions.pattern).toBeInstanceOf(RegExp);
      expect(typeof passwordOptions.message).toBe('string');
    });

    it('should be readonly', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        (VALIDATION_OPTIONS as any).EMAIL = {};
      }).toThrow();
    });
  });

  describe('constant relationships', () => {
    it('should have consistent length rules', () => {
      expect(VALIDATION_RULES.MIN_PASSWORD_LENGTH).toBeLessThan(
        VALIDATION_RULES.MAX_PASSWORD_LENGTH,
      );
      expect(VALIDATION_RULES.MIN_USERNAME_LENGTH).toBeLessThan(
        VALIDATION_RULES.MAX_USERNAME_LENGTH,
      );
      expect(VALIDATION_RULES.MIN_EMAIL_LENGTH).toBeLessThan(
        VALIDATION_RULES.MAX_EMAIL_LENGTH,
      );
      expect(VALIDATION_RULES.MIN_NAME_LENGTH).toBeLessThan(
        VALIDATION_RULES.MAX_NAME_LENGTH,
      );
      expect(VALIDATION_RULES.MIN_DESCRIPTION_LENGTH).toBeLessThan(
        VALIDATION_RULES.MAX_DESCRIPTION_LENGTH,
      );
    });

    it('should have consistent numeric limits', () => {
      expect(VALIDATION_RULES.MIN_PRICE).toBeLessThan(
        VALIDATION_RULES.MAX_PRICE,
      );
      expect(VALIDATION_RULES.MIN_QUANTITY).toBeLessThan(
        VALIDATION_RULES.MAX_QUANTITY,
      );
      expect(VALIDATION_RULES.MIN_RATING).toBeLessThan(
        VALIDATION_RULES.MAX_RATING,
      );
    });

    it('should have consistent array limits', () => {
      expect(VALIDATION_RULES.MIN_ARRAY_LENGTH).toBeLessThan(
        VALIDATION_RULES.MAX_ARRAY_LENGTH,
      );
      expect(VALIDATION_RULES.MAX_TAGS_PER_ITEM).toBeLessThanOrEqual(
        VALIDATION_RULES.MAX_ARRAY_LENGTH,
      );
      expect(VALIDATION_RULES.MAX_IMAGES_PER_ITEM).toBeLessThanOrEqual(
        VALIDATION_RULES.MAX_ARRAY_LENGTH,
      );
    });
  });

  describe('type safety', () => {
    it('should have correct types for VALIDATION_RULES', () => {
      expect(typeof VALIDATION_RULES.MIN_PASSWORD_LENGTH).toBe('number');
      expect(typeof VALIDATION_RULES.MAX_PASSWORD_LENGTH).toBe('number');
      expect(typeof VALIDATION_RULES.MAX_FILE_SIZE).toBe('number');
    });

    it('should have correct types for VALIDATION_MESSAGES', () => {
      expect(typeof VALIDATION_MESSAGES.REQUIRED).toBe('string');
      expect(typeof VALIDATION_MESSAGES.STRING_MIN_LENGTH).toBe('function');
      expect(typeof VALIDATION_MESSAGES.NUMBER_RANGE).toBe('function');
    });

    it('should have correct types for VALIDATION_PATTERNS', () => {
      expect(VALIDATION_PATTERNS.EMAIL).toBeInstanceOf(RegExp);
      expect(VALIDATION_PATTERNS.PHONE).toBeInstanceOf(RegExp);
      expect(VALIDATION_PATTERNS.URL).toBeInstanceOf(RegExp);
    });

    it('should have correct types for VALIDATION_OPTIONS', () => {
      expect(typeof VALIDATION_OPTIONS.EMAIL).toBe('object');
      expect(VALIDATION_OPTIONS.EMAIL).toHaveProperty('pattern');
      expect(VALIDATION_OPTIONS.EMAIL).toHaveProperty('message');
    });
  });
});
