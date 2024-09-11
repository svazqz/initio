/* eslint-disable @typescript-eslint/no-var-requires */
import * as protobuf from 'protobufjs';
import { NextResponse } from 'next/server';
import { ZodType, z } from 'zod';
import path from 'path';
import {
  setOpenAPIMetadata,
  validatePayload,
  validateQueryParams,
} from './utils';
import { ServerFnDefinition, NextBaseRequest } from './types';
const fs = require('fs');

const protoDirectoryPath =
  process.env.NODE_ENV === 'production'
    ? './bundle.json'
    : path.join(__dirname, '../../../../../../../dist/apps/proto/bundle.json');

const protoLoadAsync = (protoDirectoryPath: string) => {
  return new Promise((resolve, reject) => {
    protobuf.load(protoDirectoryPath, function (err, root) {
      if (err) reject(err);
      resolve(root);
    });
  });
};

export const createRequestHandler = <
  URLParams extends ZodType,
  QueryParams extends ZodType,
  Body extends ZodType,
  Response extends ZodType,
>(
  def: ServerFnDefinition<URLParams, QueryParams, Body, Response>,
): ServerFnDefinition<URLParams, QueryParams, Body, Response> => {
  const _def = {
    method: 'get',
    ...def,
    ...{ endpoint: `${def.endpoint || ''}` },
  };

  if (process.env.API_EXPORTER) {
    (_def as any).apiConfig = setOpenAPIMetadata(_def);
  }

  _def.setHandler = (apiHandler) => {
    const requestHandler = async (
      request: NextBaseRequest<z.infer<URLParams>, z.infer<QueryParams>>,
    ): Promise<NextResponse<Response>> => {
      let queryParams: QueryParams | undefined = undefined;
      let parsedPayload: Body | undefined = undefined;
      let ProtoClassIn: any = undefined;
      let ProtoClassOut: any = undefined;
      let protoRoot;
      let lookupIn;
      let lookupOut;

      if (
        (request.headers.get('content-type') === 'application/x-protobuf' ||
          request.headers.get('accept') === 'application/x-protobuf') &&
        (def.protoIn || def.protoOut)
      ) {
        try {
          protoRoot = await protoLoadAsync(protoDirectoryPath);
          lookupIn = def.protoIn || '';
          lookupOut = def.protoOut || '';
        } catch (e) {
          console.log('Error => ', (e as any).message, __dirname);
        }
      }

      if (
        protoRoot &&
        request.headers.get('accept') === 'application/x-protobuf' &&
        lookupIn !== ''
      ) {
        ProtoClassIn = (protoRoot as any).lookupType(lookupIn || '');
      }

      try {
        if (_def.schemas?.queryParams) {
          queryParams = validateQueryParams(request, _def) as QueryParams;
        }
        if (_def.schemas?.payload) {
          parsedPayload = (await validatePayload(
            request,
            _def,
            ProtoClassIn,
          )) as Body;
        }
      } catch (e) {
        return new NextResponse(
          JSON.stringify({ error: (e as Error).message }),
          {
            status: 500,
            headers: { 'content-type': 'application/json' },
          },
        );
      }

      const handlerReturn = await apiHandler(
        request,
        queryParams,
        parsedPayload,
      );

      if (_def.schemas?.response) {
        try {
          _def.schemas?.response?.parse(handlerReturn);
        } catch (e) {
          return new NextResponse(
            JSON.stringify({ error: (e as Error).message }),
            {
              status: 500,
              headers: { 'content-type': 'application/json' },
            },
          );
        }
      }

      let responseObject =
        typeof handlerReturn === 'object'
          ? handlerReturn
          : { value: handlerReturn };

      if (
        protoRoot &&
        request.headers.get('content-type') === 'application/x-protobuf' &&
        lookupOut !== ''
      ) {
        ProtoClassOut = (protoRoot as any).lookupType(lookupOut || '');
        responseObject = (ProtoClassOut as any).fromObject(responseObject);
        responseObject = (ProtoClassOut as any).encode(responseObject).finish();
      }

      return new NextResponse(
        ProtoClassOut
          ? (responseObject as any)
          : JSON.stringify(responseObject),
        {
          status: 200,
          headers: ProtoClassOut
            ? {
                'content-type': 'application/x-protobuf',
              }
            : { 'content-type': 'application/json' },
        },
      );
    };
    return requestHandler;
  };

  return _def;
};
