'use client';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button, Calendar } from '@next-base/lib-ui';

const queryClient = new QueryClient();

const Index = function Index() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <QueryClientProvider client={queryClient}>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
      <Button variant={'outline'}>Hello World!</Button>
    </QueryClientProvider>
  );
};

export default Index;
