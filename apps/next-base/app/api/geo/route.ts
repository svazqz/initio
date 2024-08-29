import { getGeoData, postGeoData } from '../../../data/api/geo';

export const GET =
  getGeoData.setHandler &&
  getGeoData.setHandler(async (request) => {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('latitude');
    const long = searchParams.get('longitude');
    const locationResponse = await fetch(
      `https://geocode.xyz/${lat},${long}?json=1`,
    );
    const locationData = await locationResponse.json();
    return locationData.standard || locationData;
  });

export const POST =
  postGeoData.setHandler &&
  postGeoData.setHandler(async (_request, _queryParams, payload) => {
    const lat = payload?.latitude;
    const long = payload?.longitude;
    const locationResponse = await fetch(
      `https://geocode.xyz/${lat},${long}?json=1`,
    );
    const locationData = await locationResponse.json();
    const fullData = locationData.standard || locationData;
    return {
      city: fullData.city,
      state: fullData.state,
      country: fullData.country,
    };
  });
