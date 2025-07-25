/**
 * Business-related constants
 * Centralized constants for business logic and domain rules
 */

// Base values for user roles
const USER_ROLE_VALUES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  SELLER: 'seller',
  BUYER: 'buyer',
  GUEST: 'guest',
} as const;

/**
 * User Roles and Permissions
 * User role and permission constants
 */
export const USER_ROLES = {
  // User Roles
  ADMIN: USER_ROLE_VALUES.ADMIN,
  MODERATOR: USER_ROLE_VALUES.MODERATOR,
  SELLER: USER_ROLE_VALUES.SELLER,
  BUYER: USER_ROLE_VALUES.BUYER,
  GUEST: USER_ROLE_VALUES.GUEST,

  // Role Hierarchy (higher number = more permissions)
  ROLE_HIERARCHY: {
    [USER_ROLE_VALUES.ADMIN]: 100,
    [USER_ROLE_VALUES.MODERATOR]: 80,
    [USER_ROLE_VALUES.SELLER]: 60,
    [USER_ROLE_VALUES.BUYER]: 40,
    [USER_ROLE_VALUES.GUEST]: 20,
  },

  // Default Role
  DEFAULT_ROLE: USER_ROLE_VALUES.BUYER,
} as const;

// Base values for user status
const USER_STATUS_VALUES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
  PENDING_VERIFICATION: 'pending_verification',
  DELETED: 'deleted',
} as const;

/**
 * User Status
 * User account status constants
 */
export const USER_STATUS = {
  ACTIVE: USER_STATUS_VALUES.ACTIVE,
  INACTIVE: USER_STATUS_VALUES.INACTIVE,
  SUSPENDED: USER_STATUS_VALUES.SUSPENDED,
  BANNED: USER_STATUS_VALUES.BANNED,
  PENDING_VERIFICATION: USER_STATUS_VALUES.PENDING_VERIFICATION,
  DELETED: USER_STATUS_VALUES.DELETED,

  // Status Hierarchy
  STATUS_HIERARCHY: {
    [USER_STATUS_VALUES.ACTIVE]: 100,
    [USER_STATUS_VALUES.PENDING_VERIFICATION]: 80,
    [USER_STATUS_VALUES.INACTIVE]: 60,
    [USER_STATUS_VALUES.SUSPENDED]: 40,
    [USER_STATUS_VALUES.BANNED]: 20,
    [USER_STATUS_VALUES.DELETED]: 0,
  },
} as const;

// Base values for product categories
const PRODUCT_CATEGORY_VALUES = {
  FOOD_AND_BEVERAGES: 'food_and_beverages',
  AGRICULTURE: 'agriculture',
  HANDMADE: 'handmade',
  SERVICES: 'services',
  TECHNOLOGY: 'technology',
  HEALTH_AND_WELLNESS: 'health_and_wellness',
  EDUCATION: 'education',
  ENTERTAINMENT: 'entertainment',
  OTHER: 'other',
} as const;

/**
 * Product Categories
 * Product category constants
 */
export const PRODUCT_CATEGORIES = {
  // Main Categories
  FOOD_AND_BEVERAGES: PRODUCT_CATEGORY_VALUES.FOOD_AND_BEVERAGES,
  AGRICULTURE: PRODUCT_CATEGORY_VALUES.AGRICULTURE,
  HANDMADE: PRODUCT_CATEGORY_VALUES.HANDMADE,
  SERVICES: PRODUCT_CATEGORY_VALUES.SERVICES,
  TECHNOLOGY: PRODUCT_CATEGORY_VALUES.TECHNOLOGY,
  HEALTH_AND_WELLNESS: PRODUCT_CATEGORY_VALUES.HEALTH_AND_WELLNESS,
  EDUCATION: PRODUCT_CATEGORY_VALUES.EDUCATION,
  ENTERTAINMENT: PRODUCT_CATEGORY_VALUES.ENTERTAINMENT,
  OTHER: PRODUCT_CATEGORY_VALUES.OTHER,

  // Category Display Names
  CATEGORY_NAMES: {
    [PRODUCT_CATEGORY_VALUES.FOOD_AND_BEVERAGES]: 'Food & Beverages',
    [PRODUCT_CATEGORY_VALUES.AGRICULTURE]: 'Agriculture',
    [PRODUCT_CATEGORY_VALUES.HANDMADE]: 'Handmade',
    [PRODUCT_CATEGORY_VALUES.SERVICES]: 'Services',
    [PRODUCT_CATEGORY_VALUES.TECHNOLOGY]: 'Technology',
    [PRODUCT_CATEGORY_VALUES.HEALTH_AND_WELLNESS]: 'Health & Wellness',
    [PRODUCT_CATEGORY_VALUES.EDUCATION]: 'Education',
    [PRODUCT_CATEGORY_VALUES.ENTERTAINMENT]: 'Entertainment',
    [PRODUCT_CATEGORY_VALUES.OTHER]: 'Other',
  },
} as const;

// Base values for product status
const PRODUCT_STATUS_VALUES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SOLD_OUT: 'sold_out',
  DISCONTINUED: 'discontinued',
  PENDING_APPROVAL: 'pending_approval',
  REJECTED: 'rejected',
  DRAFT: 'draft',
} as const;

/**
 * Product Status
 * Product status constants
 */
export const PRODUCT_STATUS = {
  ACTIVE: PRODUCT_STATUS_VALUES.ACTIVE,
  INACTIVE: PRODUCT_STATUS_VALUES.INACTIVE,
  SOLD_OUT: PRODUCT_STATUS_VALUES.SOLD_OUT,
  DISCONTINUED: PRODUCT_STATUS_VALUES.DISCONTINUED,
  PENDING_APPROVAL: PRODUCT_STATUS_VALUES.PENDING_APPROVAL,
  REJECTED: PRODUCT_STATUS_VALUES.REJECTED,
  DRAFT: PRODUCT_STATUS_VALUES.DRAFT,

  // Status Hierarchy
  STATUS_HIERARCHY: {
    [PRODUCT_STATUS_VALUES.ACTIVE]: 100,
    [PRODUCT_STATUS_VALUES.PENDING_APPROVAL]: 80,
    [PRODUCT_STATUS_VALUES.DRAFT]: 60,
    [PRODUCT_STATUS_VALUES.SOLD_OUT]: 40,
    [PRODUCT_STATUS_VALUES.INACTIVE]: 20,
    [PRODUCT_STATUS_VALUES.REJECTED]: 10,
    [PRODUCT_STATUS_VALUES.DISCONTINUED]: 0,
  },
} as const;

// Base values for order status
const ORDER_STATUS_VALUES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  DISPUTED: 'disputed',
} as const;

/**
 * Order Status
 * Order status constants
 */
export const ORDER_STATUS = {
  PENDING: ORDER_STATUS_VALUES.PENDING,
  CONFIRMED: ORDER_STATUS_VALUES.CONFIRMED,
  PROCESSING: ORDER_STATUS_VALUES.PROCESSING,
  SHIPPED: ORDER_STATUS_VALUES.SHIPPED,
  DELIVERED: ORDER_STATUS_VALUES.DELIVERED,
  CANCELLED: ORDER_STATUS_VALUES.CANCELLED,
  REFUNDED: ORDER_STATUS_VALUES.REFUNDED,
  DISPUTED: ORDER_STATUS_VALUES.DISPUTED,

  // Status Flow
  STATUS_FLOW: {
    [ORDER_STATUS_VALUES.PENDING]: [
      ORDER_STATUS_VALUES.CONFIRMED,
      ORDER_STATUS_VALUES.CANCELLED,
    ],
    [ORDER_STATUS_VALUES.CONFIRMED]: [
      ORDER_STATUS_VALUES.PROCESSING,
      ORDER_STATUS_VALUES.CANCELLED,
    ],
    [ORDER_STATUS_VALUES.PROCESSING]: [
      ORDER_STATUS_VALUES.SHIPPED,
      ORDER_STATUS_VALUES.CANCELLED,
    ],
    [ORDER_STATUS_VALUES.SHIPPED]: [
      ORDER_STATUS_VALUES.DELIVERED,
      ORDER_STATUS_VALUES.DISPUTED,
    ],
    [ORDER_STATUS_VALUES.DELIVERED]: [
      ORDER_STATUS_VALUES.REFUNDED,
      ORDER_STATUS_VALUES.DISPUTED,
    ],
    [ORDER_STATUS_VALUES.CANCELLED]: [],
    [ORDER_STATUS_VALUES.REFUNDED]: [],
    [ORDER_STATUS_VALUES.DISPUTED]: [
      ORDER_STATUS_VALUES.REFUNDED,
      ORDER_STATUS_VALUES.DELIVERED,
    ],
  },

  // Status Hierarchy
  STATUS_HIERARCHY: {
    [ORDER_STATUS_VALUES.PENDING]: 10,
    [ORDER_STATUS_VALUES.CONFIRMED]: 20,
    [ORDER_STATUS_VALUES.PROCESSING]: 30,
    [ORDER_STATUS_VALUES.SHIPPED]: 40,
    [ORDER_STATUS_VALUES.DELIVERED]: 50,
    [ORDER_STATUS_VALUES.DISPUTED]: 60,
    [ORDER_STATUS_VALUES.REFUNDED]: 70,
    [ORDER_STATUS_VALUES.CANCELLED]: 0,
  },
} as const;

// Base values for payment methods
const PAYMENT_METHOD_VALUES = {
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  DIGITAL_WALLET: 'digital_wallet',
  CRYPTO: 'crypto',
} as const;

/**
 * Payment Methods
 * Payment method constants
 */
export const PAYMENT_METHODS = {
  CASH: PAYMENT_METHOD_VALUES.CASH,
  BANK_TRANSFER: PAYMENT_METHOD_VALUES.BANK_TRANSFER,
  CREDIT_CARD: PAYMENT_METHOD_VALUES.CREDIT_CARD,
  DEBIT_CARD: PAYMENT_METHOD_VALUES.DEBIT_CARD,
  DIGITAL_WALLET: PAYMENT_METHOD_VALUES.DIGITAL_WALLET,
  CRYPTO: PAYMENT_METHOD_VALUES.CRYPTO,

  // Payment Method Names
  METHOD_NAMES: {
    [PAYMENT_METHOD_VALUES.CASH]: 'Cash',
    [PAYMENT_METHOD_VALUES.BANK_TRANSFER]: 'Bank Transfer',
    [PAYMENT_METHOD_VALUES.CREDIT_CARD]: 'Credit Card',
    [PAYMENT_METHOD_VALUES.DEBIT_CARD]: 'Debit Card',
    [PAYMENT_METHOD_VALUES.DIGITAL_WALLET]: 'Digital Wallet',
    [PAYMENT_METHOD_VALUES.CRYPTO]: 'Cryptocurrency',
  },

  // Payment Method Fees (percentage)
  METHOD_FEES: {
    [PAYMENT_METHOD_VALUES.CASH]: 0,
    [PAYMENT_METHOD_VALUES.BANK_TRANSFER]: 0,
    [PAYMENT_METHOD_VALUES.CREDIT_CARD]: 2.5,
    [PAYMENT_METHOD_VALUES.DEBIT_CARD]: 1.5,
    [PAYMENT_METHOD_VALUES.DIGITAL_WALLET]: 1.0,
    [PAYMENT_METHOD_VALUES.CRYPTO]: 0.5,
  },
} as const;

/**
 * Notification Types
 * Notification type constants
 */
export const NOTIFICATION_TYPES = {
  // Order Notifications
  ORDER_CONFIRMED: 'order_confirmed',
  ORDER_SHIPPED: 'order_shipped',
  ORDER_DELIVERED: 'order_delivered',
  ORDER_CANCELLED: 'order_cancelled',

  // Product Notifications
  PRODUCT_APPROVED: 'product_approved',
  PRODUCT_REJECTED: 'product_rejected',
  PRODUCT_SOLD_OUT: 'product_sold_out',

  // User Notifications
  ACCOUNT_VERIFIED: 'account_verified',
  PASSWORD_CHANGED: 'password_changed',
  EMAIL_VERIFIED: 'email_verified',

  // System Notifications
  SYSTEM_MAINTENANCE: 'system_maintenance',
  SECURITY_ALERT: 'security_alert',
  NEWSLETTER: 'newsletter',

  // Chat Notifications
  NEW_MESSAGE: 'new_message',
  MESSAGE_READ: 'message_read',
} as const;

/**
 * Business Rules
 * Business logic constants
 */
export const BUSINESS_RULES = {
  // Commission and Fees
  PLATFORM_COMMISSION: 5.0, // 5% platform commission
  MINIMUM_COMMISSION: 1.0, // Minimum $1 commission
  MAXIMUM_COMMISSION: 50.0, // Maximum $50 commission

  // Order Limits
  MINIMUM_ORDER_AMOUNT: 5.0, // Minimum $5 order
  MAXIMUM_ORDER_AMOUNT: 10000.0, // Maximum $10,000 order
  MAXIMUM_ITEMS_PER_ORDER: 50, // Maximum 50 items per order

  // Product Limits
  MAXIMUM_PRODUCTS_PER_SELLER: 1000, // Maximum 1000 products per seller
  MAXIMUM_PRODUCT_PRICE: 50000.0, // Maximum $50,000 per product
  MINIMUM_PRODUCT_PRICE: 0.01, // Minimum $0.01 per product

  // Review and Rating
  MINIMUM_REVIEW_LENGTH: 10, // Minimum 10 characters for review
  MAXIMUM_REVIEW_LENGTH: 1000, // Maximum 1000 characters for review
  MINIMUM_RATING: 1, // Minimum rating value
  MAXIMUM_RATING: 5, // Maximum rating value

  // Time Limits
  ORDER_CANCELLATION_WINDOW: 24 * 60 * 60, // 24 hours to cancel order
  REFUND_WINDOW: 7 * 24 * 60 * 60, // 7 days to request refund
  DISPUTE_WINDOW: 30 * 24 * 60 * 60, // 30 days to open dispute
  PRODUCT_APPROVAL_TIMEOUT: 3 * 24 * 60 * 60, // 3 days for product approval

  // Geographic Limits
  MAXIMUM_DELIVERY_DISTANCE: 50, // 50 km maximum delivery distance
  SUPPORTED_COUNTRIES: ['ES', 'PT', 'FR', 'IT', 'DE'], // Supported countries
  DEFAULT_CURRENCY: 'EUR', // Default currency
} as const;

/**
 * Error Codes
 * Business error code constants
 */
export const ERROR_CODES = {
  // Authentication Errors
  INVALID_CREDENTIALS: 'AUTH_001',
  TOKEN_EXPIRED: 'AUTH_002',
  INSUFFICIENT_PERMISSIONS: 'AUTH_003',
  ACCOUNT_LOCKED: 'AUTH_004',

  // Validation Errors
  INVALID_INPUT: 'VAL_001',
  MISSING_REQUIRED_FIELD: 'VAL_002',
  INVALID_FORMAT: 'VAL_003',
  VALUE_OUT_OF_RANGE: 'VAL_004',

  // Business Logic Errors
  INSUFFICIENT_STOCK: 'BUS_001',
  ORDER_TOO_SMALL: 'BUS_002',
  ORDER_TOO_LARGE: 'BUS_003',
  PRODUCT_NOT_AVAILABLE: 'BUS_004',
  USER_NOT_VERIFIED: 'BUS_005',

  // System Errors
  INTERNAL_ERROR: 'SYS_001',
  SERVICE_UNAVAILABLE: 'SYS_002',
  DATABASE_ERROR: 'SYS_003',
  EXTERNAL_SERVICE_ERROR: 'SYS_004',
} as const;
