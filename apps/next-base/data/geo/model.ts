/* eslint-disable @typescript-eslint/no-namespace */
import { DTO } from '../../../../lib/data/src/common/utils';
import { db } from '../../../../lib/data/src//common/db';
import { Geo as GeoSchemas } from '../schemas';
import { Geo as GeoEntity } from './entities';

export class Geo {
  constructor() {}

  static async getAllLatLong(): Promise<{
    values: DTO<typeof GeoSchemas.Schemas.Coordinates>[];
  }> {
    const values = await db.select().from(GeoEntity.Entity);
    return { values };
  }
}
