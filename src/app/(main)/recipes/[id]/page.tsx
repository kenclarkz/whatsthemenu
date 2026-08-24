import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FoodImage from "@/components/FoodImage";
import FavoriteHeart from "@/components/FavoriteHeart";
import type { Recipe } from "@/lib/types";

export default async function RecipeDetailPage({
  params,
}: PageProps<"/recipes/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: recipe }, { data: fav }] = await Promise.all([
    supabase.from("recipes").select("*").eq("id", id).maybeSingle<Recipe>(),
    supabase
      .from("favorites")
      .select("recipe_id")
      .eq("recipe_id", id)
      .maybeSingle(),
  ]);

  if (!recipe) notFound();

  const aisleOrder = [
    "Produce", "Meat & Seafood", "Dairy", "Bakery",
    "Pantry", "Frozen", "Spices", "Other",
  ];
  const byAisle = new Map<string, typeof recipe.ingredients>();
  for (const ing of recipe.ingredients ?? []) {
    const aisle = ing.aisle || "Other";
    if (!byAisle.has(aisle)) byAisle.set(aisle, []);
    byAisle.get(aisle)!.push(ing);
  }
  const aisles = [...byAisle.keys()].sort(
    (a, b) => aisleOrder.indexOf(a) - aisleOrder.indexOf(b),
  );

  return (
    <article className="space-y-8">
      <Link
        href="/recipes"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft transition hover:text-tomato"
      >
        ← Back to recipes
      </Link>

      {/* Hero */}
      <header className="animate-fade-up relative overflow-hidden rounded-[2rem] shadow-2xl shadow-tomato/20">
        <div className="relative aspect-[16/9] sm:aspect-[21/9]">
          <FoodImage
            src={recipe.image_url}
            alt={recipe.title}
            category={recipe.category}
            priority
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-10">
            <div>
              <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-ink backdrop-blur">
                {recipe.category}
              </span>
              <h1 className="mt-3 font-display text-3xl font-black leading-tight text-white drop-shadow-lg md:text-5xl">
                {recipe.title}
              </h1>
            </div>
            <FavoriteHeart recipeId={recipe.id} initial={!!fav} />
          </div>
        </div>
      </header>

      <div
        className="flex flex-wrap gap-3 animate-fade-up"
        style={{ animationDelay: "80ms" }}
      >
        <Stat icon="🍽️" label="Servings" value={`${recipe.servings}`} />
        <Stat icon="🔪" label="Prep" value={recipe.prep_minutes ? `${recipe.prep_minutes} min` : "—"} />
        <Stat icon="🔥" label="Cook" value={recipe.cook_minutes ? `${recipe.cook_minutes} min` : "—"} />
      </div>

      {recipe.description && (
        <p className="-mt-2 max-w-2xl text-lg text-ink-soft animate-fade-up" style={{ animationDelay: "120ms" }}>
          {recipe.description}
        </p>
      )}

      <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
        {/* Ingredients */}
        <section aria-label="Ingredients">
          <h2 className="mb-4 font-display text-2xl font-black">Ingredients</h2>
          {aisles.length === 0 ? (
            <p className="text-ink-soft">No ingredients listed yet.</p>
          ) : (
            aisles.map((aisle) => (
              <div key={aisle} className="mb-5">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-mango">
                  🛒 {aisle}
                </h3>
                <ul className="divide-y divide-cream-dark overflow-hidden rounded-2xl bg-white ring-1 ring-tomato/10">
                  {byAisle.get(aisle)!.map((ing, i) => (
                    <li key={i} className="flex items-baseline justify-between gap-4 px-4 py-2.5">
                      <span>{ing.name}</span>
                      <span className="shrink-0 text-sm font-bold text-ink-soft">
                        {[ing.quantity, ing.unit].filter(Boolean).join(" ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>

        {/* Instructions */}
        <section aria-label="Instructions">
          <h2 className="mb-4 font-display text-2xl font-black">Instructions</h2>
          {(!recipe.instructions || recipe.instructions.length === 0) ? (
            <p className="text-ink-soft">No steps listed yet.</p>
          ) : (
            <ol className="space-y-4">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-tomato/10 transition hover:ring-mango/40">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-tomato to-berry font-display text-base font-black text-white shadow-md shadow-tomato/30">
                    {i + 1}
                  </span>
                  <p className="leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <div className="flex justify-center pb-4">
        <Link
          href="/plan"
          className="rounded-full bg-gradient-to-r from-tomato to-berry px-8 py-3.5 font-display text-lg font-bold text-white shadow-xl shadow-tomato/30 transition hover:brightness-110 active:scale-[0.97]"
        >
          📅 Suggest this for the plan
        </Link>
      </div>
    </article>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 ring-1 ring-tomato/10">
      <span className="text-2xl">{icon}</span>
      <span>
        <span className="block text-xs font-bold uppercase tracking-wide text-ink-soft">{label}</span>
        <span className="block font-display text-lg font-black leading-none">{value}</span>
      </span>
    </div>
  );
}
