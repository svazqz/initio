'use client';

import { useSession } from './useSession';

export const useIsSignedIn = () => {
  const session = useSession();
  return !!session;
};
