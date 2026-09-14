import type { ListingCategory } from "@/types/listing";

export const CATEGORIES: { value: ListingCategory; label: string }[] = [
  { value: "sports", label: "Sports & Fitness" },
  { value: "hobbies", label: "Hobbies & Games" },
  { value: "faith", label: "Faith & Worship" },
  { value: "tech", label: "Tech & Coworking" },
  { value: "arts", label: "Arts & Culture" },
  { value: "other", label: "Other" },
];

// Default search origin for the cron job — Ruiru, Kenya.
// Update this (or pass lat/lng as query params) to fetch a different area.
export const DEFAULT_ORIGIN = {
  latitude: -1.1487,
  longitude: 36.9614,
  radiusMeters: 8000,
};
