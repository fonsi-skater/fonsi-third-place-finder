"use client";

import { useEffect, useState } from "react";

interface InterestedButtonProps {
  listingId: string;
  initialCount: number;
}

/**
 * "I'm interested" button. Uses localStorage (safe here - this is a
 * real deployed browser app, not a sandboxed preview) to remember
 * which listings this browser already clicked, so one person can't
 * inflate the count by clicking repeatedly.
 */
export function InterestedButton({ listingId, initialCount }: InterestedButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const clickedIds = JSON.parse(localStorage.getItem("interestedListings") ?? "[]");
    setClicked(clickedIds.includes(listingId));
  }, [listingId]);

  async function handleClick() {
    if (clicked) return;

    setClicked(true);
    setCount((c) => c + 1);

    const clickedIds = JSON.parse(localStorage.getItem("interestedListings") ?? "[]");
    localStorage.setItem(
      "interestedListings",
      JSON.stringify([...clickedIds, listingId])
    );

    try {
      const res = await fetch(`/api/listings/${listingId}/interested`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && typeof data.interestedCount === "number") {
        setCount(data.interestedCount);
      }
    } catch {
      // Count already updated optimistically; a failed network call
      // here just means the server count may lag by one until refresh.
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={clicked}
      className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
        clicked
          ? "bg-forest/10 text-forest"
          : "bg-forest text-white hover:opacity-90"
      }`}
    >
      {clicked ? "You're interested" : "I'm interested"}
      <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
        {count}
      </span>
    </button>
  );
}
