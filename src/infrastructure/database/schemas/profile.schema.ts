import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { users } from './user.schema';

/**
 * Profile schema using Drizzle ORM
 * Contains user profile information (1:1 relationship with users)
 */
export const profiles = pgTable('profiles', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),

  // Foreign key to users table (1:1 relationship)
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Basic profile information
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  language: varchar('language', { length: 10 }).default('es'),
  city: varchar('city', { length: 100 }),
  postalCode: varchar('postal_code', { length: 10 }),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Profile type inferred from schema
 */
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
