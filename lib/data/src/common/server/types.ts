import { z, ZodType } from 'zod';
import { DTO } from '../utils';
import { NextRequest, NextResponse } from 'next/server';

export type NextBaseRequest<P, Q> = NextRequest & {
  nextUrl: { searchParams: { get: (key: keyof Q) => any } };
};

export type NextRequestHandler<
  URLParams extends ZodType,
  QueryParams extends ZodType,
  Response extends ZodType,
> = (
  request: NextBaseRequest<z.infer<URLParams>, z.infer<QueryParams>>,
) => Promise<z.infer<Response>>;

export type HandlerFn<
  URLParams extends ZodType,
  QueryParams extends ZodType,
  Body extends ZodType,
  Response extends ZodType,
> = (
  request: NextBaseRequest<z.infer<URLParams>, z.infer<QueryParams>>,
  queryParams?: QueryParams,
  payload?: DTO<Body>,
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
  ) => (
    request: NextBaseRequest<URLParams, QueryParams>,
  ) => NextResponse<Response> | Promise<NextResponse<Response>>;
};
