"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
      setLoading(false);
    }
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-2xl border border-cream-dark bg-white px-4 py-3 outline-none transition focus:border-mango focus:ring-4 focus:ring-mango/20"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-gradient-to-r from-tomato to-berry py-3.5 font-display text-lg font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? "Setting the table…" : "Sign in"}
      </button>
      <p className="text-center text-sm text-ink-soft">
        New here?{" "}
        <Link
          href={next && next !== "/dashboard" ? `/signup?next=${encodeURIComponent(next)}` : "/signup"}
          className="font-bold text-tomato hover:underline"
        >
          Create a family account
        </Link>
      </p>
    </form>
  );
}
