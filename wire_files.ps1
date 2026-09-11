# Ensure folders exist
New-Item -ItemType Directory -Force -Path "types", "lib\supabase", "lib\utils", "lib\api-clients", "config", "app\api\cron\fetch-events" | Out-Null

function Write-Utf8NoBom($Path, $Content) {
    [System.IO.File]::WriteAllText($Path, $Content, (New-Object System.Text.UTF8Encoding($false)))
}

# 1. types/listing.ts
Write-Utf8NoBom "types\listing.ts" @'
export type ListingCategory =
  | "sports"
  | "hobbies"
  | "faith"
  | "tech"
  | "arts"
  | "other";

export type ListingSource =
  | "openstreetmap"
  | "manual"
  | "user_submitted";

export interface NormalizedListing {
  title: string;
  description: string | null;
  category: ListingCategory;
  address: string | null;
  latitude: number;
  longitude: number;
  recurrence: string | null;
  startsAt: string | null;
  endsAt: string | null;
  contactUrl: string | null;
  organizerName: string | null;
  source: ListingSource;
  sourceId: string;
}
'@

# 2. lib/supabase/client.ts
Write-Utf8NoBom "lib\supabase\client.ts" @'
import { createClient } from "@supabase/supabase-js";

export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anonKey);
}
'@

# 3. lib/supabase/server.ts
Write-Utf8NoBom "lib\supabase\server.ts" @'
import { createClient } from "@supabase/supabase-js";

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =