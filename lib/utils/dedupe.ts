import type { NormalizedListing } from "@/types/listing";

/**
 * Removes duplicate listings within a single fetch batch, keyed by
 * source + sourceId. This runs BEFORE we hit Supabase — the database's
 * unique index (source, source_id) is the second, permanent line of
 * defense against duplicates across separate fetch runs.
 *
 * Needed because our category tag queries can overlap: a venue tagged
 * both leisure=sports_centre and leisure=fitness_centre would otherwise
 * come back twice in the same Overpass response set.
 */
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
