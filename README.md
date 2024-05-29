# NextBase

NextBase is an innovative project designed to streamline the development of new applications and their accompanying documentation. Leveraging cutting-edge technologies—Typescript, Next.js, Zod, and the zod-to-openapi library—NextBase significantly reduces the overhead typically associated with these processes.

## Core Concepts

###Schema
At the heart of NextBase is the Schema, a ZodObject that defines the structure for key elements of an API request, including query parameters, URL parameters, request bodies, and responses. This robust schema validation ensures consistency and reliability across your application.

```typescript
/* eslint-disable @typescript-eslint/no-namespace */
import { z } from 'zod';

const Coordinates = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const LocationData = z.object({
  city: z.string(),
  state: z.string(),
  country: z.string(),
});

export namespace Geo {
  export const Schemas = {
    Coordinates,
    LocationData,
  };
}
```

### Consumer

In NextBase, consumers are the definitive source of truth, delineating the Zod schemas involved in every API call. This consumer-centric approach enhances clarity and maintainability, ensuring that API interactions are consistently validated and documented.

```typescript
import { apiConsumer } from '../common/client';
import { getGeoList } from '../api';

export const getGeoListConsumer = apiConsumer(getGeoList.definition);
```

### Request Handler

NextBase revolutionizes request handling by tying it directly to the consumer definitions. This alignment minimizes discrepancies between schema definitions and promotes seamless adaptability. Whether integrating a new serverless function or evolving existing backend services, the request handler ensures that API definitions remain stable and consistent.

```typescript
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
```

The previous concepts allow also to get the following open API definition out of the box by runing the nx command `nx run lib-data:exporter` (WIP to improve the way consumers are loaded in the exporter):

```json
{
  "info": {
    "title": "",
    "version": "1"
  },
  "openapi": "3.0",
  "components": {
    "schemas": {
      "Response": {
        "type": "object",
        "properties": {
          "city": {
            "type": "string"
          },
          "state": {
            "type": "string"
          },
          "country": {
            "type": "string"
          }
        },
        "required": ["city", "state", "country"]
      }
    },
    "parameters": {}
  },
  "paths": {
    "/geo": {
      "get": {
        "summary": "",
        "parameters": [
          {
            "schema": {
              "type": "number"
            },
            "required": true,
            "name": "latitude",
            "in": "query"
          },
          {
            "schema": {
              "type": "number"
            },
            "required": true,
            "name": "longitude",
            "in": "query"
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Response"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

NextBase isn't just a tool; it's a paradigm shift in how developers approach app creation and documentation. By integrating these advanced technologies, NextBase empowers developers to build faster, more reliable applications with less effort. Join the future of app development with NextBase, and experience the next level of innovation.
