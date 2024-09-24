'use client';

import dynamic from 'next/dynamic';

const DynamicSwaggerUI = dynamic(() => import('./Swagger'), {
  ssr: false,
  loading: () => <p>Loading Component...</p>,
});

const AdminDocPage = () => {
  return <DynamicSwaggerUI />;
};

export default AdminDocPage;
