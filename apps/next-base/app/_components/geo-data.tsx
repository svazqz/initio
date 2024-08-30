'use client';
import { useCallback, useEffect, useState } from 'react';
import { apiConsumer } from '../../../../lib/data/src/common/client';
import { Button, Input } from '@next-base/lib-ui';
import { postGeoData } from 'apps/next-base/data/geo';

const getGeoDataConsumer = apiConsumer(postGeoData);

const GeoData = function Index() {
  const [latitude, setLatitude] = useState(19.3906594);
  const [longitude, setLongitude] = useState(-99.308425);
  const { query, queryKey } = getGeoDataConsumer({
    body: {
      latitude,
      longitude,
    },
  });

  const onClick = useCallback(() => {
    setLatitude(21.92081);
    setLongitude(-102.33495);
  }, []);

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
