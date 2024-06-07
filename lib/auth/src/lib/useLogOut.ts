'use client';

import { useCallback, useState } from 'react';
import { useAuth } from './useAuth';
import { AuthError } from '@supabase/supabase-js';

export const useLogOut = () => {
  const [error, setError] = useState<AuthError | null>(null);
  const supabase = useAuth();

  const logOut = useCallback(() => {
    supabase?.auth.signOut().then(({ error }) => {
      setError(error);
    });
  }, [supabase]);

  return { logOut, error };
};
