"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CookAgainButton({ recipeId }: { recipeId: string }) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function cookAgain() {
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.rpc("cook_again", {
        p_recipe_id: recipeId,
      });
      if (!error) setDone(true);
    });
  }

  if (done) {
    return (
      <span className="animate-pop rounded-full bg-basil/15 px-3 py-1.5 text-xs font-bold text-basil">
        ✓ Added to next week!
      </span>
    );
  }

  return (
    <button
      onClick={cookAgain}
      disabled={pending}
      title="Suggest this dish for next week's dinner"
      className="rounded-full bg-cream px-3 py-1.5 text-xs font-bold text-tomato ring-1 ring-tomato/20 transition hover:bg-tomato hover:text-white disabled:opacity-50"
    >
      {pending ? "…" : "🔁 Cook again"}
    </button>
  );
}
