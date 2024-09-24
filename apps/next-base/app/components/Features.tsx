import Image from 'next/image';
import Feature1 from '../../public/assets/feature-1.svg';
import Feature2 from '../../public/assets/feature-2.svg';
import Feature3 from '../../public/assets/feature-3.svg';
import Check from '../../public/assets/check.svg';
import bluebutton from '../../public/assets/blue-button.svg';
import greenButton from '../../public/assets/green-button.svg';
import pinkButton from '../../public/assets/pink-button.svg';
import Link from 'next/link';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/ext-language_tools';

const Features = () => {
  return (
    <div id="features" className="w-full bg-gray-900 text-white">
      <div className="container flex flex-col" style={{ maxWidth: '1100px' }}>
        <div id="zod-schemas" className="sm:flex items-center mb-14">
          <div className="sm:w-1/2">
            <p className="text-[#0085FF] font-medium text-[16px] mb-2">
              Powered by Zod Schemas
            </p>
            <h1 className="text-info font-medium text-[24px] lg:max-w-[572px] lg:text-[42px]  mb-6">
              Schema Driven Development
            </h1>

            <p className="text-primary text-[16px] lg:max-w-[500px] lg:text-[18px] mt-6 mb-6">
              Use zod to describe the input and output schemas into your
              application, so you can easyly centralize all the information your
              API is receiving and returning to the consumers.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-4 text-[16px] lg:text-[18px] text-primary">
                <Image width={48} height={48} src={Check} alt="check" />
                Zod Schemas Support.
              </li>
              <li className="flex items-center gap-4 text-[16px] lg:text-[18px] text-primary">
                <Image width={48} height={48} src={Check} alt="check" /> Easy
                integration with protocol buffers once schemas are defined.
              </li>
              <li className="flex items-start gap-4 text-[16px] lg:text-[18px] text-primary">
                <Image width={48} height={48} src={Check} alt="check" />
                Automatic validation of the data consistency.
              </li>
            </ul>
            <Link
              className="mt-6 flex items-center gap-3 font-medium text-[#0085FF] text-[14px]"
              href="https://zod.dev/"
            >
              Learn More About Zod{' '}
              <Image width={48} height={48} src={bluebutton} alt="bluebutton" />
            </Link>
          </div>
          <div className="w-screen sm:w-1/2">
            <AceEditor
              mode="javascript"
              theme="twilight"
              readOnly
              name="UNIQUE_ID_OF_DIV"
              editorProps={{ $blockScrolling: true }}
              height="400px"
              width="100%"
              value={`/* eslint-disable @typescript-eslint/no-unused-vars */
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
`}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
              }}
            />
          </div>
        </div>
        <div
          id="server-utils"
          className="sm:flex sm:flex-row-reverse sm:gap-6 items-center sm:mt-20 mb-14"
        >
          <div className="sm:w-1/2 sm:px-14">
            <p className="text-[#00A424] font-medium text-[16px] mb-2">
              Initio server utils
            </p>
            <h1 className="text-info font-medium text-[24px] lg:text-[42px] mb-6">
              Create API definitions
            </h1>
            <p className="text-primary text-[16px] lg:max-w-[500px] lg:text-[18px] mt-6 mb-6">
              Describe your API endpoints, so the API utils can infer the types
              for both server functions as well as client consumers.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-4 text-[16px] lg:text-[18px] text-primary">
                <Image width={48} height={48} src={Check} alt="check" />
                Describe the method of your endpoint
              </li>
              <li className="flex items-center gap-4 text-[16px] lg:text-[18px] text-primary">
                <Image width={48} height={48} src={Check} alt="check" />
                Define the right schemas for the endpoint
              </li>
              <li className="flex items-start gap-4 text-[16px] lg:text-[18px] text-primary">
                <Image width={48} height={48} src={Check} alt="check" />
                If required specify the corresponding proto files
              </li>
            </ul>
            <Link
              className="mt-6 flex items-center gap-3 font-medium text-[#00A424] text-[16px]"
              href="https://github.com/asteasolutions/zod-to-openapi"
            >
              Learn More About Zod-To-OpenAPI Library
            </Link>
          </div>
          <div className="w-screen sm:w-1/2">
            <AceEditor
              mode="javascript"
              theme="twilight"
              readOnly
              name="UNIQUE_ID_OF_DIV"
              editorProps={{ $blockScrolling: true }}
              height="200px"
              width="100%"
              value={`import { createRequestHandler } from '../../../../lib/data/src/common/server';
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
`}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
              }}
            />
          </div>
        </div>
        <div
          id="server-functions"
          className="sm:flex items-center sm:mt-20 sm:mb-20 mb-14"
        >
          <div className="sm:w-1/2 sm:pr-20">
            <p className="text-[#EB2891] font-medium text-[16px] mb-2">
              Next Server Functions
            </p>
            <h1 className="text-info font-medium text-[24px] lg:text-[42px] mb-6">
              Use Initio Helper Function to Create Server Functions
            </h1>
            <p className="text-primary text-[16px] lg:max-w-[500px] lg:text-[18px] mt-6 mb-6">
              Every API definition will have a 'setHandler' function that can be
              used to define the corresponding serv function. This helper will
              expose the right types to the function passed as argument.
            </p>
            <Link
              className="mt-6 flex items-center gap-3 font-medium text-[#EB2891] text-[16px]"
              href="https://nextjs.org/docs/app/building-your-application/routing"
            >
              Learn More About Next APP Router
              <Image width={48} height={48} src={pinkButton} alt="pinkButton" />
            </Link>
          </div>
          <div className="w-screen sm:w-1/2">
            <AceEditor
              mode="javascript"
              theme="twilight"
              readOnly
              name="UNIQUE_ID_OF_DIV"
              editorProps={{ $blockScrolling: true }}
              height="300px"
              width="100%"
              value={`import { getGeoData, postGeoData } from '../../../data/geo/api';
export const POST =
  postGeoData.setHandler &&
  postGeoData.setHandler(async (_request, _queryParams, payload) => {
    const lat = payload?.latitude;
    const long = payload?.longitude;
    const locationResponse = await fetch(<THIRD_PARTY_API>);
    const locationData = await locationResponse.json();
    const fullData = locationData.standard || locationData;
    return {
      city: fullData.city,
      state: fullData.state,
      country: fullData.country,
    };
  });`}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
              }}
            />
          </div>
        </div>
        <div
          id="client-consumers"
          className="sm:flex sm:flex-row-reverse sm:gap-6 items-center sm:mt-20 mb-14"
        >
          <div className="sm:w-1/2 sm:px-14">
            <p className="text-[#00A424] font-medium text-[16px] mb-2">
              Straight Forward Consumer
            </p>
            <h1 className="text-info font-medium text-[24px] lg:text-[42px] mb-6">
              Create a React Query based Consumer
            </h1>
            <p className="text-primary text-[16px] lg:max-w-[500px] lg:text-[18px] mt-6 mb-6">
              Once you have defined your API endpoint, you can easyly create a
              consumer, which will have the infered types and will help you to
              see the right data for each endpoint. (Mutators will come in
              future releases)
            </p>

            <Link
              className="mt-6 flex items-center gap-3 font-medium text-[#00A424] text-[16px]"
              href="https://tanstack.com/query/v3"
            >
              Learn More About React Query
              <Image
                width={48}
                height={48}
                src={greenButton}
                alt="greenbutton"
              />
            </Link>
          </div>
          <div className="w-screen sm:w-1/2">
            <AceEditor
              mode="javascript"
              theme="twilight"
              readOnly
              name="UNIQUE_ID_OF_DIV"
              editorProps={{ $blockScrolling: true }}
              height="900px"
              width="100%"
              value={`'use client';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { apiConsumer } from '@next-base/lib-data/common/client';
import { Input } from '@next-base/lib-ui';
import { retrieveGeoData } from 'apps/next-base/data/geo/api';

const retrieveGeoDataConsumer = apiConsumer(retrieveGeoData);

const GeoData = function Index() {
  const [latitude, setLatitude] = useState(19.3906594);
  const [longitude, setLongitude] = useState(-99.308425);
  const { query, queryKey } = retrieveGeoDataConsumer({
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
`}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
