import type { NormalizedListing } from "@/types/listing";

export function dedupeListings(listings: NormalizedListing[]): NormalizedListing[] {
  const seen = new Set<string>();
  const result: NormalizedListing[] = [];

  for (const listing of listings) {
    const key = `${listing.source}:${listing.sourceId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(listing);
  }

  return result;
}