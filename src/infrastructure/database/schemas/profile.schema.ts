import {
  pgTable,
  text,
  timestamp,
  varchar,
  date,
  jsonb,
  boolean,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { users } from './user.schema';

/**
 * Profile schema using Drizzle ORM
 * One-to-one relationship with users table
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
  avatar: varchar('avatar', { length: 500 }),
  bio: text('bio'),
  dateOfBirth: date('date_of_birth'),
  location: varchar('location', { length: 100 }),
  website: varchar('website', { length: 255 }),

  // Social media links (stored as JSON)
  socialLinks: jsonb('social_links').$type<{
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
    facebook?: string;
  }>(),

  // User preferences (stored as JSON)
  preferences: jsonb('preferences').$type<{
    theme?: 'light' | 'dark' | 'auto';
    language?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
    privacy?: {
      profileVisibility?: 'public' | 'private' | 'friends';
      showEmail?: boolean;
      showPhone?: boolean;
    };
  }>(),

  // Profile status
  isPublic: boolean('is_public').notNull().default(true),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Profile type inferred from schema
 */
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
