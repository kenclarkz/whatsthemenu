import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/data";
import RecipeCard from "@/components/RecipeCard";
import FoodImage from "@/components/FoodImage";
import CookAgainButton from "./CookAgainButton";
import { formatRange } from "@/lib/utils";
import type { PlanEntry, Recipe } from "@/lib/types";

export const metadata = { title: "Favorites & history" };

export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const tab = (await searchParams).tab === "history" ? "history" : "faves";
  const { profile, family } = await getSession();
  const supabase = await createClient();

  const [{ data: favIds }, { data: pastPlans }] = await Promise.all([
    supabase
      .from("favorites")
      .select("recipe_id")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("meal_plan_entries")
      .select("*")
      .lt("week_start", new Date().toISOString().slice(0, 10))
      .order("week_start", { ascending: false })
      .returns<PlanEntry[]>(),
  ]);

  const favRecipeIds = (favIds ?? []).map((f) => f.recipe_id);
  const [{ data: favRecipes }, { data: entryRecipes }] = await Promise.all([
    favRecipeIds.length
      ? supabase.from("recipes").select("*").in("id", favRecipeIds).returns<Recipe[]>()
      : Promise.resolve({ data: [] as Recipe[] | null }),
    supabase.from("recipes").select("*").limit(500).returns<Recipe[]>(),
  ]);

  // Order favorites by most-recently-favorited.
  const order = new Map(favRecipeIds.map((id, i) => [id, i]));
  const favorites = [...(favRecipes ?? [])].sort(
    (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
  );

  const allRecipes = new Map((entryRecipes ?? []).map((r) => [r.id, r]));

  // Group past entries by week.
  const weeks = new Map<string, PlanEntry[]>();
  for (const e of pastPlans ?? []) {
    if (!weeks.has(e.week_start)) weeks.set(e.week_start, []);
    weeks.get(e.week_start)!.push(e);
  }
  const weekList = [...weeks.entries()].sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div className="space-y-6">
      <header className="animate-fade-up">
        <h1 className="font-display text-4xl font-black md:text-5xl">
          Greatest <span className="text-gradient-warm">hits</span>
        </h1>
        <p className="mt-1 text-ink-soft">
          The dishes {family?.name} keeps coming back to — and the weeks we
          cooked them.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex w-fit rounded-full bg-white p-1 font-bold ring-1 ring-tomato/10 animate-fade-up">
        <Link
          href="/favorites"
          aria-current={tab === "faves" ? "page" : undefined}
          className={`rounded-full px-6 py-2 text-sm transition-all ${
            tab === "faves"
              ? "bg-gradient-to-r from-berry to-tomato text-white shadow-md shadow-tomato/30"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          ❤️ Favorites ({favorites.length})
        </Link>
        <Link
          href="/favorites?tab=history"
          aria-current={tab === "history" ? "page" : undefined}
          className={`rounded-full px-6 py-2 text-sm transition-all ${
            tab === "history"
              ? "bg-gradient-to-r from-berry to-tomato text-white shadow-md shadow-tomato/30"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          📜 History ({weekList.length})
        </Link>
      </div>

      {tab === "faves" ? (
        favorites.length === 0 ? (
          <EmptyBlock
            emoji="🤍"
            title="No favorites yet"
            body="Tap the heart on any recipe to keep it close. Your greatest hits live here."
            cta="Browse recipes"
            href="/recipes"
          />
        ) : (
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((r, i) => (
              <RecipeCard key={r.id} recipe={r} favorited index={i} />
            ))}
          </section>
        )
      ) : weekList.length === 0 ? (
        <EmptyBlock
          emoji="📜"
          title="No history yet"
          body="Once a menu is finalized and the week wraps up, it lands here as a delicious memory."
          cta="Plan this week"
          href="/plan"
        />
      ) : (
        <div className="space-y-8">
          {weekList.map(([ws, entries]) => (
            <section key={ws} className="animate-fade-up rounded-3xl bg-white p-5 ring-1 ring-tomato/10 md:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-display text-xl font-black">
                    Week of {formatRange(ws)}
                  </h2>
                  <p className="text-xs font-bold uppercase tracking-widest text-mango">
                    {entries.length} meals cooked 🍽️
                  </p>
                </div>
                {entries[0]?.recipe_id && (
                  <CookAgainButton recipeId={entries[0].recipe_id} />
                )}
              </div>
              <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
                {entries.map((e) => {
                  const r = e.recipe_id ? allRecipes.get(e.recipe_id) : null;
                  return (
                    <Link
                      key={e.id}
                      href={r ? `/recipes/${r.id}` : "/plan"}
                      className="group relative w-36 shrink-0 overflow-hidden rounded-2xl ring-1 ring-tomato/10 transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="aspect-[3/4] relative">
                        <FoodImage src={r?.image_url} alt={r?.title ?? e.custom_title ?? ""} category={r?.category} sizes="144px" className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-white/75">
                            {e.meal_type}
                          </p>
                          <p className="line-clamp-2 text-xs font-bold leading-snug text-white drop-shadow">
                            {r?.title ?? e.custom_title}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyBlock({
  emoji,
  title,
  body,
  cta,
  href,
}: {
  emoji: string;
  title: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="animate-fade-up rounded-3xl border border-dashed border-mango/50 bg-white/70 p-12 text-center">
      <div className="mb-4 text-6xl">{emoji}</div>
      <h2 className="font-display text-2xl font-black">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-ink-soft">{body}</p>
      <Link
        href={href}
        className="mt-6 inline-block rounded-full bg-gradient-to-r from-tomato to-berry px-8 py-3 font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110"
      >
        {cta}
      </Link>
    </div>
  );
}
