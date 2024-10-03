'use client';

import { useSession } from './useSession';

export const useIsSignedIn = () => {
  const { session, loading } = useSession();
  return { isSignedIn: !!session, loading };
};
