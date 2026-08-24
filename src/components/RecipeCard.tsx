import Link from "next/link";
import FoodImage from "@/components/FoodImage";
import FavoriteHeart from "@/components/FavoriteHeart";
import type { Recipe } from "@/lib/types";

export default function RecipeCard({
  recipe,
  favorited = false,
  index = 0,
}: {
  recipe: Recipe;
  favorited?: boolean;
  index?: number;
}) {
  return (
    <article
      className="group relative animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 60, 480)}ms` }}
    >
      <Link
        href={`/recipes/${recipe.id}`}
        className="block overflow-hidden rounded-3xl bg-white shadow-lg shadow-tomato/5 ring-1 ring-tomato/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-tomato/15"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <FoodImage
            src={recipe.image_url}
            alt={recipe.title}
            category={recipe.category}
            sizes="(min-width: 768px) 33vw, 50vw"
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-ink backdrop-blur">
            {categoryEmoji(recipe.category)} {recipe.category}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg font-black leading-snug group-hover:text-tomato">
            {recipe.title}
          </h3>
          <p className="mt-1 line-clamp-2 min-h-[2.4rem] text-sm text-ink-soft">
            {recipe.description}
          </p>
          <p className="mt-3 flex items-center gap-3 text-xs font-bold text-ink-soft">
            <span>⏱️ {totalTime(recipe)}</span>
            <span>🍽️ {recipe.servings} servings</span>
          </p>
        </div>
      </Link>
      <div className="absolute right-3 top-3">
        <FavoriteHeart recipeId={recipe.id} initial={favorited} />
      </div>
    </article>
  );
}

function totalTime(r: Recipe): string {
  const mins = (r.prep_minutes ?? 0) + (r.cook_minutes ?? 0);
  if (!mins) return "Quick";
  return mins >= 60 ? `${Math.round((mins / 60) * 10) / 10} hr` : `${mins} min`;
}

function categoryEmoji(category: string): string {
  const map: Record<string, string> = {
    Breakfast: "🥞", Pasta: "🍝", Pizza: "🍕", Mexican: "🌮",
    Asian: "🍜", Indian: "🍛", "Comfort Food": "🍲", Healthy: "🥗",
    Seafood: "🍤", Soup: "🥣", Salad: "🥙", Dessert: "🍰",
  };
  return map[category] ?? "🍽️";
}
