'use client';
import { useCallback, useEffect, useState } from 'react';
import { Button, Input } from '@next-base/lib-ui';
import { getGeoDataConsumer } from 'apps/next-base/data/consumers';

const GeoData = function Index() {
  const [latitude, setLatitude] = useState(19.3906594);
  const [longitude, setLongitude] = useState(-99.308425);
  const { query, queryKey } = getGeoDataConsumer({
    body: {
      latitude,
      longitude,
    },
  });

  // useEffect(() => {
  //   query.refetch();
  // }, [queryKey]);

  const onClick = useCallback(() => {
    setLatitude(21.92081);
    setLongitude(-102.33495);
  }, []);

  if (query.isLoading) {
    return <span>Loading...</span>;
  }

  if (query.isError) {
    return <span>Error...</span>;
  }

  return (
    <>
      <Input placeholder="latitude" value={latitude} />
      <Input placeholder="longitude" value={longitude} />
      <Button variant={'outline'} onClick={() => onClick()}>
        Hello World!
      </Button>
      <br />
      <textarea style={{ width: '100%', height: '40px' }}>
        {JSON.stringify(query.data)}
      </textarea>
      <br />
      <textarea style={{ width: '100%', height: '40px' }}>
        {JSON.stringify(queryKey)}
      </textarea>
      <br />
    </>
  );
};

export default GeoData;
