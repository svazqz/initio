import { libBackendClient } from './lib-backend-client';

describe('libBackendClient', () => {
  it('should work', () => {
    expect(libBackendClient()).toEqual('lib-backend-client');
  });
});
