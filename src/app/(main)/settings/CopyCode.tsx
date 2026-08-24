"use client";

import { useState } from "react";

export default function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          // Clipboard unavailable; the code is visible anyway.
        }
      }}
      aria-live="polite"
      className={`rounded-full px-4 py-2 text-sm font-bold shadow transition ${
        copied ? "animate-pop bg-basil text-white" : "bg-white text-mango hover:bg-cream-dark"
      }`}
    >
      {copied ? "Copied! ✓" : "Copy"}
    </button>
  );
}
