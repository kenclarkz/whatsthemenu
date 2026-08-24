"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center px-6 py-14">
      <div className="animate-fade-up max-w-md rounded-3xl border border-tomato/30 bg-white p-10 text-center shadow-2xl shadow-tomato/10">
        <div className="mb-4 text-7xl">🍳💥</div>
        <h1 className="font-display text-3xl font-black">
          Something burned in the kitchen
        </h1>
        <p className="mt-2 text-ink-soft">
          An unexpected error occurred. Give it another try.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-ink-soft/60">
            ref: {error.digest}
          </p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-gradient-to-r from-tomato to-berry px-8 py-3 font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="rounded-full bg-cream px-8 py-3 font-bold text-ink-soft transition hover:bg-cream-dark"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
