import { apiConsumer } from '@next-base/lib-data/common';
import { getGeoList } from '../api';

export const getGeoListConsumer = apiConsumer(getGeoList.definition);
