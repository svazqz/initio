import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import {
  // Import predefined theme
  ThemeSupa,
} from '@supabase/auth-ui-shared';
import { useBackendClient } from '@next-base/lib/backend-client';

export const Auth = () => {
  const supabase = useBackendClient();

  if (!supabase) {
    return 'Backend unavailable';
  }

  return (
    <SupabaseAuth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
  );
};
