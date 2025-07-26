/**
 * Database adapter interface for ORM abstraction
 * Allows switching between Prisma and Drizzle without changing business logic
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
   * Execute raw query for health checks
   */
  executeRawQuery(query: string): Promise<unknown>;

  /**
   * Get the underlying ORM instance for advanced operations
   */
  getOrmInstance(): unknown;
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
