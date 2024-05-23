import { Geo } from '../schemas';
import { apiConsumer } from '../common';

export const getGeoByLatLong = apiConsumer('/geo', {
  queryParams: Geo.Schemas.Coordinates,
  response: Geo.Schemas.LocationData,
});
