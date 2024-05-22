/* eslint-disable @typescript-eslint/no-namespace */ import {
  integer,
  pgTable,
  varchar,
} from 'drizzle-orm/pg-core';

export namespace Artist {
  export const Entity = pgTable('artists', {
    userId: varchar('userId').primaryKey(),
    name: varchar('name').notNull().unique(),
    categoryId: integer('categoryId'),
  });

  export type SelectDTO = typeof Entity.$inferSelect;

  export type InsertDTO = typeof Entity.$inferInsert;
}
