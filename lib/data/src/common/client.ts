import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { ZodType } from 'zod';
import { DTO } from './utils';
import { ServerFnDefinition } from './server/types';

type APIConsumerPayload<URLParams, QueryParams, Body> = {
  urlParams?: URLParams;
  query?: QueryParams;
  body?: Body;
  headers?: Record<string, string>;
};

type ConsumerFn<
  URLParams extends ZodType,
  QueryParams extends ZodType,
  Body extends ZodType,
  Response extends ZodType,
> = ((
  consumerPayload: APIConsumerPayload<
    DTO<URLParams>,
    DTO<QueryParams>,
    DTO<Body>
  >,
) => {
  queryKey: string[];
  query: UseQueryResult<DTO<Response>>;
}) & {
  types?: {
    urlParams?: URLParams;
    queryParams?: QueryParams;
    payload?: Body;
    response?: Response;
  };
};

const getEndpointWithQuery = (endpoint: string, consumerPayload: any) =>
  `${endpoint}${
    consumerPayload.query
      ? `?${new URLSearchParams(consumerPayload.query || {})}`
      : ''
  }`;

export const _apiConsumer =
  <
    URLParams extends ZodType,
    QueryParams extends ZodType,
    Body extends ZodType,
    Response extends ZodType,
  >(
    endpoint: string,
    method: string,
  ): ConsumerFn<URLParams, QueryParams, Body, Response> =>
  (
    consumerPayload: APIConsumerPayload<
      DTO<URLParams>,
      DTO<QueryParams>,
      DTO<Body>
    >,
  ) => {
    // validate input data with provided schemas
    const endpointKey = getEndpointWithQuery(endpoint, consumerPayload);
    const queryKey = [
      endpointKey,
      ...Object.values(consumerPayload.urlParams || {}),
      ...Object.values(consumerPayload.body || {}),
    ] as string[];

    const query = useQuery({
      queryKey,
      queryFn: async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}${endpointKey}`,
          {
            method,
            body: JSON.stringify(consumerPayload.body),
            headers: consumerPayload.headers,
          },
        );
        const jsonResponse = (await response.json()) as unknown as Response;
        return jsonResponse;
      },
    });

    return { queryKey, query };
  };

export const apiConsumer = <
  URLParams extends ZodType,
  QueryParams extends ZodType,
  Body extends ZodType,
  Response extends ZodType,
>(
  apiDefinition: ServerFnDefinition<URLParams, QueryParams, Body, Response>,
) => {
  const r = _apiConsumer<URLParams, QueryParams, Body, Response>(
    apiDefinition?.endpoint || '/',
    apiDefinition.method || 'get',
  );

  return r;
};

export const apiMutator = <T>(
  endpoint: string,
): (() => UseMutationResult<unknown, Error, T>) => {
  return () => {
    const mutation = useMutation({
      mutationFn: async (data: T) => {
        return fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}${endpoint}`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },
    });
    return mutation;
  };
};
