'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from '@next-base/lib-ui';
// import { useState } from 'react';

/*
<Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
      <Button variant={'outline'}>Hello</Button>
*/

const queryClient = new QueryClient();

const Index = function Index() {
  // const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <QueryClientProvider client={queryClient}>
      <Button variant={'outline'}>Hello World!</Button>
    </QueryClientProvider>
  );
};

export default Index;
