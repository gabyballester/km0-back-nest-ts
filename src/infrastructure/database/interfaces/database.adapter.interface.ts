import { PrismaClient } from '@prisma/client';

/**
 * Database adapter interface for Prisma ORM
 * Provides abstraction layer for database operations
 */
export interface IDatabaseAdapter {
  /**
   * Initialize database connection
   */
  connect(): Promise<void>;

  /**
   * Close database connection
   */
  disconnect(): Promise<void>;

  /**
   * Check database health and connectivity
   */
  healthCheck(): Promise<boolean>;

  /**
   * Get database information
   */
  getDatabaseInfo(): Promise<{
    database_name: string;
    current_user: string;
    postgres_version: string;
  } | null>;

  /**
   * Get the underlying Prisma instance for advanced operations
   */
  getOrmInstance(): PrismaClient | null;

  /**
   * Get current connection status
   */
  getStatus(): DatabaseStatus;

  /**
   * Get adapter configuration
   */
  getConfig(): DatabaseAdapterConfig;
}

/**
 * Database connection status
 */
export enum DatabaseStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  ERROR = 'error',
}

/**
 * Database adapter configuration
 */
export interface DatabaseAdapterConfig {
  connectionString: string;
  maxConnections?: number;
  idleTimeout?: number;
  connectionTimeout?: number;
}
