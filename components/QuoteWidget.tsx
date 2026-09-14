"use client";

import { useEffect, useState } from "react";

const QUOTES = [
  "Showing up is the whole trick. Everything good starts there.",
  "Someone nearby is looking for exactly what you're looking for: a reason to leave the house.",
  "Boredom is just your calendar asking for a plot twist.",
  "You don't need the perfect group. You need the next one.",
  "Small talk today, real friends by next month. It happens more than you'd think.",
  "The hardest part of any hobby is showing up once. You've basically already won.",
  "Somewhere near you, a group is meeting this week that would be glad you came.",
  "Loneliness lies. It tells you nobody's out there. There's always somebody out there.",
  "You are one Tuesday hike away from a new favorite person.",
  "Community isn't found. It's attended.",
  "Every regular at every club was once a stranger who just showed up.",
  "Your future best friend is currently also scrolling, also bored, also hoping.",
];

/**
 * Playful, colorful rotating quote strip. Auto-advances every 6s,
 * with a manual "next" for people who want to skip ahead.
 * Uses original lines (not quoted from any external source) to
 * stay squarely on the right side of copyright.
 */
export function QuoteWidget() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  function next() {
    setIndex((i) => (i + 1) % QUOTES.length);
  }

  return (
    <div className="my-8 flex items-center gap-4 rounded-card bg-gradient-to-r from-ember/10 via-sand to-forest/10 px-6 py-5">
      <span className="text-2xl" aria-hidden>
        ✨
      </span>
      <p className="flex-1 font-display text-base font-medium text-ink sm:text-lg">
        {QUOTES[index]}
      </p>
      <button
        onClick={next}
        aria-label="Next quote"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/60 text-ink transition-colors hover:bg-white"
      >
        →
      </button>
    </div>
  );
}
