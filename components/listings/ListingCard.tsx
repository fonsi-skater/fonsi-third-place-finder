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
  title: string;
  category: ListingCategory;
  address: string | null;
  recurrence: string | null;
  contactUrl: string | null;
}

export function ListingCard({
  title,
  category,
  address,
  recurrence,
  contactUrl,
}: ListingCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <span className="w-fit rounded-full bg-forest/10 px-3 py-1 text-xs font-medium text-forest">
        {CATEGORY_LABELS[category]}
      </span>

      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>

      {address && <p className="text-sm text-muted">{address}</p>}

      {recurrence && (
        <p className="text-sm font-medium text-ember">{recurrence}</p>
      )}

      {contactUrl && (
        <a
          href={contactUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 text-sm font-medium text-forest underline underline-offset-2 hover:text-ember"
        >
          Visit website
        </a>
      )}
    </div>
  );
}
