import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Invite not found" };

export default function JoinNotFound() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-14">
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-mango/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-tomato/25 blur-3xl" />

      <div className="relative w-full max-w-md animate-fade-up text-center">
        <div className="mb-4 text-6xl">🧾</div>
        <h1 className="font-display text-4xl font-black">Invite not found</h1>
        <p className="mt-2 text-ink-soft">
          That link isn&apos;t valid. It may have been copied wrong, or the family
          invite is no longer active.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-gradient-to-r from-tomato to-berry px-8 py-3 font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
