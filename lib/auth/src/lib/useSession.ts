'use client';
/* eslint-disable @nx/enforce-module-boundaries */
import { useEffect, useState } from 'react';
import { useBackendClient } from '@next-base/lib/backend-client';
import { Session } from '@supabase/supabase-js';

type AuthSession = Session;

export const useSession = () => {
  const backendClient = useBackendClient();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    if (backendClient) {
      backendClient?.auth.getSession().then(({ data: { session } }) => {
        setLoading(false);
        setSession(session);
      });
      const { data: authListener } = backendClient.auth.onAuthStateChange(
        (event, session) => {
          setLoading(false);
          setSession(session);
        },
      );
      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [backendClient]);

  return { session, loading };
};
