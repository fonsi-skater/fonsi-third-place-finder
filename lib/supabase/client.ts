import { createClient } from "@supabase/supabase-js";

/**
 * Browser-safe Supabase client, using the public ANON key.
 * Row Level Security policies apply here — this can only ever
 * read active listings (see supabase/migrations/001_init.sql).
 */
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(url, anonKey);
}
