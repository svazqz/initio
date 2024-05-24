import { createRequestHandler } from '../../_common/request';
import { Geo as GeoModel } from '@next-base/lib-data/models';
import { Geo as GeoSchemas } from '@next-base/lib-data/schemas';

export const GET = createRequestHandler(
  async (request) => {
    const allLocations = await GeoModel.Model.getAllLatLong();
    return allLocations;
  },
  {
    response: GeoSchemas.Schemas.CoordinatesList,
  },
);
