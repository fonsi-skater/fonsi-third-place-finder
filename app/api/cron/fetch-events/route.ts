import { NextRequest, NextResponse } from "next/server";
import { fetchNearbyVenues } from "@/lib/api-clients/openstreetmap";
import { dedupeListings } from "@/lib/utils/dedupe";
import { createServiceClient } from "@/lib/supabase/server";
import { CATEGORIES, DEFAULT_ORIGIN } from "@/config/categories";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { latitude, longitude, radiusMeters } = DEFAULT_ORIGIN;
  const supabase = createServiceClient();

  let totalFetched = 0;
  let totalUpserted = 0;
  const errors: string[] = [];

  for (const { value: category } of CATEGORIES) {
    try {
      const venues = await fetchNearbyVenues(latitude, longitude, category, radiusMeters);
      totalFetched += venues.length;

      const deduped = dedupeListings(venues);

      if (deduped.length === 0) continue;

      const { error, count } = await supabase
        .from("listings")
        .upsert(
          deduped.map((v) => ({
            title: v.title,
            description: v.description,
            category: v.category,
            address: v.address,
            latitude: v.latitude,
            longitude: v.longitude,
            recurrence: v.recurrence,
            starts_at: v.startsAt,
            ends_at: v.endsAt,
            contact_url: v.contactUrl,
            organizer_name: v.organizerName,
            source: v.source,
            source_id: v.sourceId,
            last_confirmed_at: new Date().toISOString(),
          })),
          { onConflict: "source,source_id", count: "exact" }
        );

      if (error) {
        errors.push(`${category}: ${error.message}`);
      } else {
        totalUpserted += count ?? deduped.length;
      }

      await sleep(1200);
    } catch (err) {
      errors.push(`${category}: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  }

  return NextResponse.json({
    fetched: totalFetched,
    upserted: totalUpserted,
    errors: errors.length > 0 ? errors : undefined,
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}