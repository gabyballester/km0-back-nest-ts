import {
  USER_ROLES,
  USER_STATUS,
  PRODUCT_CATEGORIES,
  PRODUCT_STATUS,
  ORDER_STATUS,
  PAYMENT_METHODS,
  NOTIFICATION_TYPES,
  BUSINESS_RULES,
  ERROR_CODES,
} from './business';

describe('Business Constants', () => {
  describe('USER_ROLES', () => {
    it('should have correct role values', () => {
      expect(USER_ROLES.ADMIN).toBe('admin');
      expect(USER_ROLES.MODERATOR).toBe('moderator');
      expect(USER_ROLES.SELLER).toBe('seller');
      expect(USER_ROLES.BUYER).toBe('buyer');
      expect(USER_ROLES.GUEST).toBe('guest');
    });

    it('should have correct role hierarchy', () => {
      expect(USER_ROLES.ROLE_HIERARCHY[USER_ROLES.ADMIN]).toBe(100);
      expect(USER_ROLES.ROLE_HIERARCHY[USER_ROLES.MODERATOR]).toBe(80);
      expect(USER_ROLES.ROLE_HIERARCHY[USER_ROLES.SELLER]).toBe(60);
      expect(USER_ROLES.ROLE_HIERARCHY[USER_ROLES.BUYER]).toBe(40);
      expect(USER_ROLES.ROLE_HIERARCHY[USER_ROLES.GUEST]).toBe(20);
    });

    it('should have correct default role', () => {
      expect(USER_ROLES.DEFAULT_ROLE).toBe(USER_ROLES.BUYER);
    });
  });

  describe('USER_STATUS', () => {
    it('should have correct status values', () => {
      expect(USER_STATUS.ACTIVE).toBe('active');
      expect(USER_STATUS.INACTIVE).toBe('inactive');
      expect(USER_STATUS.SUSPENDED).toBe('suspended');
      expect(USER_STATUS.BANNED).toBe('banned');
      expect(USER_STATUS.PENDING_VERIFICATION).toBe('pending_verification');
      expect(USER_STATUS.DELETED).toBe('deleted');
    });

    it('should have correct status hierarchy', () => {
      expect(USER_STATUS.STATUS_HIERARCHY[USER_STATUS.ACTIVE]).toBe(100);
      expect(
        USER_STATUS.STATUS_HIERARCHY[USER_STATUS.PENDING_VERIFICATION],
      ).toBe(80);
      expect(USER_STATUS.STATUS_HIERARCHY[USER_STATUS.INACTIVE]).toBe(60);
      expect(USER_STATUS.STATUS_HIERARCHY[USER_STATUS.SUSPENDED]).toBe(40);
      expect(USER_STATUS.STATUS_HIERARCHY[USER_STATUS.BANNED]).toBe(20);
      expect(USER_STATUS.STATUS_HIERARCHY[USER_STATUS.DELETED]).toBe(0);
    });
  });

  describe('PRODUCT_CATEGORIES', () => {
    it('should have correct category values', () => {
      expect(PRODUCT_CATEGORIES.FOOD_AND_BEVERAGES).toBe('food_and_beverages');
      expect(PRODUCT_CATEGORIES.AGRICULTURE).toBe('agriculture');
      expect(PRODUCT_CATEGORIES.HANDMADE).toBe('handmade');
      expect(PRODUCT_CATEGORIES.SERVICES).toBe('services');
      expect(PRODUCT_CATEGORIES.TECHNOLOGY).toBe('technology');
      expect(PRODUCT_CATEGORIES.HEALTH_AND_WELLNESS).toBe(
        'health_and_wellness',
      );
      expect(PRODUCT_CATEGORIES.EDUCATION).toBe('education');
      expect(PRODUCT_CATEGORIES.ENTERTAINMENT).toBe('entertainment');
      expect(PRODUCT_CATEGORIES.OTHER).toBe('other');
    });

    it('should have correct category display names', () => {
      expect(
        PRODUCT_CATEGORIES.CATEGORY_NAMES[
          PRODUCT_CATEGORIES.FOOD_AND_BEVERAGES
        ],
      ).toBe('Food & Beverages');
      expect(
        PRODUCT_CATEGORIES.CATEGORY_NAMES[PRODUCT_CATEGORIES.AGRICULTURE],
      ).toBe('Agriculture');
      expect(
        PRODUCT_CATEGORIES.CATEGORY_NAMES[PRODUCT_CATEGORIES.HANDMADE],
      ).toBe('Handmade');
      expect(
        PRODUCT_CATEGORIES.CATEGORY_NAMES[PRODUCT_CATEGORIES.SERVICES],
      ).toBe('Services');
      expect(
        PRODUCT_CATEGORIES.CATEGORY_NAMES[PRODUCT_CATEGORIES.TECHNOLOGY],
      ).toBe('Technology');
      expect(
        PRODUCT_CATEGORIES.CATEGORY_NAMES[
          PRODUCT_CATEGORIES.HEALTH_AND_WELLNESS
        ],
      ).toBe('Health & Wellness');
      expect(
        PRODUCT_CATEGORIES.CATEGORY_NAMES[PRODUCT_CATEGORIES.EDUCATION],
      ).toBe('Education');
      expect(
        PRODUCT_CATEGORIES.CATEGORY_NAMES[PRODUCT_CATEGORIES.ENTERTAINMENT],
      ).toBe('Entertainment');
      expect(PRODUCT_CATEGORIES.CATEGORY_NAMES[PRODUCT_CATEGORIES.OTHER]).toBe(
        'Other',
      );
    });
  });

  describe('PRODUCT_STATUS', () => {
    it('should have correct status values', () => {
      expect(PRODUCT_STATUS.ACTIVE).toBe('active');
      expect(PRODUCT_STATUS.INACTIVE).toBe('inactive');
      expect(PRODUCT_STATUS.SOLD_OUT).toBe('sold_out');
      expect(PRODUCT_STATUS.DISCONTINUED).toBe('discontinued');
      expect(PRODUCT_STATUS.PENDING_APPROVAL).toBe('pending_approval');
      expect(PRODUCT_STATUS.REJECTED).toBe('rejected');
      expect(PRODUCT_STATUS.DRAFT).toBe('draft');
    });

    it('should have correct status hierarchy', () => {
      expect(PRODUCT_STATUS.STATUS_HIERARCHY[PRODUCT_STATUS.ACTIVE]).toBe(100);
      expect(
        PRODUCT_STATUS.STATUS_HIERARCHY[PRODUCT_STATUS.PENDING_APPROVAL],
      ).toBe(80);
      expect(PRODUCT_STATUS.STATUS_HIERARCHY[PRODUCT_STATUS.DRAFT]).toBe(60);
      expect(PRODUCT_STATUS.STATUS_HIERARCHY[PRODUCT_STATUS.SOLD_OUT]).toBe(40);
      expect(PRODUCT_STATUS.STATUS_HIERARCHY[PRODUCT_STATUS.INACTIVE]).toBe(20);
      expect(PRODUCT_STATUS.STATUS_HIERARCHY[PRODUCT_STATUS.REJECTED]).toBe(10);
      expect(PRODUCT_STATUS.STATUS_HIERARCHY[PRODUCT_STATUS.DISCONTINUED]).toBe(
        0,
      );
    });
  });

  describe('ORDER_STATUS', () => {
    it('should have correct status values', () => {
      expect(ORDER_STATUS.PENDING).toBe('pending');
      expect(ORDER_STATUS.CONFIRMED).toBe('confirmed');
      expect(ORDER_STATUS.PROCESSING).toBe('processing');
      expect(ORDER_STATUS.SHIPPED).toBe('shipped');
      expect(ORDER_STATUS.DELIVERED).toBe('delivered');
      expect(ORDER_STATUS.CANCELLED).toBe('cancelled');
      expect(ORDER_STATUS.REFUNDED).toBe('refunded');
      expect(ORDER_STATUS.DISPUTED).toBe('disputed');
    });

    it('should have correct status flow', () => {
      expect(ORDER_STATUS.STATUS_FLOW[ORDER_STATUS.PENDING]).toEqual([
        ORDER_STATUS.CONFIRMED,
        ORDER_STATUS.CANCELLED,
      ]);
      expect(ORDER_STATUS.STATUS_FLOW[ORDER_STATUS.CONFIRMED]).toEqual([
        ORDER_STATUS.PROCESSING,
        ORDER_STATUS.CANCELLED,
      ]);
      expect(ORDER_STATUS.STATUS_FLOW[ORDER_STATUS.PROCESSING]).toEqual([
        ORDER_STATUS.SHIPPED,
        ORDER_STATUS.CANCELLED,
      ]);
      expect(ORDER_STATUS.STATUS_FLOW[ORDER_STATUS.SHIPPED]).toEqual([
        ORDER_STATUS.DELIVERED,
        ORDER_STATUS.DISPUTED,
      ]);
      expect(ORDER_STATUS.STATUS_FLOW[ORDER_STATUS.DELIVERED]).toEqual([
        ORDER_STATUS.REFUNDED,
        ORDER_STATUS.DISPUTED,
      ]);
      expect(ORDER_STATUS.STATUS_FLOW[ORDER_STATUS.CANCELLED]).toEqual([]);
      expect(ORDER_STATUS.STATUS_FLOW[ORDER_STATUS.REFUNDED]).toEqual([]);
      expect(ORDER_STATUS.STATUS_FLOW[ORDER_STATUS.DISPUTED]).toEqual([
        ORDER_STATUS.REFUNDED,
        ORDER_STATUS.DELIVERED,
      ]);
    });

    it('should have correct status hierarchy', () => {
      expect(ORDER_STATUS.STATUS_HIERARCHY[ORDER_STATUS.PENDING]).toBe(10);
      expect(ORDER_STATUS.STATUS_HIERARCHY[ORDER_STATUS.CONFIRMED]).toBe(20);
      expect(ORDER_STATUS.STATUS_HIERARCHY[ORDER_STATUS.PROCESSING]).toBe(30);
      expect(ORDER_STATUS.STATUS_HIERARCHY[ORDER_STATUS.SHIPPED]).toBe(40);
      expect(ORDER_STATUS.STATUS_HIERARCHY[ORDER_STATUS.DELIVERED]).toBe(50);
      expect(ORDER_STATUS.STATUS_HIERARCHY[ORDER_STATUS.DISPUTED]).toBe(60);
      expect(ORDER_STATUS.STATUS_HIERARCHY[ORDER_STATUS.REFUNDED]).toBe(70);
      expect(ORDER_STATUS.STATUS_HIERARCHY[ORDER_STATUS.CANCELLED]).toBe(0);
    });
  });

  describe('PAYMENT_METHODS', () => {
    it('should have correct method values', () => {
      expect(PAYMENT_METHODS.CASH).toBe('cash');
      expect(PAYMENT_METHODS.BANK_TRANSFER).toBe('bank_transfer');
      expect(PAYMENT_METHODS.CREDIT_CARD).toBe('credit_card');
      expect(PAYMENT_METHODS.DEBIT_CARD).toBe('debit_card');
      expect(PAYMENT_METHODS.DIGITAL_WALLET).toBe('digital_wallet');
      expect(PAYMENT_METHODS.CRYPTO).toBe('crypto');
    });

    it('should have correct method names', () => {
      expect(PAYMENT_METHODS.METHOD_NAMES[PAYMENT_METHODS.CASH]).toBe('Cash');
      expect(PAYMENT_METHODS.METHOD_NAMES[PAYMENT_METHODS.BANK_TRANSFER]).toBe(
        'Bank Transfer',
      );
      expect(PAYMENT_METHODS.METHOD_NAMES[PAYMENT_METHODS.CREDIT_CARD]).toBe(
        'Credit Card',
      );
      expect(PAYMENT_METHODS.METHOD_NAMES[PAYMENT_METHODS.DEBIT_CARD]).toBe(
        'Debit Card',
      );
      expect(PAYMENT_METHODS.METHOD_NAMES[PAYMENT_METHODS.DIGITAL_WALLET]).toBe(
        'Digital Wallet',
      );
      expect(PAYMENT_METHODS.METHOD_NAMES[PAYMENT_METHODS.CRYPTO]).toBe(
        'Cryptocurrency',
      );
    });

    it('should have correct method fees', () => {
      expect(PAYMENT_METHODS.METHOD_FEES[PAYMENT_METHODS.CASH]).toBe(0);
      expect(PAYMENT_METHODS.METHOD_FEES[PAYMENT_METHODS.BANK_TRANSFER]).toBe(
        0,
      );
      expect(PAYMENT_METHODS.METHOD_FEES[PAYMENT_METHODS.CREDIT_CARD]).toBe(
        2.5,
      );
      expect(PAYMENT_METHODS.METHOD_FEES[PAYMENT_METHODS.DEBIT_CARD]).toBe(1.5);
      expect(PAYMENT_METHODS.METHOD_FEES[PAYMENT_METHODS.DIGITAL_WALLET]).toBe(
        1.0,
      );
      expect(PAYMENT_METHODS.METHOD_FEES[PAYMENT_METHODS.CRYPTO]).toBe(0.5);
    });
  });

  describe('NOTIFICATION_TYPES', () => {
    it('should have correct notification type values', () => {
      expect(NOTIFICATION_TYPES.ORDER_CONFIRMED).toBe('order_confirmed');
      expect(NOTIFICATION_TYPES.ORDER_SHIPPED).toBe('order_shipped');
      expect(NOTIFICATION_TYPES.ORDER_DELIVERED).toBe('order_delivered');
      expect(NOTIFICATION_TYPES.ORDER_CANCELLED).toBe('order_cancelled');
      expect(NOTIFICATION_TYPES.PRODUCT_APPROVED).toBe('product_approved');
      expect(NOTIFICATION_TYPES.PRODUCT_REJECTED).toBe('product_rejected');
      expect(NOTIFICATION_TYPES.PRODUCT_SOLD_OUT).toBe('product_sold_out');
      expect(NOTIFICATION_TYPES.ACCOUNT_VERIFIED).toBe('account_verified');
      expect(NOTIFICATION_TYPES.PASSWORD_CHANGED).toBe('password_changed');
      expect(NOTIFICATION_TYPES.EMAIL_VERIFIED).toBe('email_verified');
      expect(NOTIFICATION_TYPES.SYSTEM_MAINTENANCE).toBe('system_maintenance');
      expect(NOTIFICATION_TYPES.SECURITY_ALERT).toBe('security_alert');
      expect(NOTIFICATION_TYPES.NEWSLETTER).toBe('newsletter');
      expect(NOTIFICATION_TYPES.NEW_MESSAGE).toBe('new_message');
      expect(NOTIFICATION_TYPES.MESSAGE_READ).toBe('message_read');
    });
  });

  describe('BUSINESS_RULES', () => {
    it('should have correct commission and fees', () => {
      expect(BUSINESS_RULES.PLATFORM_COMMISSION).toBe(5.0);
      expect(BUSINESS_RULES.MINIMUM_COMMISSION).toBe(1.0);
      expect(BUSINESS_RULES.MAXIMUM_COMMISSION).toBe(50.0);
    });

    it('should have correct order limits', () => {
      expect(BUSINESS_RULES.MINIMUM_ORDER_AMOUNT).toBe(5.0);
      expect(BUSINESS_RULES.MAXIMUM_ORDER_AMOUNT).toBe(10000.0);
      expect(BUSINESS_RULES.MAXIMUM_ITEMS_PER_ORDER).toBe(50);
    });

    it('should have correct product limits', () => {
      expect(BUSINESS_RULES.MAXIMUM_PRODUCTS_PER_SELLER).toBe(1000);
      expect(BUSINESS_RULES.MAXIMUM_PRODUCT_PRICE).toBe(50000.0);
      expect(BUSINESS_RULES.MINIMUM_PRODUCT_PRICE).toBe(0.01);
    });

    it('should have correct review and rating limits', () => {
      expect(BUSINESS_RULES.MINIMUM_REVIEW_LENGTH).toBe(10);
      expect(BUSINESS_RULES.MAXIMUM_REVIEW_LENGTH).toBe(1000);
      expect(BUSINESS_RULES.MINIMUM_RATING).toBe(1);
      expect(BUSINESS_RULES.MAXIMUM_RATING).toBe(5);
    });

    it('should have correct time limits', () => {
      expect(BUSINESS_RULES.ORDER_CANCELLATION_WINDOW).toBe(24 * 60 * 60);
      expect(BUSINESS_RULES.REFUND_WINDOW).toBe(7 * 24 * 60 * 60);
      expect(BUSINESS_RULES.DISPUTE_WINDOW).toBe(30 * 24 * 60 * 60);
      expect(BUSINESS_RULES.PRODUCT_APPROVAL_TIMEOUT).toBe(3 * 24 * 60 * 60);
    });

    it('should have correct geographic limits', () => {
      expect(BUSINESS_RULES.MAXIMUM_DELIVERY_DISTANCE).toBe(50);
      expect(BUSINESS_RULES.SUPPORTED_COUNTRIES).toEqual([
        'ES',
        'PT',
        'FR',
        'IT',
        'DE',
      ]);
      expect(BUSINESS_RULES.DEFAULT_CURRENCY).toBe('EUR');
    });
  });

  describe('ERROR_CODES', () => {
    it('should have correct authentication error codes', () => {
      expect(ERROR_CODES.INVALID_CREDENTIALS).toBe('AUTH_001');
      expect(ERROR_CODES.TOKEN_EXPIRED).toBe('AUTH_002');
      expect(ERROR_CODES.INSUFFICIENT_PERMISSIONS).toBe('AUTH_003');
      expect(ERROR_CODES.ACCOUNT_LOCKED).toBe('AUTH_004');
    });

    it('should have correct validation error codes', () => {
      expect(ERROR_CODES.INVALID_INPUT).toBe('VAL_001');
      expect(ERROR_CODES.MISSING_REQUIRED_FIELD).toBe('VAL_002');
      expect(ERROR_CODES.INVALID_FORMAT).toBe('VAL_003');
      expect(ERROR_CODES.VALUE_OUT_OF_RANGE).toBe('VAL_004');
    });

    it('should have correct business logic error codes', () => {
      expect(ERROR_CODES.INSUFFICIENT_STOCK).toBe('BUS_001');
      expect(ERROR_CODES.ORDER_TOO_SMALL).toBe('BUS_002');
      expect(ERROR_CODES.ORDER_TOO_LARGE).toBe('BUS_003');
      expect(ERROR_CODES.PRODUCT_NOT_AVAILABLE).toBe('BUS_004');
      expect(ERROR_CODES.USER_NOT_VERIFIED).toBe('BUS_005');
    });

    it('should have correct system error codes', () => {
      expect(ERROR_CODES.INTERNAL_ERROR).toBe('SYS_001');
      expect(ERROR_CODES.SERVICE_UNAVAILABLE).toBe('SYS_002');
      expect(ERROR_CODES.DATABASE_ERROR).toBe('SYS_003');
      expect(ERROR_CODES.EXTERNAL_SERVICE_ERROR).toBe('SYS_004');
    });
  });
});
