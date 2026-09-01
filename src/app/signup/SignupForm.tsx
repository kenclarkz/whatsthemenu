"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupForm({ next }: { next?: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;
      // Email confirmation may or may not be enabled; handle both.
      if (
        (await supabase.auth.getSession()).data.session
      ) {
        router.push(next && next !== "/dashboard" ? next : "/onboarding");
        router.refresh();
      } else {
        setDone(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign up");
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="animate-fade-up rounded-3xl border border-basil/30 bg-white p-8 text-center shadow-xl shadow-cream-dark">
        <div className="mb-4 text-6xl">📬</div>
        <h2 className="font-display text-2xl font-black">Check your inbox!</h2>
        <p className="mt-2 text-ink-soft">
          We sent a confirmation link to <strong>{email}</strong>. Click it,
          then sign in to start planning dinner.
        </p>
        <Link
          href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
          className="mt-6 inline-block rounded-full bg-gradient-to-r from-tomato to-berry px-8 py-3 font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p
          role="alert"
          className="animate-pop rounded-2xl border border-tomato/30 bg-tomato/10 px-4 py-3 text-sm font-semibold text-tomato-dark"
        >
          {error}
        </p>
      )}
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-bold text-ink">
          Your name
        </label>
        <input
          id="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Alex"
          className="w-full rounded-2xl border border-cream-dark bg-white px-4 py-3 outline-none transition focus:border-mango focus:ring-4 focus:ring-mango/20"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-ink">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@family.com"
          className="w-full rounded-2xl border border-cream-dark bg-white px-4 py-3 outline-none transition focus:border-mango focus:ring-4 focus:ring-mango/20"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-ink">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          className="w-full rounded-2xl border border-cream-dark bg-white px-4 py-3 outline-none transition focus:border-mango focus:ring-4 focus:ring-mango/20"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-gradient-to-r from-tomato to-berry py-3.5 font-display text-lg font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? "Cooking…" : "Create account"}
      </button>
      <p className="text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="font-bold text-tomato hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
