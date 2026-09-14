"use client";

import { useState } from "react";
import type { ListingGridItem } from "./ListingGrid";

interface LocationSearchProps {
  onResults: (listings: ListingGridItem[], placeName: string) => void;
  onClear: () => void;
}

export function LocationSearch({ onResults, onClear }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const geoRes = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const geoData = await geoRes.json();

      if (!geoRes.ok) {
        setError(geoData.error ?? "Couldn't find that place");
        setLoading(false);
        return;
      }

      const searchRes = await fetch(
        `/api/listings/search?lat=${geoData.latitude}&lng=${geoData.longitude}&radius=8000`
      );
      const searchData = await searchRes.json();

      if (!searchRes.ok) {
        setError(searchData.error ?? "Search failed");
        setLoading(false);
        return;
      }

      onResults(searchData.listings, geoData.displayName);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setQuery("");
    setError(null);
    onClear();
  }

  return (
    <form onSubmit={handleSearch} className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="flex flex-1 gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a place — e.g. Ruiru, Githunguri, Nairobi CBD"
          className="flex-1 rounded-full border border-black/10 px-4 py-2 text-sm text-ink outline-none focus:border-forest"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-forest px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Searching…" : "Search"}
        </button>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full bg-black/5 px-4 py-2 text-sm text-muted hover:bg-black/10"
          >
            Clear
          </button>
        )}
      </div>
      {error && <p className="text-sm text-ember">{error}</p>}
    </form>
  );
}
