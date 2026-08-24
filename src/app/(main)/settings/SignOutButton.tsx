"use client";

import { useTransition } from "react";
import { signOut } from "@/lib/actions/auth";

export default function SignOutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await signOut();
        })
      }
      disabled={pending}
      className="rounded-full bg-tomato/10 px-6 py-2.5 font-bold text-tomato ring-1 ring-tomato/20 transition hover:bg-tomato hover:text-white disabled:opacity-60"
    >
      {pending ? "Signing out…" : "Sign out 👋"}
    </button>
  );
}
