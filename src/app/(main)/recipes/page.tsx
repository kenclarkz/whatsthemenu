import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import RecipeCard from "@/components/RecipeCard";
import { CATEGORIES, type Recipe } from "@/lib/types";

export const metadata = { title: "Recipes" };

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const { q = "", category = "", sort = "newest" } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: sort !== "title" })
    .order(sort === "title" ? "title" : "id", { ascending: true });

  if (q) query = query.ilike("title", `%${q}%`);
  if (category) query = query.eq("category", category);

  const [{ data: recipes }, { data: favs }] = await Promise.all([
    query.returns<Recipe[]>(),
    supabase.from("favorites").select("recipe_id"),
  ]);

  const favSet = new Set((favs ?? []).map((f) => f.recipe_id));
  const sorted =
    sort === "title"
      ? [...(recipes ?? [])].sort((a, b) => a.title.localeCompare(b.title))
      : recipes ?? [];

  const chips = [
    { value: "", label: "All" },
    ...CATEGORIES.map((c) => ({ value: c, label: c })),
  ];

  return (
    <div className="space-y-6">
      <header className="animate-fade-up">
        <h1 className="font-display text-4xl font-black md:text-5xl">
          The <span className="text-gradient-warm">Recipe Box</span> 🍳
        </h1>
        <p className="mt-1 text-ink-soft">
          Browse the family cookbook and find tonight&apos;s winner.
        </p>
      </header>

      <div className="flex flex-col gap-3 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <div className="flex gap-3">
          <form action="/recipes" className="relative flex-1">
            {category && (
              <input type="hidden" name="category" value={category} />
            )}
            <input
              name="q"
              defaultValue={q}
              placeholder="Search recipes…"
              className="w-full rounded-full border border-tomato/15 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-mango focus:ring-4 focus:ring-mango/20"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              🔍
            </span>
          </form>
          <Link
            href="/recipes/new"
            className="flex shrink-0 items-center rounded-full bg-gradient-to-r from-tomato to-berry px-5 font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110 active:scale-[0.97]"
          >
            + Add recipe
          </Link>
        </div>

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {chips.map((chip) => {
            const active = category === chip.value;
            const href = `/recipes?${[...(q ? [["q", q]] : []), ...(chip.value ? [["category", chip.value]] : [])].map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&")}`;
            return (
              <Link
                key={chip.label}
                href={href}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
                  active
                    ? "bg-ink text-white"
                    : "bg-white text-ink-soft ring-1 ring-tomato/10 hover:bg-cream-dark hover:text-ink"
                }`}
              >
                {chip.label}
              </Link>
            );
          })}
          <Link
            href={`/recipes${q ? `?q=${encodeURIComponent(q)}` : ""}&sort=title`}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
              sort === "title"
                ? "bg-ink text-white"
                : "bg-white text-ink-soft ring-1 ring-tomato/10 hover:bg-cream-dark hover:text-ink"
            }`}
          >
            A → Z
          </Link>
        </div>
      </div>

      {sorted.length === 0 ? (
        <EmptyState q={q} />
      ) : (
        <section
          aria-label="Recipe results"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {sorted.map((r, i) => (
            <RecipeCard key={r.id} recipe={r} favorited={favSet.has(r.id)} index={i} />
          ))}
        </section>
      )}
    </div>
  );
}

function EmptyState({ q }: { q: string }) {
  return (
    <div className="animate-fade-up rounded-3xl border border-dashed border-mango/50 bg-white/70 p-12 text-center">
      <div className="mb-4 text-6xl">🥄</div>
      <h2 className="font-display text-2xl font-black">
        No recipes {q ? `matching “${q}”` : "here yet"}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-ink-soft">
        {q
          ? "Try a different search — or add the dish yourself!"
          : "Be the family hero and add your first recipe."}
      </p>
      <Link
        href="/recipes/new"
        className="mt-6 inline-block rounded-full bg-gradient-to-r from-tomato to-berry px-8 py-3 font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110"
      >
        Add a recipe
      </Link>
    </div>
  );
}
