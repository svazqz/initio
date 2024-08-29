/* eslint-disable @typescript-eslint/no-namespace */
import { z } from 'zod';

const Coordinates = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const CoordinatesList = z.object({
  values: z.array(Coordinates),
});

const LocationData = z.object({
  city: z.string(),
  state: z.string(),
  country: z.string(),
});

export namespace Geo {
  export const Schemas = {
    Coordinates,
    CoordinatesList,
    LocationData,
  };
}
