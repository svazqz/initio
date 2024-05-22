import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { ZodType } from 'zod';
import { DTO } from '../utils';

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

export const apiGetMutator = <T>(
  endpoint: string,
): (() => UseMutationResult<unknown, Error, T>) => {
  return () => {
    const mutation = useMutation({
      mutationFn: async (data: T) => {
        const queryString = new URLSearchParams(
          data as Record<string, string>,
        ).toString();

        return fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}${endpoint}?${queryString}`,
          {
            method: 'GET',
          },
        );
      },
    });
    return mutation;
  };
};

export type APIConsumerPayload<T, Q> = {
  args?: T;
  query?: Q;
};

const getEndpointWithQuery = (endpoint: string, consumerPayload: any) =>
  `${endpoint}${
    consumerPayload.query
      ? `?${new URLSearchParams(consumerPayload.query || {})}`
      : ''
  }`;

type ConsumerFn<
  URLParams extends ZodType,
  QueryParams extends ZodType,
  Body extends ZodType,
  Response extends ZodType,
> = ((
  consumerPayload: APIConsumerPayload<DTO<URLParams>, DTO<QueryParams>>,
) => {
  queryKey: string[];
  query: UseQueryResult<DTO<Response>>;
}) & {
  types?: {
    urlArgs?: URLParams;
    queryParams?: QueryParams;
    payload?: Body;
    response?: Response;
  };
};

export const _useApiConsumer =
  <
    URLParams extends ZodType,
    QueryParams extends ZodType,
    Body extends ZodType,
    Response extends ZodType,
  >(
    endpoint: string,
    method: string,
  ): ConsumerFn<URLParams, QueryParams, Body, Response> =>
  (consumerPayload: APIConsumerPayload<DTO<URLParams>, DTO<QueryParams>>) => {
    // validate input data with provided schemas
    const endpointKey = getEndpointWithQuery(endpoint, consumerPayload);
    const queryKey = [
      endpointKey,
      ...Object.values(consumerPayload.args || {}),
    ] as string[];

    const query = useQuery({
      queryKey: queryKey,
      queryFn: async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}${endpointKey}`,
        );
        return response.json() as unknown as Response;
      },
    });

    return { queryKey, query };
  };

export const useApiConsumer = <
  URLParams extends ZodType,
  QueryParams extends ZodType,
  Body extends ZodType,
  Response extends ZodType,
>(
  endpoint: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  s: {
    urlArgs?: URLParams;
    queryParams?: QueryParams;
    payload?: Body;
    response?: Response;
  },
  method = 'get',
) => {
  const r = _useApiConsumer<URLParams, QueryParams, Body, Response>(
    endpoint,
    method,
  );

  r.types = s;

  if (process.env.API_EXPORTER) {
    const apiConfig = {
      method: method,
      path: endpoint,
      summary: '',
      request: {
        query: (s.queryParams as any)?.openapi('Query Params'),
      },
      responses: {
        200: {
          description: '',
          content: {
            'application/json': {
              schema: (s.response as any)?.openapi('Response'),
            },
          },
        },
      },
    } as RouteConfig;
    (r as any).apiConfig = apiConfig;
  }

  return r;
};
