import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client, using the SERVICE ROLE key.
 * This bypasses Row Level Security, so it must NEVER be imported
 * into any client component or exposed to the browser — it's only
 * safe inside API routes and the cron job, which run on the server.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase env vars. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
