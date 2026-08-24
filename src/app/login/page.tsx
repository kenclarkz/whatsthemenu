import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const next = (await searchParams).next ?? "/dashboard";

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="relative hidden overflow-hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-tomato/80 via-tomato/30 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" className="font-display text-3xl font-black drop-shadow">
            🍽️ Whats For Dinner
          </Link>
          <div>
            <h2 className="animate-fade-up font-display text-5xl font-black leading-tight drop-shadow-lg">
              The whole family,
              <br />
              one delicious week.
            </h2>
            <p className="mt-4 max-w-md text-lg text-white/90">
              Suggest meals, vote for favorites, and let the grocery list
              write itself.
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-14 animate-fade-up">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-10 block text-center font-display text-3xl font-black lg:hidden"
          >
            🍽️ <span className="text-gradient-warm">Whats For Dinner</span>
          </Link>
          <h1 className="text-center font-display text-4xl font-black">
            Welcome back!
          </h1>
          <p className="mt-2 mb-8 text-center text-ink-soft">
            Dinner is better when everyone&apos;s at the table.
          </p>
          <LoginForm next={next} />
        </div>
      </section>
    </main>
  );
}
