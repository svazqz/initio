import { apiConsumer } from '../../../../lib/data/src/common/client';
import { postGeoData } from '../api';

export const getGeoDataConsumer = apiConsumer(postGeoData.definition);
