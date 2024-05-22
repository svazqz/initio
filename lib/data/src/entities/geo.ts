/* eslint-disable @typescript-eslint/no-namespace */ import {
  pgTable,
  varchar,
} from 'drizzle-orm/pg-core';

export namespace Geo {
  export const Entity = pgTable('geo', {
    userId: varchar('userId').primaryKey(),
    name: varchar('data').notNull(),
  });

  export type SelectDTO = typeof Entity.$inferSelect;

  export type InsertDTO = typeof Entity.$inferInsert;
}
