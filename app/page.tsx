import { Navbar } from "@/components/layout/Navbar";
import { ListingsSection } from "@/components/listings/ListingsSection";
import type { ListingGridItem } from "@/components/listings/ListingGrid";
import { QuoteWidget } from "@/components/QuoteWidget";
import { createBrowserClient } from "@/lib/supabase/client";

async function getListings(): Promise<ListingGridItem[]> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from("listings")
    .select("id, title, category, address, recurrence, contact_url")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(24);

  if (error) {
    console.error("Failed to fetch listings:", error.message);
    return [];
  }

  return data ?? [];
}

export default async function HomePage() {
  const listings = await getListings();

  return (
    <main className="mx-auto max-w-6xl px-4 py-4">
      <section
        className="relative overflow-hidden rounded-card"
        style={{
          background: "linear-gradient(180deg, #1B3A2F 0%, #2E5240 45%, #F0E6D2 100%)",
        }}
      >
        <Navbar />

        <div className="mx-auto max-w-2xl px-6 pb-16 pt-10 text-center">
          <h1 className="font-display text-4xl font-semibold leading-tight text-sand sm:text-5xl">
            Find your people, nearby.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-sand/80 sm:text-base">
            Real hiking crews, cycling clubs, board game nights, and tech
            meetups happening near you this week — not another dead group
            chat.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
              <div className="flex -space-x-2">
                <span className="h-6 w-6 rounded-full border-2 border-forest bg-ember" />
                <span className="h-6 w-6 rounded-full border-2 border-forest bg-sand" />
                <span className="h-6 w-6 rounded-full border-2 border-forest bg-white" />
              </div>
              <span className="text-xs text-sand/90">
                {listings.length}+ groups meeting this week
              </span>
            </div>

            <a
              href="#listings"
              className="rounded-full bg-ember px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
            >
              See what's happening
            </a>
          </div>
        </div>
      </section>

      <QuoteWidget />

      <ListingsSection listings={listings} />
    </main>
  );
}
