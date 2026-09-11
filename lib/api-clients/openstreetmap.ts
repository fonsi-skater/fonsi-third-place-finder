import type { ListingCategory, NormalizedListing } from "@/types/listing";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const OVERPASS_BASE = "https://overpass-api.de/api/interpreter";
const USER_AGENT = "FonsiThirdPlaceFinder/0.1 (contact: fonsialphonce@gmail.com)";

export interface GeocodedPlace {
  latitude: number;
  longitude: number;
  displayName: string;
}

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

export async function fetchNearbyVenues(
  latitude: number,
  longitude: number,
  category: ListingCategory,
  radiusMeters = 5000
): Promise<NormalizedListing[]> {
  const tags = CATEGORY_TAG_MAP[category];

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
    .filter((el) => el.tags?.name)
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
    recurrence: null,
    startsAt: null,
    endsAt: null,
    contactUrl: tags.website ?? tags["contact:website"] ?? null,
    organizerName: tags.operator ?? null,
    source: "openstreetmap",
    sourceId: `${el.type}/${el.id}`,
  };
}