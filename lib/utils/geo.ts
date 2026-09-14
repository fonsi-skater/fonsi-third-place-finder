/**
 * Haversine formula: calculates the great-circle distance between two
 * lat/lng points, in meters. Used to filter/sort listings by actual
 * distance after a rough bounding-box query narrows things down.
 */
export function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Converts a radius in meters to a rough lat/lng bounding box around
 * a center point. This is a cheap first-pass filter we hand to
 * Supabase (an indexed range query) before doing the precise
 * Haversine distance check in application code.
 */
export function boundingBox(
  latitude: number,
  longitude: number,
  radiusMeters: number
) {
  const latDelta = radiusMeters / 111_000; // ~111km per degree latitude
  const lonDelta =
    radiusMeters / (111_000 * Math.cos((latitude * Math.PI) / 180));

  return {
    minLat: latitude - latDelta,
    maxLat: latitude + latDelta,
    minLon: longitude - lonDelta,
    maxLon: longitude + lonDelta,
  };
}
