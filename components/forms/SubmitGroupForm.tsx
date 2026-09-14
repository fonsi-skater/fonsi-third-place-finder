"use client";

import { useState } from "react";
import { CATEGORIES } from "@/config/categories";
import type { ListingCategory } from "@/types/listing";

export function SubmitGroupForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ListingCategory>("sports");
  const [placeName, setPlaceName] = useState("");
  const [recurrence, setRecurrence] = useState("");
  const [contactUrl, setContactUrl] = useState("");
  const [organizerName, setOrganizerName] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      // Step 1: turn the place name into coordinates via our geocode proxy.
      const geoRes = await fetch(`/api/geocode?q=${encodeURIComponent(placeName)}`);
      const geoData = await geoRes.json();

      if (!geoRes.ok) {
        setStatus("error");
        setErrorMessage(geoData.error ?? "Couldn't find that location. Try being more specific.");
        return;
      }

      // Step 2: submit the listing with those coordinates attached.
      const submitRes = await fetch("/api/listings/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          address: geoData.displayName,
          latitude: geoData.latitude,
          longitude: geoData.longitude,
          recurrence,
          contactUrl,
          organizerName,
        }),
      });

      const submitData = await submitRes.json();

      if (!submitRes.ok) {
        setStatus("error");
        setErrorMessage(submitData.error ?? "Submission failed. Try again.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-card border border-forest/20 bg-forest/5 p-6 text-center">
        <p className="font-display text-lg font-semibold text-forest">Thanks for the submission!</p>
        <p className="mt-2 text-sm text-muted">
          We review every group before it goes live to keep listings accurate. It'll appear on the site once approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Group name">
        <input
          required
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Ruiru Sunday Hikers"
          className="input"
        />
      </Field>

      <Field label="Category">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ListingCategory)}
          className="input"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Where does it meet?">
        <input
          required
          type="text"
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          placeholder="e.g. Ruiru Sports Club, or a nearby landmark"
          className="input"
        />
      </Field>

      <Field label="When does it meet? (optional)">
        <input
          type="text"
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value)}
          placeholder="e.g. Every Sunday, 7:00 AM"
          className="input"
        />
      </Field>

      <Field label="WhatsApp link or website (optional)">
        <input
          type="url"
          value={contactUrl}
          onChange={(e) => setContactUrl(e.target.value)}
          placeholder="https://..."
          className="input"
        />
      </Field>

      <Field label="Your name or the organizer's name (optional)">
        <input
          type="text"
          value={organizerName}
          onChange={(e) => setOrganizerName(e.target.value)}
          className="input"
        />
      </Field>

      {status === "error" && (
        <p className="text-sm text-ember">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 rounded-full bg-ember px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting…" : "Submit group"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
