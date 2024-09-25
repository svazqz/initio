# Initio

Initio is an project designed to streamline the development of new applications and their accompanying documentation. Based on Typescript, Next.js, Zod, ReqctQuery, and the zod-to-openapi library—NextBase significantly reduces the overhead typically associated with these processes.

## Getting started

### Prerequisites

- pnpm v8.6.11
- nx v17.1.1
- node v18.17.0
- vscode
- Nx Console (extension for vscode)

### Set up project

Once you have downloaded the project run the `pnpm i` command in the root of the project. Then navigate to `lib/ui` and run again `pnpm i`.

From Nx Console run the build command inside the `lib/ui` folder, this will create the corresponding ui components so they can be imported from the apps (currently this is the only way to have a cross app `lib/ui`, since the components are no preprocessed properly when they are called directly from the lib). If you perform any changes or add new components to the `lib/ui` you'll have to run the `build` command again.

Create a `.env.local` file under the next-base app and add the following `NEXT_PUBLIC_BASE_API_URL=http://localhost:4200/api`

## Core Concepts

### File structure

In this case we are using a domain based schema named geo, which works as an example to ilustrate the implementation.

apps/next-base (target application)
├── data
│ ├── geo (example domain unit)
│ │ ├── api.ts (defines the API endpoints using schemas)
│ │ ├── entities.ts (defines the DB entities)
│ │ ├── models.ts (this file contains a class that allows schemas and entities interactions, a model always produce schema based info)
│ │ ├── schemas.proto (contains the proto schema definition)
│ │ ├── schemas.ts (contains all the zod schemas definitions)
│ │ └── types.ts (if there are any intermediate types required those goes here)
│ └── index.ts (exports all the API definitions contained on each domain unit)
└── proto.txt (exposes the domain units that contains a proto schema)

### Schema

At the heart of Initio is the Schema, a ZodObject that defines the structure for key elements of an API request, including query parameters, URL parameters, rquest body, and response. This robust schema validation ensures consistency and reliability across your application. The schemas will be located on each app acording to the domain of each app. This way every app can set their own scope foe each schema. An example of this schema can be found in the `app/next-base/data/geo/schemas.ts` file:

```typescript
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
```

### Request Handler

Initio proposes a request/api driven development, this means that all the api endpoins are defined first setting the input, output, params and query formats so when handler function is defined it has access to auto complete features and the same happens with consumer. An example of a request definition can be as follow:

```typescript
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
  method: 'post',
  endpoint: '/geo',
  schemas: {
    payload: GeoSchemas.Schemas.Coordinates,
    response: GeoSchemas.Schemas.LocationData,
  },
  protoIn: 'geo.Coordinates',
  protoOut: 'geo.LocationData',
});
```

And the used in the next api definition as follows:

```typescript
import { getGeoData, postGeoData } from '../../../data/geo/api';

export const GET =
  getGeoData.setHandler &&
  getGeoData.setHandler(async (request) => {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('latitude');
    const long = searchParams.get('longitude');
    const locationResponse = await fetch(
      `https://geocode.xyz/${lat},${long}?json=1`,
    );
    const locationData = await locationResponse.json();
    return locationData.standard || locationData;
  });

export const POST =
  postGeoData.setHandler &&
  postGeoData.setHandler(async (_request, _queryParams, payload) => {
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
  });
```

### Consumer

Initio consumers are objects based in a request definition that uses react query internally to perform the comunication to the api. Even if api is not implemented in the next app, the definition of it will be helpful to use it on the auto generation of documentation and also the consumers. Here is an example to a consumer using the previous definition:

```typescript
'use client';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { apiConsumer } from '@next-base/lib-data/common/client';
import { Input } from '@next-base/lib-ui';
import { postGeoData } from 'apps/next-base/data/geo/api';

const GeoData = function Index() {
  const [latitude, setLatitude] = useState(19.3906594);
  const [longitude, setLongitude] = useState(-99.308425);
  const { query, queryKey } = apiConsumer(postGeoData)({
    body: {
      latitude,
      longitude,
    },
  });

  const onChangeLatitude = (ev: ChangeEvent<HTMLInputElement>) => {
    setLatitude(Number(ev.target.value));
  };

  const onChangeLongitude = (ev: ChangeEvent<HTMLInputElement>) => {
    setLongitude(Number(ev.target.value));
  };

  if (query.isLoading) return <>Loading...</>;

  if (query.error) return <>Error</>;

  return (
    <>
      <Input
        placeholder="latitude"
        onChange={onChangeLatitude}
        value={latitude}
      />
      <Input
        placeholder="longitude"
        onChange={onChangeLongitude}
        value={longitude}
      />
      <br />
      <textarea style={{ width: '100%', height: '40px' }}>
        {JSON.stringify(query.data)}
      </textarea>
      <br />
      <textarea style={{ width: '100%', height: '40px' }}>
        {JSON.stringify(queryKey)}
      </textarea>
      <br />
    </>
  );
};

export default GeoData;
```

### Generate OpenAPI docs

You can generate the open API documentation by running the command `pnpm exec nx run lib-data:open-api-generator <target-app>` which will generate the following output as well as the corresponding JSON that will be exposed under `/api/docs` and `/docs` endpoints.

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

_Note:_ In order to use this feature you have to explicitly add the api files you want to be exported in the lib/data/src/open-api/exporter.ts file; also all the imports in any app needs to be made using the relative path notation, since the command for exporting the info does not load the tsconfig properly. You can take a look of this in the geo demo implementation.

## Deploy

If you want to deploy a project based on this repo in vercel you will need to override the following:

Build command:

```
pnpm run next-base:build:prod
```

Output directory:

```
dist/apps/next-base/.next
```

Install command:

```
pnpm install --frozen-lockfile
```

The previous configuration will create the corresponding intermediate files for the OpenAPI and proto implementations if the file structure has been implemented as described previously.

## Donate

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=BTJPCXNPH43YC)
