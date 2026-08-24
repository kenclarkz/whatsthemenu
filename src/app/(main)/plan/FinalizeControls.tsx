"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { finalizeMenu, reopenMenu } from "@/lib/actions/plan";

export default function FinalizeControls({
  weekStart,
  finalized,
  isOrganizer,
  hasSuggestions,
}: {
  weekStart: string;
  finalized: boolean;
  isOrganizer: boolean;
  hasSuggestions: boolean;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOrganizer) {
    return (
      <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-ink-soft ring-1 ring-tomato/10">
        {finalized ? "✅ Menu finalized" : "🗳️ Voting open"}
      </span>
    );
  }

  async function doFinalize() {
    setPending(true);
    setError(null);
    try {
      await finalizeMenu(weekStart);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to finalize");
      setPending(false);
      setConfirming(false);
    }
  }

  async function doReopen() {
    setPending(true);
    try {
      await reopenMenu(weekStart);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reopen");
    }
    setPending(false);
  }

  if (finalized) {
    return (
      <div className="flex items-center gap-2">
        <span className="animate-pop rounded-full bg-basil/15 px-4 py-2 text-sm font-bold text-basil ring-1 ring-basil/30">
          ✅ Menu finalized — grocery list ready!
        </span>
        <button
          onClick={doReopen}
          disabled={pending}
          className="rounded-full bg-white px-4 py-2 text-sm font-bold text-ink-soft ring-1 ring-tomato/15 transition hover:text-tomato disabled:opacity-60"
        >
          {pending ? "…" : "Reopen"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setConfirming(true)}
        disabled={!hasSuggestions || pending}
        title={hasSuggestions ? "Lock in the top-voted meals" : "Add suggestions first"}
        className="rounded-full bg-gradient-to-r from-tomato to-berry px-5 py-2.5 font-display font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110 active:scale-[0.97] disabled:opacity-50"
      >
        ✅ Finalize menu
      </button>

      {error && (
        <p role="alert" className="text-sm font-semibold text-tomato-dark">{error}</p>
      )}

      {confirming && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => !pending && setConfirming(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Confirm finalize"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm animate-fade-up rounded-3xl bg-white p-7 text-center shadow-2xl"
          >
            <div className="mb-3 text-5xl">🍽️</div>
            <h3 className="font-display text-xl font-black">Finalize this menu?</h3>
            <p className="mt-2 text-sm text-ink-soft">
              The top-voted meal for each slot wins the week, and a merged
              grocery list is generated automatically.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setConfirming(false)}
                disabled={pending}
                className="rounded-full bg-cream px-6 py-2.5 text-sm font-bold text-ink-soft transition hover:bg-cream-dark"
              >
                Not yet
              </button>
              <button
                onClick={doFinalize}
                disabled={pending}
                className="rounded-full bg-gradient-to-r from-tomato to-berry px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110 disabled:opacity-60"
              >
                {pending ? "Finalizing…" : "Yes, lock it in!"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
