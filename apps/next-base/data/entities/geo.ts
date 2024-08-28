/* eslint-disable @typescript-eslint/no-namespace */ import {
  pgTable,
  doublePrecision,
} from 'drizzle-orm/pg-core';

export namespace Geo {
  export const Entity = pgTable('geo', {
    latitude: doublePrecision('latitude').notNull(),
    longitude: doublePrecision('longitude').notNull(),
  });

  export type SelectDTO = typeof Entity.$inferSelect;

  export type InsertDTO = typeof Entity.$inferInsert;
}
