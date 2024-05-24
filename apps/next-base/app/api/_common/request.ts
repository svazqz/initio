import { NextRequest, NextResponse } from 'next/server';
import { ZodType, z } from 'zod';

type NextBaseRequest<P, Q> = NextRequest & {
  nextUrl: { searchParams: { get: (key: keyof Q) => any } };
};

export const createRequestHandler =
  <
    URLParams extends ZodType,
    QueryParams extends ZodType,
    Body,
    Response extends ZodType,
  >(
    handler: (
      request: NextBaseRequest<z.infer<URLParams>, z.infer<QueryParams>>,
    ) => Promise<z.infer<Response>>,
    s?: {
      urlArgs?: URLParams;
      queryParams?: QueryParams;
      payload?: Body;
      response?: Response;
    },
  ) =>
  async (
    request: NextBaseRequest<z.infer<URLParams>, z.infer<QueryParams>>,
  ): Promise<NextResponse<z.infer<Response>>> => {
    const handlerReturn = await handler(request);
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
