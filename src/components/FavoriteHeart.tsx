"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export default function FavoriteHeart({
  recipeId,
  initial,
}: {
  recipeId: string;
  initial: boolean;
}) {
  const [fav, setFav] = useState(initial);
  const [, startTransition] = useTransition();

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setFav(!fav);

    const supabase = createClient();
    startTransition(async () => {
      if (fav) {
        await supabase
          .from("favorites")
          .delete()
          .eq("recipe_id", recipeId)
          .eq("user_id", (await supabase.auth.getUser()).data.user!.id);
      } else {
        await supabase.from("favorites").insert({ recipe_id: recipeId });
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={fav}
      className={`grid h-9 w-9 place-items-center rounded-full bg-white/85 text-lg shadow-sm backdrop-blur transition-all duration-200 hover:scale-110 hover:bg-white ${
        fav ? "animate-pop text-berry" : "text-ink-soft"
      }`}
    >
      {fav ? "❤️" : "🤍"}
    </button>
  );
}
