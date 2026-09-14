import { NextRequest, NextResponse } from "next/server";
import { createBrowserClient } from "@/lib/supabase/client";
import { boundingBox, distanceMeters } from "@/lib/utils/geo";

/**
 * Searches active listings near a point.
 *
 * GET /api/listings/search?lat=-1.1487&lng=36.9614&radius=8000
 *
 * Strategy: ask Supabase for a rough bounding-box match first (cheap,
 * uses the lat/lng index), then compute precise Haversine distance in
 * JS to filter out the box's corners and sort by actual closeness.
 * This avoids needing the PostGIS extension for a project this size.
 */
export async function GET(req: NextRequest) {
  const lat = parseFloat(req.nextUrl.searchParams.get("lat") ?? "");
  const lng = parseFloat(req.nextUrl.searchParams.get("lng") ?? "");
  const radius = parseFloat(req.nextUrl.searchParams.get("radius") ?? "8000");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "Missing or invalid lat/lng" }, { status: 400 });
  }

  const box = boundingBox(lat, lng, radius);
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from("listings")
    .select("id, title, category, address, recurrence, contact_url, latitude, longitude")
    .eq("is_active", true)
    .gte("latitude", box.minLat)
    .lte("latitude", box.maxLat)
    .gte("longitude", box.minLon)
    .lte("longitude", box.maxLon)
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const withinRadius = (data ?? [])
    .map((listing) => ({
      ...listing,
      distanceMeters: distanceMeters(lat, lng, listing.latitude, listing.longitude),
    }))
    .filter((l) => l.distanceMeters <= radius)
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  return NextResponse.json({ listings: withinRadius });
}
