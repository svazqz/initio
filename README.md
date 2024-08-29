# NextBase

NextBase is an innovative project designed to streamline the development of new applications and their accompanying documentation. Leveraging cutting-edge technologies—Typescript, Next.js, Zod, and the zod-to-openapi library—NextBase significantly reduces the overhead typically associated with these processes.

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

### Schema

At the heart of NextBase is the Schema, a ZodObject that defines the structure for key elements of an API request, including query parameters, URL parameters, request bodies, and responses. This robust schema validation ensures consistency and reliability across your application. The schemas will be located on each app acording to the domain of each app. This way every app can set their own scope foe each schema. An example of this schema can be found in the `app/next-base/data/schemas` folder in the `geo.ts` file:

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

### Request Handler

NextBase proposes a request/api driven development, this means that all the api endpoins are defined first setting the input, output, params and query formats so when handler function is defined it has access to auto complete features and the same happens with consumer. An example of a request definition can be as follow:

```typescript
import { createRequestHandler } from '../../../../lib/data/src/common/server';
import { Geo as GeoSchemas } from '../schemas';

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
```

And the used in the nex api definition as follows:

```typescript
import { postGeoData } from '../../../data/api/geo';

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

In NextBase, consumers are objects based in a request definition that uses react query internally to perform the comunication to the api. Even if api is not implemented in the next app, the definition of it will be helpful to use it on the auto generation of documentation and also the consumers. Here is an example to a consumer using the previous definition:

```typescript
import { apiConsumer } from '../../../../lib/data/src/common/client';
import { postGeoData } from '../api';

export const getGeoDataConsumer = apiConsumer(postGeoData);
```

### Generate OpenAPI docs

The definition of the api request handlers allow us to get the following open API definition out of the box by runing the nx command `nx run lib-data:exporter` (WIP to improve the way consumers are loaded in the exporter):

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

## Curren known issues

- API list needs to be created manually on the lib/data library
- The routes/paths to the lib/data/common need to be relative, since ts routes from tsconfig are not resolved porperly when exporting api definitions.

## Changelog

- ~~Cannot use models on the api definitions since it will require backend libraries and so will thrown an exception when consumers are used.~~ Models can now be used in server functions, since exporter flow will not require such functions, it will use only the api definitions.


## Donate

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=BTJPCXNPH43YC)
