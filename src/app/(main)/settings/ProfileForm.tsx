"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import { updateProfile } from "@/lib/actions/auth";
import type { Profile } from "@/lib/types";

const COLORS = [
  "#ff5a3c", "#e63975", "#7c5cff", "#3f9142",
  "#ffa62b", "#0ea5b5", "#d946ef", "#f43f5e",
];

export default function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [name, setName] = useState(profile.name);
  const [color, setColor] = useState(profile.avatar_color);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransitionState();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("name", name);
    fd.set("avatar_color", color);
    startTransition(async () => {
      await updateProfile(fd);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl bg-white p-6 ring-1 ring-tomato/10 md:p-8"
    >
      <h2 className="mb-4 font-display text-xl font-black">Your profile</h2>
      <div className="mb-5 flex items-center gap-4">
        <Avatar name={name || "?"} color={color} size="lg" />
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={`Pick color ${c}`}
              aria-pressed={c === color}
              className={`h-8 w-8 rounded-full transition-all ${
                c === color
                  ? "scale-110 ring-4 ring-offset-2 ring-tomato/40"
                  : "hover:scale-110"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <label htmlFor="profile-name" className="mb-1.5 block text-sm font-bold">
        Display name
      </label>
      <input
        id="profile-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={40}
        required
        className="w-full max-w-xs rounded-2xl border border-cream-dark bg-cream px-4 py-2.5 outline-none focus:border-mango focus:ring-4 focus:ring-mango/20"
      />
      <div className="mt-5">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gradient-to-r from-tomato to-berry px-7 py-2.5 font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110 active:scale-[0.97] disabled:opacity-60"
        >
          {pending ? "Saving…" : saved ? "Saved! ✓" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function useTransitionState() {
  const [pending, setPending] = useState(false);

  function wrap(fn: () => Promise<void>) {
    setPending(true);
    void (async () => {
      await fn();
      setPending(false);
    })();
  }

  return [pending, wrap] as const;
}
