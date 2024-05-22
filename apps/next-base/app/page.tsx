'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const Index = function Index() {
  return (
    <QueryClientProvider client={queryClient}>
      <></>
    </QueryClientProvider>
  );
};

export default Index;
