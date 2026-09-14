import type { ListingCategory, NormalizedListing } from "@/types/listing";

/**
 * OpenStreetMap client — our one free, automated data source.
 *
 * Two public services, both free and keyless:
 * - Nominatim: turns a place name ("Ruiru, Kenya") into coordinates.
 * - Overpass API: queries OSM's raw map data for tagged places
 *   (sports clubs, community centres, places of worship, etc.)
 *   within a radius of a point.
 *
 * Usage policy for both is strict about being a good citizen:
 * - Always send a descriptive User-Agent (required by Nominatim's policy).
 * - Max ~1 request/second — we are not a high-volume consumer, so this
 *   is easy to respect since the cron job runs at most a few times a day.
 * - Cache/store results rather than re-querying repeatedly for the same area.
 */

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const OVERPASS_BASE = "https://overpass-api.de/api/interpreter";

// Required by Nominatim's usage policy — identifies our app, not a browser.
const USER_AGENT = "FonsiThirdPlaceFinder/0.1 (contact: fonsialphonce@gmail.com)";

export interface GeocodedPlace {
  latitude: number;
  longitude: number;
  displayName: string;
}

/** Turn a place name like "Ruiru, Kenya" into coordinates. */
export async function geocodePlace(query: string): Promise<GeocodedPlace | null> {
  const url = new URL(`${NOMINATIM_BASE}/search`);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!res.ok) {
    throw new Error(`Nominatim geocoding failed: ${res.status} ${res.statusText}`);
  }

  const results = (await res.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
  }>;

  if (results.length === 0) return null;

  return {
    latitude: parseFloat(results[0].lat),
    longitude: parseFloat(results[0].lon),
    displayName: results[0].display_name,
  };
}

// Maps our own categories to the OSM tags that best represent them.
// OSM uses a key=value tagging system (e.g. leisure=sports_centre).
const CATEGORY_TAG_MAP: Record<ListingCategory, string[]> = {
  sports: ["leisure=sports_centre", "leisure=fitness_centre", "leisure=pitch"],
  hobbies: ["leisure=community_centre", "shop=games", "leisure=adult_gaming_centre"],
  faith: ["amenity=place_of_worship"],
  tech: ["office=coworking", "amenity=coworking_space"],
  arts: ["amenity=arts_centre", "amenity=theatre"],
  other: ["amenity=community_centre"],
};

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

/**
 * Query OSM for tagged venues within `radiusMeters` of a point, for one
 * of our categories. Returns already-normalized listings ready to
 * de-dupe and insert into Supabase.
 */
export async function fetchNearbyVenues(
  latitude: number,
  longitude: number,
  category: ListingCategory,
  radiusMeters = 5000
): Promise<NormalizedListing[]> {
  const tags = CATEGORY_TAG_MAP[category];

  // Overpass QL: for each tag, find nodes/ways/relations with that tag
  // within radiusMeters of (latitude, longitude).
  const tagClauses = tags
    .map((tag) => {
      const [key, value] = tag.split("=");
      return `
        node["${key}"="${value}"](around:${radiusMeters},${latitude},${longitude});
        way["${key}"="${value}"](around:${radiusMeters},${latitude},${longitude});
      `;
    })
    .join("\n");

  const query = `
    [out:json][timeout:25];
    (
      ${tagClauses}
    );
    out center tags;
  `;

  const res = await fetch(OVERPASS_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": USER_AGENT,
    },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!res.ok) {
    throw new Error(`Overpass query failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as { elements: OverpassElement[] };

  return data.elements
    .filter((el) => el.tags?.name) // skip unnamed/low-quality entries
    .map((el) => normalizeElement(el, category));
}

function normalizeElement(
  el: OverpassElement,
  category: ListingCategory
): NormalizedListing {
  const lat = el.lat ?? el.center?.lat ?? 0;
  const lon = el.lon ?? el.center?.lon ?? 0;
  const tags = el.tags ?? {};

  const addressParts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"],
    tags["addr:city"],
  ].filter(Boolean);

  return {
    title: tags.name ?? "Unnamed venue",
    description: tags.description ?? null,
    category,
    address: addressParts.length > 0 ? addressParts.join(", ") : null,
    latitude: lat,
    longitude: lon,
    recurrence: null, // OSM has no schedule data — venues, not recurring groups
    startsAt: null,
    endsAt: null,
    contactUrl: tags.website ?? tags["contact:website"] ?? null,
    organizerName: tags.operator ?? null,
    source: "openstreetmap",
    sourceId: `${el.type}/${el.id}`,
  };
}
