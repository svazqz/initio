import { render } from '@testing-library/react';

import LibUi from './lib-ui';

describe('LibUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LibUi />);
    expect(baseElement).toBeTruthy();
  });
});
