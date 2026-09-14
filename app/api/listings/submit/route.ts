import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { ListingCategory } from "@/types/listing";

const VALID_CATEGORIES: ListingCategory[] = [
  "sports",
  "hobbies",
  "faith",
  "tech",
  "arts",
  "other",
];

/**
 * Public submission endpoint. Anyone can POST here, but every
 * submission is inserted with is_active = false — it stays invisible
 * on the site until manually approved in Supabase's Table Editor.
 * This is the moderation gate that keeps the public write-open
 * without letting spam or bad data appear live immediately.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { title, category, address, latitude, longitude, recurrence, contactUrl, organizerName } = body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return NextResponse.json({ error: "Valid latitude/longitude are required" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { error } = await supabase.from("listings").insert({
    title: title.trim(),
    category,
    address: address?.trim() || null,
    latitude,
    longitude,
    recurrence: recurrence?.trim() || null,
    contact_url: contactUrl?.trim() || null,
    organizer_name: organizerName?.trim() || null,
    source: "user_submitted",
    source_id: null,
    is_active: false, // pending manual review
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
