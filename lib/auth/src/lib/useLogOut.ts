'use client';

import { useCallback, useState } from 'react';
import { AuthError } from '@supabase/supabase-js';
import { useBackendClient } from '@next-base/lib/backend-client';

export const useLogOut = () => {
  const [error, setError] = useState<AuthError | null>(null);
  const supabase = useBackendClient();

  const logOut = useCallback(() => {
    supabase?.auth.signOut().then(({ error }) => {
      console.log(error);
      setError(error);
    });
  }, [supabase]);

  return { logOut, error };
};
