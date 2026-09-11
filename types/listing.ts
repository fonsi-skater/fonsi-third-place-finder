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