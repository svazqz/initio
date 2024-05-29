import { getGeoListConsumer } from '@next-base/lib-data/consumers';
import { createRequestHandler } from '../_common/request';

export const GET = createRequestHandler(async (request) => {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('latitude');
  const long = searchParams.get('longitude');
  const locationResponse = await fetch(
    `https://geocode.xyz/${lat},${long}?json=1`,
  );
  const locationData = await locationResponse.json();
  return locationData.standard || locationData;
}, getGeoListConsumer.types);
