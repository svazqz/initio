import { SupabaseClient, createClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    );
  }
  return supabaseClient;
};

export const useBackendClient = (): SupabaseClient | null => {
  if (typeof window !== 'undefined') {
    // Running in the browser
    if (!(window as any).supabaseClient) {
      (window as any).supabaseClient = getSupabaseClient();
    }
    return (window as any).supabaseClient;
  } else {
    // Running on the server
    return getSupabaseClient();
  }
};
