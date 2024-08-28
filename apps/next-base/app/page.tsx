'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GeoData from './_components/geo-data';

const queryClient = new QueryClient();

const Index = function Index() {
  return (
    <QueryClientProvider client={queryClient}>
      <GeoData />
    </QueryClientProvider>
  );
};

export default Index;
