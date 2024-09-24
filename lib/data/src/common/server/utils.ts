import { ZodType, z, ZodNumber, ZodBoolean } from 'zod';
import { NextBaseRequest, ServerFnDefinition } from './types';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';

export function validateQueryParams<
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
      (queryParams as unknown as any)[param as unknown as string] = Number(
        request.nextUrl.searchParams.get(param),
      );
    } else if (
      (def.schemas?.queryParams as any).shape[param] instanceof ZodBoolean
    ) {
      (queryParams as unknown as any)[param as unknown as string] = Boolean(
        request.nextUrl.searchParams.get(param),
      );
    } else {
      (queryParams as unknown as any)[param as unknown as string] =
        request.nextUrl.searchParams.get(param);
    }
  }
  def.schemas?.queryParams?.parse(queryParams);
  return queryParams;
}

export async function validatePayload<
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

export const setOpenAPIMetadata = (_def: any) => {
  const apiConfig = {
    method: _def.method,
    path: '/api' + _def.endpoint,
    summary: '',
    request: {},
    responses: {
      200: {
        description: '',
        content: {
          'application/json': {
            schema: _def.schemas?.response,
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
    (apiConfig.request as any).params = (_def.schemas?.urlArgs as any)?.openapi(
      'URL Params',
    );
  }

  return apiConfig;
};
