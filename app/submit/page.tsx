import { Navbar } from "@/components/layout/Navbar";
import { SubmitGroupForm } from "@/components/forms/SubmitGroupForm";

export default function SubmitPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-4">
      <section
        className="rounded-card px-2"
        style={{ background: "#1B3A2F" }}
      >
        <Navbar />
      </section>

      <div className="mx-auto max-w-lg py-12">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Submit a group
        </h1>
        <p className="mt-2 text-sm text-muted">
          Know a hiking crew, cycling club, board game night, or any
          recurring meetup that should be on here? Add it below - we
          review every submission before it goes live.
        </p>

        <div className="mt-8">
          <SubmitGroupForm />
        </div>
      </div>
    </main>
  );
}
