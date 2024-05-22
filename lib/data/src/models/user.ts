import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const Users = pgTable('users', {
  id: varchar('id').primaryKey(),
});

export type User = typeof Users.$inferSelect;
export type UserInsert = typeof Users.$inferInsert;

export default User;
