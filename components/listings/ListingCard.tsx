import Link from "next/link";
import type { ListingCategory } from "@/types/listing";

const CATEGORY_LABELS: Record<ListingCategory, string> = {
  sports: "Sports & Fitness",
  hobbies: "Hobbies & Games",
  faith: "Faith & Worship",
  tech: "Tech & Coworking",
  arts: "Arts & Culture",
  other: "Other",
};

export interface ListingCardProps {
  id: string;
  title: string;
  category: ListingCategory;
  address: string | null;
  recurrence: string | null;
}

export function ListingCard({
  id,
  title,
  category,
  address,
  recurrence,
}: ListingCardProps) {
  return (
    <Link
      href={`/listings/${id}`}
      className="flex flex-col gap-3 rounded-card border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <span className="w-fit rounded-full bg-forest/10 px-3 py-1 text-xs font-medium text-forest">
        {CATEGORY_LABELS[category]}
      </span>

      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>

      {address && <p className="text-sm text-muted">{address}</p>}

      {recurrence && (
        <p className="text-sm font-medium text-ember">{recurrence}</p>
      )}

      <span className="mt-1 text-sm font-medium text-forest">
        View details →
      </span>
    </Link>
  );
}
