import {
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

/**
 * User schema using Drizzle ORM
 * Contains only basic user authentication and authorization data
 */
export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  isBlocked: boolean('is_blocked').notNull().default(false),
  role: text('role').notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * User type inferred from schema
 */
export type User = typeof users.$inferSelect;

/**
 * New user type for insert operations
 */
export type NewUser = typeof users.$inferInsert;
