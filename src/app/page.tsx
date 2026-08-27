import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import SetupRequired from "@/components/SetupRequired";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Whats For Dinner",
  description:
    "Colorful family meal planning — suggest, vote, finalize, and shop together.",
};

export default async function Home() {
  if (!isSupabaseConfigured()) return <SetupRequired />;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-dvh">
      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <Link href="/" className="font-display text-2xl font-black leading-none">
          🍽️ <span className="text-gradient-warm">Whats For Dinner</span>
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-gradient-to-r from-tomato to-berry px-6 py-2.5 font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110"
            >
              Go to dashboard →
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-5 py-2.5 font-bold text-ink transition hover:text-tomato"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-tomato to-berry px-6 py-2.5 font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 md:px-12 md:pt-24 lg:pt-32">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-br from-tomato/20 via-mango/15 to-berry/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-6 inline-block rounded-full bg-mango/15 px-4 py-1.5 text-sm font-bold text-amber-700 ring-1 ring-mango/25">
            Family meal planning made fun
          </span>
          <h1 className="animate-fade-up font-display text-5xl font-black leading-[1.1] tracking-tight md:text-7xl">
            What&apos;s for{" "}
            <span className="text-gradient-warm">dinner</span>?
          </h1>
          <p
            className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl"
            style={{ animationDelay: "80ms" }}
          >
            Suggest meals, vote as a family, let the organizer finalize the
            weekly menu — and the grocery list writes itself.
          </p>
          <div
            className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
            style={{ animationDelay: "160ms" }}
          >
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-gradient-to-r from-tomato to-berry px-10 py-4 font-display text-lg font-bold text-white shadow-xl shadow-tomato/30 transition hover:brightness-110 active:scale-[0.97]"
              >
                Open your dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="rounded-full bg-gradient-to-r from-tomato to-berry px-10 py-4 font-display text-lg font-bold text-white shadow-xl shadow-tomato/30 transition hover:brightness-110 active:scale-[0.97]"
                >
                  Start planning — it&apos;s free
                </Link>
                <Link
                  href="/login"
                  className="rounded-full bg-white px-10 py-4 font-display text-lg font-bold text-ink ring-1 ring-tomato/15 transition hover:bg-cream-dark hover:shadow-lg"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative bg-white/60 px-6 py-20 backdrop-blur-sm md:px-12">
        <div className="mx-auto max-w-6xl">
          <h2
            className="animate-fade-up text-center font-display text-3xl font-black md:text-4xl"
          >
            Everything your family needs 🍳
          </h2>
          <p
            className="animate-fade-up mx-auto mt-3 max-w-xl text-center text-ink-soft"
            style={{ animationDelay: "60ms" }}
          >
            One app to rule the weekly meal plan.
          </p>

          <div
            className="animate-fade-up mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            style={{ animationDelay: "120ms" }}
          >
            <FeatureCard
              icon="🗳️"
              title="Suggest & vote"
              body="Everyone puts forward their favorite ideas. The family votes — democracy meets dinner."
            />
            <FeatureCard
              icon="📅"
              title="Weekly plan"
              body="A clean board for breakfast, lunch, and dinner. Weekly or biweekly view, finalize when you're ready."
            />
            <FeatureCard
              icon="🛒"
              title="Smart grocery list"
              body="Auto-generated from the finalized menu. Duplicates merged, quantities summed, grouped by aisle."
            />
            <FeatureCard
              icon="📖"
              title="Recipe cookbook"
              body="Build your family's recipe collection with photos, ingredients by aisle, and step-by-step instructions."
            />
            <FeatureCard
              icon="👨‍👩‍👧‍👦"
              title="Family accounts"
              body="Create a family or join with a 6-digit invite code. Everyone sees only their own meals."
            />
            <FeatureCard
              icon="🔒"
              title="Private & secure"
              body="Row-level security ensures every family sees only their data. No shared tables, no leaks."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:px-12">
        <div className="animate-fade-up mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-tomato to-berry p-10 text-center text-white shadow-2xl shadow-tomato/25 md:p-14">
          <h2 className="font-display text-3xl font-black md:text-4xl">
            Ready to plan your first dinner?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/90">
            Sign up, create your family, and start suggesting meals in minutes.
            It&apos;s free and always will be.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-white px-10 py-4 font-display text-lg font-bold text-tomato shadow-xl transition hover:bg-cream-dark hover:brightness-105 active:scale-[0.97]"
              >
                Go to dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="rounded-full bg-white px-10 py-4 font-display text-lg font-bold text-tomato shadow-xl transition hover:bg-cream-dark hover:brightness-105 active:scale-[0.97]"
                >
                  Get started — it&apos;s free
                </Link>
                <Link
                  href="/login"
                  className="rounded-full bg-white/20 px-10 py-4 font-display text-lg font-bold text-white backdrop-blur transition hover:bg-white/30"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-tomato/10 px-6 py-8 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <span className="font-display text-sm font-bold text-ink-soft">
            🍽️ Whats For Dinner
          </span>
          <span className="text-xs text-ink-soft/60">
            Built with Next.js & Supabase
          </span>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div className="group rounded-3xl bg-white p-7 ring-1 ring-tomato/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-tomato/10">
      <div className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="font-display text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}
