/**
 * Generic repository interface for CRUD operations
 * Provides type-safe database operations
 */
export interface IRepository<T> {
  /**
   * Find entity by ID
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find all entities with optional filters
   */
  findAll(filters?: Partial<T>): Promise<T[]>;

  /**
   * Find one entity by filters
   */
  findOne(filters: Partial<T>): Promise<T | null>;

  /**
   * Create new entity
   */
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;

  /**
   * Update entity by ID
   */
  update(
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<T>;

  /**
   * Delete entity by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Count entities with optional filters
   */
  count(filters?: Partial<T>): Promise<number>;

  /**
   * Check if entity exists by ID
   */
  exists(id: string): Promise<boolean>;
}

/**
 * Repository options for advanced queries
 */
export interface RepositoryOptions {
  limit?: number;
  offset?: number;
  orderBy?: {
    field: keyof any;
    direction: 'asc' | 'desc';
  };
}

/**
 * Pagination result
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
