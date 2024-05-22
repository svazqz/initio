/* eslint-disable @typescript-eslint/no-namespace */
import { Geo as GeoSchemas } from '../schemas';
import { DTO } from '../utils';

export namespace Geo {
  export type CoordinatesDTO = DTO<typeof GeoSchemas.Schemas.Coordinates>;
  export type LocationDataDTO = DTO<typeof GeoSchemas.Schemas.LocationData>;
}
