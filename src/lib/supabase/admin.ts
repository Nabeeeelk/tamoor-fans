import { createClient } from '@supabase/supabase-js';

// This client should ONLY be used in server-side contexts (API routes, Server Actions)
// and NEVER exposed to the client.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
