'use client';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { apiConsumer } from '../../../../lib/data/src/common/client';
import { Button, Input } from '@next-base/lib-ui';
import { postGeoData } from 'apps/next-base/data/geo/api';

const GeoData = function Index() {
  const [latitude, setLatitude] = useState(19.3906594);
  const [longitude, setLongitude] = useState(-99.308425);
  const { query, queryKey } = apiConsumer(postGeoData)({
    body: {
      latitude,
      longitude,
    },
  });

  const onChangeLatitude = (ev: ChangeEvent<HTMLInputElement>) => {
    setLatitude(Number(ev.target.value));
  };

  const onChangeLongitude = (ev: ChangeEvent<HTMLInputElement>) => {
    setLongitude(Number(ev.target.value));
  };

  if (query.isLoading) return <>Loading...</>;

  if (query.error) return <>Error</>;

  return (
    <>
      <Input
        placeholder="latitude"
        onChange={onChangeLatitude}
        value={latitude}
      />
      <Input
        placeholder="longitude"
        onChange={onChangeLongitude}
        value={longitude}
      />
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
