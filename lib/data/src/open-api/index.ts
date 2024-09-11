/* eslint-disable @typescript-eslint/no-unused-vars */
import * as fs from 'fs';
import { z } from 'zod';
import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';
import { exec } from 'child_process';

if (process.argv.length < 3) {
  throw new Error('Target app was not defined.');
}

const registry = new OpenAPIRegistry();
extendZodWithOpenApi(z);

const root = process.argv[0].replace('/node_modules/ts-node/dist/bin.js', '');
const targetApp = process.argv[process.argv.length - 1];
// eslint-disable-next-line @typescript-eslint/no-var-requires
const apiDefinitions = require(`${root}/apps/${targetApp}/data/index`);

const command = `mkdir -p ${root}/dist/apps/openapi`;
exec(command, (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    throw new Error(JSON.stringify(err));
    return;
  }
  try {
    Object.entries(apiDefinitions).forEach(([namespace, definitions]) => {
      Object.entries(definitions as any).forEach(([key, def]) => {
        registry.registerPath((def as any).apiConfig);
      });
    });

    const generator = new OpenApiGeneratorV3(registry.definitions);

    const result = generator.generateDocument({
      info: {
        title: '',
        version: '1',
      },
      openapi: '3.0.0',
    });

    fs.writeFileSync(
      `${root}/dist/apps/openapi/docs.json`,
      JSON.stringify(result, null, 2),
      {
        encoding: 'utf-8',
      },
    );

    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.log(JSON.stringify(e));
  }
});

/*



try {
  Object.entries(apiDefinitions).forEach(([namespace, definitions]) => {
    Object.entries(definitions as any).forEach(([key, def]) => {
      registry.registerPath((def as any).apiConfig);
    });
  });

  const generator = new OpenApiGeneratorV3(registry.definitions);

  const result = generator.generateDocument({
    info: {
      title: '',
      version: '1',
    },
    openapi: '3.0.0',
  });

  fs.writeFileSync(
    `${__dirname}/../../out/openapi-docs.json`,
    JSON.stringify(result, null, 2),
    {
      encoding: 'utf-8',
    },
  );

  console.log(JSON.stringify(result, null, 2));
} catch (e) {
  console.log(JSON.stringify(e));
}
*/
