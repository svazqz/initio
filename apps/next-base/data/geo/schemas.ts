/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const Coordinates = z
  .object({
    latitude: z.number(),
    longitude: z.number(),
  })
  .openapi('Coordinates');

const LocationData = z
  .object({
    city: z.string(),
    state: z.string(),
    country: z.string(),
  })
  .openapi('LocationData');

export namespace Geo {
  export const Schemas = {
    Coordinates,
    LocationData,
  };
}
