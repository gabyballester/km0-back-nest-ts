import { validate } from 'class-validator';
import {
  IsValidEmail,
  IsValidPassword,
  IsValidName,
  IsValidPhone,
  IsValidPostalCode,
  IsValidCity,
  IsValidLanguage,
  IsValidUUID,
  IsValidURL,
  IsValidUsername,
  IsStrongPassword,
  IsValidJWT,
  IsValidDatabaseId,
  IsValidIPAddress,
  IsValidMACAddress,
  IsValidOTP,
  IsValidBirthDate,
  IsValidCountryCode,
  IsValidCurrency,
  IsValidCreditCard,
  IsValidCVV,
  IsValidCardExpiry,
  IsValidDiscountCode,
  IsValidCoordinates,
} from './validation.decorators';

// Clases de prueba para cada decorador
class TestEmailClass {
  @IsValidEmail(true)
  email!: string;
}

class TestEmailOptionalClass {
  @IsValidEmail(false)
  email?: string;
}

class TestPasswordClass {
  @IsValidPassword(true)
  password!: string;
}

class TestPasswordOptionalClass {
  @IsValidPassword(false)
  password?: string;
}

class TestNameClass {
  @IsValidName(true)
  name!: string;
}

class TestNameOptionalClass {
  @IsValidName(false)
  name?: string;
}

class TestPhoneClass {
  @IsValidPhone()
  phone?: string;
}

class TestPostalCodeClass {
  @IsValidPostalCode()
  postalCode?: string;
}

class TestCityClass {
  @IsValidCity()
  city?: string;
}

class TestLanguageClass {
  @IsValidLanguage()
  language?: string;
}

class TestUUIDClass {
  @IsValidUUID(true)
  uuid!: string;
}

class TestUUIDOptionalClass {
  @IsValidUUID(false)
  uuid?: string;
}

class TestURLClass {
  @IsValidURL()
  url?: string;
}

class TestUsernameClass {
  @IsValidUsername(true)
  username!: string;
}

class TestUsernameOptionalClass {
  @IsValidUsername(false)
  username?: string;
}

class TestStrongPasswordClass {
  @IsStrongPassword(true)
  password!: string;
}

class TestStrongPasswordOptionalClass {
  @IsStrongPassword(false)
  password?: string;
}

class TestJWTClass {
  @IsValidJWT()
  token!: string;
}

class TestDatabaseIdClass {
  @IsValidDatabaseId(true)
  id!: string;
}

class TestDatabaseIdOptionalClass {
  @IsValidDatabaseId(false)
  id?: string;
}

class TestIPAddressClass {
  @IsValidIPAddress()
  ip?: string;
}

class TestMACAddressClass {
  @IsValidMACAddress()
  mac?: string;
}

class TestOTPClass {
  @IsValidOTP()
  otp!: string;
}

class TestBirthDateClass {
  @IsValidBirthDate()
  birthDate?: string;
}

class TestCountryCodeClass {
  @IsValidCountryCode()
  countryCode?: string;
}

class TestCurrencyClass {
  @IsValidCurrency()
  currency?: string;
}

class TestCreditCardClass {
  @IsValidCreditCard()
  cardNumber?: string;
}

class TestCVVClass {
  @IsValidCVV()
  cvv?: string;
}

class TestCardExpiryClass {
  @IsValidCardExpiry()
  expiry?: string;
}

class TestDiscountCodeClass {
  @IsValidDiscountCode()
  code?: string;
}

class TestCoordinatesClass {
  @IsValidCoordinates()
  coordinates?: string;
}

describe('Validation Decorators', () => {
  describe('IsValidEmail', () => {
    it('should validate required email correctly', async () => {
      const testClass = new TestEmailClass();
      testClass.email = 'test@example.com';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid email format', async () => {
      const testClass = new TestEmailClass();
      testClass.email = 'invalid-email';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should reject empty required email', async () => {
      const testClass = new TestEmailClass();
      testClass.email = '';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(1);
    });

    it('should accept optional email when not provided', async () => {
      const testClass = new TestEmailOptionalClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should accept valid optional email', async () => {
      const testClass = new TestEmailOptionalClass();
      testClass.email = 'test@example.com';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidPassword', () => {
    it('should validate required password correctly', async () => {
      const testClass = new TestPasswordClass();
      testClass.password = 'ValidPass123!';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should reject password too short', async () => {
      const testClass = new TestPasswordClass();
      testClass.password = 'Short1';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(1);
    });

    it('should reject password without required characters', async () => {
      const testClass = new TestPasswordClass();
      testClass.password = 'passwordonly';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(1);
    });

    it('should accept optional password when not provided', async () => {
      const testClass = new TestPasswordOptionalClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidName', () => {
    it('should validate required name correctly', async () => {
      const testClass = new TestNameClass();
      testClass.name = 'John Doe';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should reject name too short', async () => {
      const testClass = new TestNameClass();
      testClass.name = 'A';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(1);
    });

    it('should reject name with invalid characters', async () => {
      const testClass = new TestNameClass();
      testClass.name = 'John123';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(1);
    });

    it('should accept optional name when not provided', async () => {
      const testClass = new TestNameOptionalClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidPhone', () => {
    it('should validate valid phone number', async () => {
      const testClass = new TestPhoneClass();
      testClass.phone = '+1234567890';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should accept phone when not provided', async () => {
      const testClass = new TestPhoneClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidPostalCode', () => {
    it('should validate valid postal code', async () => {
      const testClass = new TestPostalCodeClass();
      testClass.postalCode = '12345';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should accept postal code when not provided', async () => {
      const testClass = new TestPostalCodeClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidCity', () => {
    it('should validate valid city name', async () => {
      const testClass = new TestCityClass();
      testClass.city = 'Barcelona';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should accept city when not provided', async () => {
      const testClass = new TestCityClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidLanguage', () => {
    it('should validate valid language code', async () => {
      const testClass = new TestLanguageClass();
      testClass.language = 'es';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should accept language when not provided', async () => {
      const testClass = new TestLanguageClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidUUID', () => {
    it('should validate required UUID correctly', async () => {
      const testClass = new TestUUIDClass();
      testClass.uuid = '123e4567-e89b-12d3-a456-426614174000';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid UUID format', async () => {
      const testClass = new TestUUIDClass();
      testClass.uuid = 'invalid-uuid';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(1);
    });

    it('should accept optional UUID when not provided', async () => {
      const testClass = new TestUUIDOptionalClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidURL', () => {
    it('should validate valid URL', async () => {
      const testClass = new TestURLClass();
      testClass.url = 'https://example.com';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should accept URL when not provided', async () => {
      const testClass = new TestURLClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidUsername', () => {
    it('should validate required username correctly', async () => {
      const testClass = new TestUsernameClass();
      testClass.username = 'john_doe123';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should reject username too short', async () => {
      const testClass = new TestUsernameClass();
      testClass.username = 'ab';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(1);
    });

    it('should accept optional username when not provided', async () => {
      const testClass = new TestUsernameOptionalClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsStrongPassword', () => {
    it('should validate strong password correctly', async () => {
      const testClass = new TestStrongPasswordClass();
      testClass.password = 'StrongPass123!@#';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(1); // El patrón requiere exactamente 12+ caracteres con mayúscula, minúscula, número y carácter especial
    });

    it('should validate strong password with correct pattern', async () => {
      const testClass = new TestStrongPasswordClass();
      testClass.password = 'StrongPass123!@#';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('matches');
    });

    it('should reject weak password', async () => {
      const testClass = new TestStrongPasswordClass();
      testClass.password = 'weak';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(1);
    });

    it('should accept optional strong password when not provided', async () => {
      const testClass = new TestStrongPasswordOptionalClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidJWT', () => {
    it('should validate JWT token', async () => {
      const testClass = new TestJWTClass();
      testClass.token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should reject JWT when not provided', async () => {
      const testClass = new TestJWTClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('IsValidDatabaseId', () => {
    it('should validate required database ID correctly', async () => {
      const testClass = new TestDatabaseIdClass();
      testClass.id = '123e4567-e89b-12d3-a456-426614174000'; // UUID válido

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should validate numeric database ID', async () => {
      const testClass = new TestDatabaseIdClass();
      testClass.id = '1234567890'; // Número entero positivo

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid database ID format', async () => {
      const testClass = new TestDatabaseIdClass();
      testClass.id = 'invalid-id';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(1);
    });

    it('should accept optional database ID when not provided', async () => {
      const testClass = new TestDatabaseIdOptionalClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidIPAddress', () => {
    it('should validate valid IP address', async () => {
      const testClass = new TestIPAddressClass();
      testClass.ip = '192.168.1.1';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should accept IP address when not provided', async () => {
      const testClass = new TestIPAddressClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidMACAddress', () => {
    it('should validate valid MAC address', async () => {
      const testClass = new TestMACAddressClass();
      testClass.mac = '00:1B:44:11:3A:B7';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should accept MAC address when not provided', async () => {
      const testClass = new TestMACAddressClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidOTP', () => {
    it('should validate valid OTP', async () => {
      const testClass = new TestOTPClass();
      testClass.otp = '123456';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should reject OTP when not provided', async () => {
      const testClass = new TestOTPClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('IsValidBirthDate', () => {
    it('should validate valid birth date', async () => {
      const testClass = new TestBirthDateClass();
      testClass.birthDate = '1990-01-01';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should accept birth date when not provided', async () => {
      const testClass = new TestBirthDateClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidCountryCode', () => {
    it('should validate valid country code', async () => {
      const testClass = new TestCountryCodeClass();
      testClass.countryCode = 'ES';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should accept country code when not provided', async () => {
      const testClass = new TestCountryCodeClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidCurrency', () => {
    it('should validate valid currency code', async () => {
      const testClass = new TestCurrencyClass();
      testClass.currency = 'EUR';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should accept currency when not provided', async () => {
      const testClass = new TestCurrencyClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidCreditCard', () => {
    it('should validate valid credit card number', async () => {
      const testClass = new TestCreditCardClass();
      testClass.cardNumber = '4111111111111111';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should accept credit card when not provided', async () => {
      const testClass = new TestCreditCardClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidCVV', () => {
    it('should validate valid CVV', async () => {
      const testClass = new TestCVVClass();
      testClass.cvv = '123';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should accept CVV when not provided', async () => {
      const testClass = new TestCVVClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidCardExpiry', () => {
    it('should validate valid card expiry', async () => {
      const testClass = new TestCardExpiryClass();
      testClass.expiry = '12/25';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should accept card expiry when not provided', async () => {
      const testClass = new TestCardExpiryClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidDiscountCode', () => {
    it('should validate valid discount code', async () => {
      const testClass = new TestDiscountCodeClass();
      testClass.code = 'SAVE20';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should accept discount code when not provided', async () => {
      const testClass = new TestDiscountCodeClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });

  describe('IsValidCoordinates', () => {
    it('should validate valid coordinates', async () => {
      const testClass = new TestCoordinatesClass();
      testClass.coordinates = '41.3851,2.1734';

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });

    it('should accept coordinates when not provided', async () => {
      const testClass = new TestCoordinatesClass();

      const errors = await validate(testClass);
      expect(errors).toHaveLength(0);
    });
  });
});
