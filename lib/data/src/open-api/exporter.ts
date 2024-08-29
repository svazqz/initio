/* eslint-disable @typescript-eslint/no-unused-vars */
import * as fs from 'fs';
import { z } from 'zod';
import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';

const registry = new OpenAPIRegistry();
extendZodWithOpenApi(z);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const apiDefinitions = require('../../../../apps/next-base/data/geo/api');

try {
  Object.entries(apiDefinitions).forEach(([key, { apiConfig }]: any) => {
    registry.registerPath(apiConfig);
  });

  const generator = new OpenApiGeneratorV3(registry.definitions);

  const result = generator.generateDocument({
    info: {
      title: '',
      version: '1',
    },
    openapi: '3.0',
  });

  fs.writeFileSync(
    `${__dirname}/../../out/openapi-docs.json`,
    JSON.stringify(result, null, 2),
    {
      encoding: 'utf-8',
    },
  );

  console.log(result);
} catch (e) {
  console.log(JSON.stringify(e));
}
