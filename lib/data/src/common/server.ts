import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { NextRequest, NextResponse } from 'next/server';
import { ZodType, z } from 'zod';

type NextBaseRequest<P, Q> = NextRequest & {
  nextUrl: { searchParams: { get: (key: keyof Q) => any } };
};

export const createRequestHandler = <
  URLParams extends ZodType,
  QueryParams extends ZodType,
  Body extends ZodType,
  Response extends ZodType,
>(def: {
  handler: (
    request: NextBaseRequest<z.infer<URLParams>, z.infer<QueryParams>>,
  ) => Promise<z.infer<Response>>;
  schemas?: {
    urlArgs?: URLParams;
    queryParams?: QueryParams;
    payload?: Body;
    response?: Response;
  };
  endpoint?: string;
  method?: string;
}) => {
  const _def = {
    endpoint: '/',
    method: 'get',
    ...def,
  };

  const requestHandler = async (
    request: NextBaseRequest<z.infer<URLParams>, z.infer<QueryParams>>,
  ): Promise<NextResponse<z.infer<Response>>> => {
    const handlerReturn = await _def.handler(request);
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
