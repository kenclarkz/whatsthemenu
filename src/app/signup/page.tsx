import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "./SignupForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import SetupRequired from "@/components/SetupRequired";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  if (!isSupabaseConfigured()) return <SetupRequired />;

  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-14">
      <div className="w-full max-w-md animate-fade-up">
        <Link href="/" className="mb-10 block text-center font-display text-3xl font-black">
          🍽️ <span className="text-gradient-warm">Whats For Dinner</span>
        </Link>
        <h1 className="text-center font-display text-4xl font-black">
          Join the table
        </h1>
        <p className="mt-2 mb-8 text-center text-ink-soft">
          Create your account, then start or join a family.
        </p>
        <SignupForm />
      </div>
    </main>
  );
}
