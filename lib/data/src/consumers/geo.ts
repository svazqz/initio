import { Geo } from '../schemas';
import { useApiConsumer } from './common';

export const useGetGeoByLatLongGet = useApiConsumer('/geo', {
  queryParams: Geo.Schemas.Coordinates,
  response: Geo.Schemas.LocationData,
});
