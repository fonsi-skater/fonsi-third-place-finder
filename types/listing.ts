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

// Shape used internally once we've normalized data from any source,
// before it's inserted into Supabase.
export interface NormalizedListing {
  title: string;
  description: string | null;
  category: ListingCategory;
  address: string | null;
  latitude: number;
  longitude: number;
  recurrence: string | null;
  startsAt: string | null; // ISO timestamp, null for OSM venues (no schedule data)
  endsAt: string | null;
  contactUrl: string | null;
  organizerName: string | null;
  source: ListingSource;
  sourceId: string; // OSM element type+id (e.g. "node/123456"), used for de-dupe
}
