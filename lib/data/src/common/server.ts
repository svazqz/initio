import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { NextRequest, NextResponse } from 'next/server';
import { ZodBoolean, ZodNumber, ZodType, z } from 'zod';

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
    try {
      if (_def.schemas?.queryParams) {
        const queryParams = {};
        const params = request.nextUrl.searchParams.keys();
        for (const param of params) {
          if (_def.schemas?.queryParams.shape[param] instanceof ZodNumber) {
            queryParams[param] = Number(
              request.nextUrl.searchParams.get(param),
            );
          } else if (
            _def.schemas?.queryParams.shape[param] instanceof ZodBoolean
          ) {
            queryParams[param] = Boolean(
              request.nextUrl.searchParams.get(param),
            );
          } else {
            queryParams[param] = request.nextUrl.searchParams.get(param);
          }
        }
        _def.schemas?.queryParams.parse(queryParams);
      }

      if (_def.schemas?.payload) {
        const payload = await request.json();
        _def.schemas?.payload.parse(payload);
      }
    } catch (e) {
      return new NextResponse(JSON.stringify(e), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

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
