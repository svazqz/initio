'use client';
/* eslint-disable @nx/enforce-module-boundaries */
import { useEffect, useState } from 'react';
import { useBackendClient } from './useBackendClient';
import { AuthSession } from '@next-base/lib-data/schemas';

export const useSession = () => {
  const backendClient = useBackendClient();
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    if (backendClient) {
      backendClient?.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });
      const { data: authListener } = backendClient.auth.onAuthStateChange(
        (event, session) => {
          setSession(session);
        },
      );
      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [backendClient]);

  return session;
};
