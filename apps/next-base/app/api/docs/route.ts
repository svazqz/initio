import docs from '../../../../../dist/apps/openapi/docs.json';

export const GET = () => {
  return new Response(JSON.stringify(docs));
};
