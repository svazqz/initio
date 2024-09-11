import { createRequestHandler } from '../../../../lib/data/src/common/server';
import { Geo as GeoSchemas } from './schemas';

export const getGeoData = createRequestHandler({
  endpoint: '/geo',
  schemas: {
    queryParams: GeoSchemas.Schemas.Coordinates,
    response: GeoSchemas.Schemas.LocationData,
  },
});

export const postGeoData = createRequestHandler({
  method: 'POST',
  endpoint: '/geo',
  schemas: {
    payload: GeoSchemas.Schemas.Coordinates,
    response: GeoSchemas.Schemas.LocationData,
  },
  protoIn: 'geo.Coordinates',
  protoOut: 'geo.LocationData',
});
