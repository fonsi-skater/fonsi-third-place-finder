import { NextRequest, NextResponse } from "next/server";
import { geocodePlace } from "@/lib/api-clients/openstreetmap";

/**
 * Thin server-side proxy for Nominatim geocoding. Exists because
 * browsers refuse to let client JS set a custom User-Agent header,
 * which Nominatim's usage policy requires — so this must run here,
 * not be called directly from the browser.
 *
 * GET /api/geocode?q=Ruiru
 */
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ error: "Missing query parameter 'q'" }, { status: 400 });
  }

  try {
    const place = await geocodePlace(query.trim());

    if (!place) {
      return NextResponse.json({ error: "No results found for that place" }, { status: 404 });
    }

    return NextResponse.json(place);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Geocoding failed" },
      { status: 500 }
    );
  }
}
