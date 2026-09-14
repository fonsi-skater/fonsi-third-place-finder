import { ListingCard } from "./ListingCard";
import type { ListingCategory } from "@/types/listing";

export interface ListingGridItem {
  id: string;
  title: string;
  category: ListingCategory;
  address: string | null;
  recurrence: string | null;
  contact_url: string | null;
}

export function ListingGrid({ listings }: { listings: ListingGridItem[] }) {
  if (listings.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted">
        No listings yet for this area — the automated fetch runs daily,
        check back soon.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          title={listing.title}
          category={listing.category}
          address={listing.address}
          recurrence={listing.recurrence}
          contactUrl={listing.contact_url}
        />
      ))}
    </div>
  );
}
