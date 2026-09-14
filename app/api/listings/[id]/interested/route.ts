import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Increments a listing's interested_count by 1, atomically, via the
 * increment_interested Postgres function (see migrations/002).
 * Uses the service client since public users can't write directly
 * to the listings table (RLS only allows reads).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServiceClient();

  const { data, error } = await supabase.rpc("increment_interested", {
    listing_id: params.id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ interestedCount: data });
}
