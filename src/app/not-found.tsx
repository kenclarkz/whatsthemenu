import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-14">
      <div className="animate-fade-up max-w-md rounded-3xl border border-mango/40 bg-white p-10 text-center shadow-2xl shadow-mango/10">
        <div className="mb-4 text-7xl animate-floaty">🍽️</div>
        <h1 className="font-display text-3xl font-black">
          This dish isn&apos;t on the menu
        </h1>
        <p className="mt-2 text-ink-soft">
          The page you&apos;re looking for has been eaten.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-full bg-gradient-to-r from-tomato to-berry px-8 py-3 font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110"
        >
          Back to the dashboard
        </Link>
      </div>
    </main>
  );
}
