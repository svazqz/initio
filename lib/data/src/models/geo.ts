/* eslint-disable @typescript-eslint/no-namespace */
import { db } from '../common/db';
import { Geo as GeoSchemas } from '../schemas';
import { Geo as GeoEntity } from '../entities';
import { DTO } from '../common/utils';

export class Geo {
  constructor() {}

  static async getAllLatLong(): Promise<{
    values: DTO<typeof GeoSchemas.Schemas.Coordinates>[];
  }> {
    const values = await db.select().from(GeoEntity.Entity);
    return { values };
  }
}
