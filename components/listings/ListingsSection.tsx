"use client";

import { useMemo, useState } from "react";
import { ListingGrid, type ListingGridItem } from "./ListingGrid";
import { LocationSearch } from "./LocationSearch";
import { CATEGORIES } from "@/config/categories";
import type { ListingCategory } from "@/types/listing";

export function ListingsSection({ listings }: { listings: ListingGridItem[] }) {
  const [selected, setSelected] = useState<ListingCategory | "all">("all");

  // When set, we're showing search results for a specific place instead
  // of the default nearby list. null means "no active search."
  const [searchResults, setSearchResults] = useState<ListingGridItem[] | null>(null);
  const [searchPlaceName, setSearchPlaceName] = useState<string | null>(null);

  const activeList = searchResults ?? listings;

  const filtered = useMemo(() => {
    if (selected === "all") return activeList;
    return activeList.filter((l) => l.category === selected);
  }, [activeList, selected]);

  return (
    <section id="listings" className="py-12">
      <div className="mb-4">
        <h2 className="font-display text-2xl font-semibold text-ink">
          {searchPlaceName ? `Near ${searchPlaceName}` : "Happening near Ruiru"}
        </h2>
      </div>

      <LocationSearch
        onResults={(results, placeName) => {
          setSearchResults(results);
          setSearchPlaceName(placeName);
        }}
        onClear={() => {
          setSearchResults(null);
          setSearchPlaceName(null);
        }}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <FilterPill
          label="All"
          active={selected === "all"}
          onClick={() => setSelected("all")}
        />
        {CATEGORIES.map((c) => (
          <FilterPill
            key={c.value}
            label={c.label}
            active={selected === c.value}
            onClick={() => setSelected(c.value)}
          />
        ))}
      </div>

      <ListingGrid listings={filtered} />
    </section>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-forest text-white"
          : "bg-black/5 text-muted hover:bg-black/10"
      }`}
    >
      {label}
    </button>
  );
}
