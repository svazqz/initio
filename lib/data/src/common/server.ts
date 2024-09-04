import * as protobuf from 'protobufjs';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { NextRequest, NextResponse } from 'next/server';
import { ZodBoolean, ZodNumber, ZodType, z } from 'zod';
import { DTO } from './utils';
import path from 'path';

const protoDirectoryPath = path.join(__dirname, '../../../../../../../apps/');

type NextBaseRequest<P, Q> = NextRequest & {
  nextUrl: { searchParams: { get: (key: keyof Q) => any } };
};

type HandlerFn<
  URLParams extends ZodType,
  QueryParams extends ZodType,
  Body extends ZodType,
  Response extends ZodType,
> = (
  request: NextBaseRequest<z.infer<URLParams>, z.infer<QueryParams>>,
  queryParams?: QueryParams,
  payload?: DTO<Body>,
) => Promise<z.infer<Response>>;

type NextRequestHandler<
  URLParams extends ZodType,
  QueryParams extends ZodType,
  Response extends ZodType,
> = (
  request: NextBaseRequest<z.infer<URLParams>, z.infer<QueryParams>>,
) => Promise<z.infer<Response>>;

export type ServerFnDefinition<
  URLParams extends ZodType,
  QueryParams extends ZodType,
  Body extends ZodType,
  Response extends ZodType,
> = {
  schemas?: {
    urlArgs?: URLParams;
    queryParams?: QueryParams;
    payload?: Body;
    response?: Response;
  };
  endpoint?: string;
  method?: string;
  protoIn?: string;
  protoOut?: string;
  setHandler?: (
    handlerFn: HandlerFn<URLParams, QueryParams, Body, Response>,
  ) => NextRequestHandler<URLParams, QueryParams, Response>;
};

function validateQueryParams<
  URLParams extends ZodType,
  QueryParams extends ZodType,
  Body extends ZodType,
  Response extends ZodType,
>(
  request: NextBaseRequest<z.infer<URLParams>, z.infer<QueryParams>>,
  def: ServerFnDefinition<URLParams, QueryParams, Body, Response>,
) {
  const queryParams = {};
  const params = request.nextUrl.searchParams.keys();
  for (const param of params) {
    if ((def.schemas?.queryParams as any).shape[param] instanceof ZodNumber) {
      queryParams[param] = Number(request.nextUrl.searchParams.get(param));
    } else if (
      (def.schemas?.queryParams as any).shape[param] instanceof ZodBoolean
    ) {
      queryParams[param] = Boolean(request.nextUrl.searchParams.get(param));
    } else {
      queryParams[param] = request.nextUrl.searchParams.get(param);
    }
  }
  def.schemas?.queryParams?.parse(queryParams);
  return queryParams;
}

async function validatePayload<
  URLParams extends ZodType,
  QueryParams extends ZodType,
  Body extends ZodType,
  Response extends ZodType,
>(
  request: NextBaseRequest<z.infer<URLParams>, z.infer<QueryParams>>,
  def: ServerFnDefinition<URLParams, QueryParams, Body, Response>,
  ProtoClass: any,
) {
  let parsedPayload: Body | undefined = undefined;

  if (ProtoClass) {
    try {
      const lResponse = await request.arrayBuffer();
      parsedPayload = ProtoClass.decode(Buffer.from(lResponse));
    } catch (e) {
      throw new Error('Protocol buffer parsing error');
    }
  } else {
    parsedPayload = await request.json();
  }
  def.schemas?.payload?.parse(parsedPayload);
  return parsedPayload;
}

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
    const apiConfig = {
      method: _def.method,
      path: _def.endpoint,
      summary: '',
      request: {},
      responses: {
        200: {
          description: '',
          content: {
            'application/json': {
              schema: (_def.schemas?.response as any)?.openapi('Response'),
            },
          },
        },
      },
    } as RouteConfig;

    if (_def.schemas?.queryParams) {
      (apiConfig.request as any).query = (
        _def.schemas?.queryParams as any
      )?.openapi('Query Params');
    }
    if (_def.schemas?.payload) {
      (apiConfig.request as any).body = {
        description: 'Body',
        content: {
          'application/json': {
            schema: _def.schemas?.payload,
          },
        },
        required: true,
      };
    }
    if (_def.schemas?.urlArgs) {
      (apiConfig.request as any).params = (
        _def.schemas?.urlArgs as any
      )?.openapi('URL Params');
    }

    (_def as any).apiConfig = apiConfig;
  }

  _def.setHandler = (apiHandler) => {
    const requestHandler = async (
      request: NextBaseRequest<z.infer<URLParams>, z.infer<QueryParams>>,
    ): Promise<NextResponse<z.infer<Response>>> => {
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
        const [app, namespace] = (def.protoIn || def.protoOut || '').split('.');

        protoRoot = await protobuf.load(
          `${protoDirectoryPath}${app}/data/${namespace}/schemas.proto`,
        );

        lookupIn = (def.protoIn || '').replace(`${app}.`, '');
        lookupOut = (def.protoOut || '').replace(`${app}.`, '');
      }

      if (
        protoRoot &&
        request.headers.get('accept') === 'application/x-protobuf' &&
        lookupIn !== ''
      ) {
        ProtoClassIn = protoRoot.lookupType(lookupIn);
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
        return new NextResponse(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { 'content-type': 'application/json' },
        });
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
          return new NextResponse(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
          });
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
        ProtoClassOut = protoRoot.lookupType(lookupOut);
        responseObject = ProtoClassOut.fromObject(responseObject);
        responseObject = ProtoClassOut.encode(responseObject).finish();
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
