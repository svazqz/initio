import * as protobuf from 'protobufjs';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { NextRequest, NextResponse } from 'next/server';
import { ZodBoolean, ZodNumber, ZodObject, ZodType, z } from 'zod';
import { DTO } from './utils';

type NextBaseRequest<P, Q> = NextRequest & {
  nextUrl: { searchParams: { get: (key: keyof Q) => any } };
};

type ServerFnDefinition<
  URLParams extends ZodType,
  QueryParams extends ZodType,
  Body extends ZodType,
  Response extends ZodType,
> = {
  handler: (
    request: NextBaseRequest<z.infer<URLParams>, z.infer<QueryParams>>,
    queryParams?: QueryParams,
    payload?: DTO<Body>,
  ) => Promise<z.infer<Response>>;
  schemas?: {
    urlArgs?: URLParams;
    queryParams?: QueryParams;
    payload?: Body;
    response?: Response;
  };
  endpoint?: string;
  method?: string;
  proto?: string;
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
) {
  let parsedPayload: Body | undefined = undefined;

  if (request.headers.get('content-type') === 'x-protobuf' && def.proto) {
    const [namespace] = def.proto.split('.');
    const root = await protobuf.load(
      `/Users/sergiovazquez/Projects/next-base/lib/data/src/proto/${namespace}.proto`,
    );
    const Message: any = root.lookupType(`${def.proto}`);
    const lResponse = await request.arrayBuffer();
    parsedPayload = Message.decode(Buffer.from(lResponse));
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
) => {
  const _def = {
    method: 'get',
    ...def,
    ...{ endpoint: `/api/${def.endpoint || ''}` },
  };

  const requestHandler = async (
    request: NextBaseRequest<z.infer<URLParams>, z.infer<QueryParams>>,
  ): Promise<NextResponse<z.infer<Response>>> => {
    let queryParams: QueryParams | undefined = undefined;
    let parsedPayload: Body | undefined = undefined;
    try {
      if (_def.schemas?.queryParams) {
        queryParams = validateQueryParams(request, _def) as QueryParams;
      }
      if (_def.schemas?.payload) {
        parsedPayload = (await validatePayload(request, _def)) as Body;
      }
    } catch (e) {
      console.log('Here 3', e);
      return new NextResponse(JSON.stringify(e), {
        status: 200, // Implement better error handlig... so responses are not always 200
        headers: { 'content-type': 'application/json' },
      });
    }

    const handlerReturn = await _def.handler(
      request,
      queryParams,
      parsedPayload,
    );
    return new NextResponse(
      JSON.stringify(
        typeof handlerReturn === 'object'
          ? handlerReturn
          : { value: handlerReturn },
      ),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      },
    );
  };

  requestHandler.definition = _def;

  if (process.env.API_EXPORTER) {
    const apiConfig = {
      method: _def.method,
      path: _def.endpoint,
      summary: '',
      request: {
        query: (_def.schemas?.queryParams as any)?.openapi('Query Params'),
      },
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
    (requestHandler as any).apiConfig = apiConfig;
  }

  return requestHandler;
};
