"use client";

import { useState } from "react";

export default function InviteLink({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/join/${encodeURIComponent(code)}`
      : `#join/${encodeURIComponent(code)}`;

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setError(null);
            setTimeout(() => setCopied(false), 1600);
          } catch {
            // Fall back to a share intent / manual copy if available.
            if (navigator.share) {
              try {
                await navigator.share({ title: "Join our family dinner", text: "Help plan the week's menu!", url: link });
              } catch {
                setError("Couldn't copy automatically — tap the link below to send it.");
              }
            } else {
              setError("Couldn't copy automatically — tap the link below to send it.");
            }
          }
        }}
        aria-live="polite"
        className="w-full rounded-2xl bg-gradient-to-r from-grape to-berry py-3 font-bold text-white shadow-lg shadow-grape/30 transition hover:brightness-110 active:scale-[0.98]"
      >
        {copied ? "Link copied! ✓" : "📎 Copy invite link"}
      </button>

      <p className={`break-all rounded-2xl bg-cream px-4 py-3 text-center text-sm font-semibold text-ink ${error ? "text-tomato-dark" : ""}`}>
        {error ?? link}
      </p>

      <p className="text-xs text-ink-soft">
        Anyone with this link can sign in (or create an account) and join{" "}
        <span className="font-bold">the family</span> to choose meals for the week.
      </p>
    </div>
  );
}
