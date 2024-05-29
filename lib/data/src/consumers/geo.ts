import { apiConsumer } from '../common/client';
import { getGeoList } from '../api';

export const getGeoListConsumer = apiConsumer(getGeoList.definition);
