import Link from "next/link";

const steps = [
  {
    title: "Create a Supabase project",
    body: (
      <>
        Sign up at{" "}
        <a
          href="https://supabase.com"
          target="_blank"
          rel="noreferrer"
          className="font-bold text-tomato underline underline-offset-2"
        >
          supabase.com
        </a>{" "}
        (free tier is fine).
      </>
    ),
  },
  {
    title: "Run the database setup",
    body: (
      <>
        In the Supabase SQL editor, run <code>supabase/schema.sql</code> then{" "}
        <code>supabase/seed.sql</code> from this repository.
      </>
    ),
  },
  {
    title: "Add the environment variables",
    body: (
      <>
        In your hosting provider, set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> from Supabase → Settings →
        API, then redeploy.
      </>
    ),
  },
];

export default function SetupRequired() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-14">
      <div className="animate-fade-up w-full max-w-lg rounded-3xl border border-tomato/20 bg-white p-8 shadow-2xl shadow-tomato/10 sm:p-10">
        <div className="text-center">
          <div className="mb-4 text-6xl">🔧</div>
          <h1 className="font-display text-3xl font-black sm:text-4xl">
            Almost on the table!
          </h1>
          <p className="mt-3 text-ink-soft">
            This site is live, but it isn&apos;t connected to its database yet.
            One-time setup:
          </p>
        </div>

        <ol className="mt-8 space-y-5">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-tomato to-berry font-display font-black text-white shadow-lg shadow-tomato/30">
                {i + 1}
              </span>
              <div>
                <p className="font-bold">{step.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-ink-soft [&_code]:rounded-md [&_code]:bg-cream-dark [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <Link
          href="/"
          className="mt-8 block rounded-full bg-gradient-to-r from-tomato to-berry px-8 py-3 text-center font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110"
        >
          I&apos;ve set it up — check again
        </Link>
      </div>
    </main>
  );
}
