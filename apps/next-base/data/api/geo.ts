import { createRequestHandler } from '../../../../lib/data/src/common/server';
import { Geo as GeoSchemas } from '../schemas';
// import { Geo as GeoModel } from '../models';

// export const getGeoList = createRequestHandler({
//   handler: async (request) => {
//     const allLocations = await GeoModel.getAllLatLong();
//     return allLocations;
//   },
//   schemas: {
//     response: GeoSchemas.Schemas.CoordinatesList,
//   },
// });

export const getGeoData = createRequestHandler({
  endpoint: '/geo',
  schemas: {
    queryParams: GeoSchemas.Schemas.Coordinates,
    response: GeoSchemas.Schemas.LocationData,
  },
  handler: async (request) => {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('latitude');
    const long = searchParams.get('longitude');
    const locationResponse = await fetch(
      `https://geocode.xyz/${lat},${long}?json=1`,
    );
    const locationData = await locationResponse.json();
    return locationData.standard || locationData;
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
  handler: async (_request, _queryParams, payload) => {
    const lat = payload?.latitude;
    const long = payload?.longitude;
    const locationResponse = await fetch(
      `https://geocode.xyz/${lat},${long}?json=1`,
    );
    const locationData = await locationResponse.json();
    const fullData = locationData.standard || locationData;
    return {
      city: fullData.city,
      state: fullData.state,
      country: fullData.country,
    };
  },
});
