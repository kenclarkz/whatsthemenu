import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createFamily, joinFamily } from "@/lib/actions/family";

export const metadata: Metadata = { title: "Set up your family" };

const ERRORS: Record<string, string> = {
  name: "Please give your family a name.",
  code: "Something went wrong creating your family — try again.",
  "code-format": "Invite codes are exactly 6 characters.",
  "no-family": "No family found with that invite code.",
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("family_id")
    .eq("id", user.id)
    .single();

  if (profile?.family_id) redirect("/dashboard");

  const errorMsg = ERRORS[(await searchParams).error ?? ""];

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-14">
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-mango/30 blur-3xl animate-floaty" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-tomato/25 blur-3xl" />

      <div className="relative w-full max-w-lg animate-fade-up">
        <div className="mb-8 text-center">
          <div className="mb-3 text-6xl animate-floaty">👨‍👩‍👧‍👦</div>
          <h1 className="font-display text-4xl font-black">
            Who&apos;s eating tonight?
          </h1>
          <p className="mt-2 text-ink-soft">
            Create a new family or join one you&apos;ve been invited to.
          </p>
        </div>

        {errorMsg && (
          <p
            role="alert"
            className="animate-pop mb-6 rounded-2xl border border-tomato/30 bg-tomato/10 px-4 py-3 text-center text-sm font-semibold text-tomato-dark"
          >
            {errorMsg}
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <form
            action={createFamily}
            className="flex flex-col rounded-3xl bg-white p-7 shadow-xl shadow-tomato/10 ring-1 ring-tomato/10 transition hover:-translate-y-1"
          >
            <div className="mb-4 text-4xl">🌟</div>
            <h2 className="font-display text-xl font-black">Start a family</h2>
            <p className="mt-1 mb-4 flex-1 text-sm text-ink-soft">
              You&apos;ll be the organizer and can finalize the weekly menu.
            </p>
            <label htmlFor="family-name" className="sr-only">
              Family name
            </label>
            <input
              id="family-name"
              name="name"
              required
              placeholder="The Hendersons"
              className="mb-3 w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3 outline-none focus:border-mango focus:ring-4 focus:ring-mango/20"
            />
            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-tomato to-berry py-3 font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110 active:scale-[0.98]"
            >
              Create family
            </button>
          </form>

          <form
            action={joinFamily}
            className="flex flex-col rounded-3xl bg-white p-7 shadow-xl shadow-grape/10 ring-1 ring-grape/10 transition hover:-translate-y-1"
          >
            <div className="mb-4 text-4xl">🎟️</div>
            <h2 className="font-display text-xl font-black">Join a family</h2>
            <p className="mt-1 mb-4 flex-1 text-sm text-ink-soft">
              Got an invite code from the family organizer? Pop it in here.
            </p>
            <label htmlFor="invite-code" className="sr-only">
              Invite code
            </label>
            <input
              id="invite-code"
              name="code"
              required
              maxLength={6}
              placeholder="ABC123"
              className="mb-3 w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-center font-mono text-xl font-bold uppercase tracking-[0.35em] outline-none focus:border-grape focus:ring-4 focus:ring-grape/20"
            />
            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-grape to-berry py-3 font-bold text-white shadow-lg shadow-grape/30 transition hover:brightness-110 active:scale-[0.98]"
            >
              Join family
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
