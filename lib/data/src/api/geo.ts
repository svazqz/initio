import { createRequestHandler } from '../common/server';
import { Geo as GeoSchemas } from '../schemas';
import { Geo as GeoModels } from '../models';

export const getGeoList = createRequestHandler({
  handler: async (request) => {
    const allLocations = await GeoModels.Model.getAllLatLong();
    return allLocations;
  },
  schemas: {
    response: GeoSchemas.Schemas.CoordinatesList,
  },
});
