import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const Categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
});
