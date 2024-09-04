'use client';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import GeoData from 'apps/next-base/app/components/geo-data';
//
// const queryClient = new QueryClient();
//
// const Index = function Index() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <GeoData />
//     </QueryClientProvider>
//   );
// };
//
// export default Index;
//

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Faq from './components/Faq';
import Cta from './components/Cta';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

/*
<Hero />
      <Features />
      <Faq />
      <Pricing />
      <Cta />
      <Footer />
*/

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Faq />
    </>
  );
}
