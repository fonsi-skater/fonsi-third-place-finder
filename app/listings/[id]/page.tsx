import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { InterestedButton } from "@/components/listings/InterestedButton";
import { WhatsAppShareButton } from "@/components/listings/WhatsAppShareButton";
import { createBrowserClient } from "@/lib/supabase/client";

const CATEGORY_LABELS: Record<string, string> = {
  sports: "Sports & Fitness",
  hobbies: "Hobbies & Games",
  faith: "Faith & Worship",
  tech: "Tech & Coworking",
  arts: "Arts & Culture",
  other: "Other",
};

async function getListing(id: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const listing = await getListing(params.id);

  if (!listing) notFound();

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${listing.latitude},${listing.longitude}`;
  const pageUrl = `https://your-deployed-domain.vercel.app/listings/${listing.id}`;

  return (
    <main className="mx-auto max-w-3xl px-4 py-4">
      <section className="rounded-card px-2" style={{ background: "#1B3A2F" }}>
        <Navbar />
      </section>

      <div className="py-8">
        <Link href="/" className="text-sm text-muted hover:text-forest">
          &larr; Back to all listings
        </Link>

        <div className="mt-4 flex flex-col gap-4">
          <span className="w-fit rounded-full bg-forest/10 px-3 py-1 text-xs font-medium text-forest">
            {CATEGORY_LABELS[listing.category] ?? listing.category}
          </span>

          <h1 className="font-display text-3xl font-semibold text-ink">
            {listing.title}
          </h1>

          {listing.description && (
            <p className="text-sm text-muted">{listing.description}</p>
          )}

          <div className="flex flex-col gap-2 rounded-card border border-black/5 bg-white p-5">
            {listing.address && (
              <DetailRow label="Location" value={listing.address} />
            )}
            {listing.recurrence && (
              <DetailRow label="When" value={listing.recurrence} />
            )}
            {listing.organizer_name && (
              <DetailRow label="Organizer" value={listing.organizer_name} />
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <InterestedButton
              listingId={listing.id}
              initialCount={listing.interested_count ?? 0}
            />
            <WhatsAppShareButton title={listing.title} url={pageUrl} />
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-black/5 px-5 py-2.5 text-sm font-medium text-ink hover:bg-black/10"
            >
              Get directions
            </a>
            {listing.contact_url && (
              <a
                href={listing.contact_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-ember px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                Visit website
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="font-medium text-ink">{label}:</span>
      <span className="text-muted">{value}</span>
    </div>
  );
}
