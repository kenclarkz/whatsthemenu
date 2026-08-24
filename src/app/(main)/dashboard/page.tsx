import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/data";
import FoodImage from "@/components/FoodImage";
import {
  addDays,
  dayName,
  isToday,
  toISODate,
  weekDates,
  weekStart as currentWeekStart,
} from "@/lib/utils";
import type { PlanEntry, Recipe, Suggestion } from "@/lib/types";

export const metadata = { title: "Dashboard" };

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Late-night snack run";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const { profile, family } = await getSession();
  const supabase = await createClient();

  const ws = currentWeekStart();
  const todayISO = toISODate(new Date());

  const [{ data: entries }, { data: pendingVotes }, { data: favs }, { data: recent }] =
    await Promise.all([
      supabase
        .from("meal_plan_entries")
        .select("*")
        .gte("week_start", ws)
        .lte("week_start", addDays(ws, 6))
        .order("meal_date")
        .returns<PlanEntry[]>(),
      supabase
        .from("suggestions")
        .select(
          `*, recipes(*), profiles(name),
           suggestion_votes!left(user_id)`,
        )
        .eq("week_start", ws)
        .neq("suggested_by", profile.id)
        .limit(12)
        .returns<Suggestion[]>(),
      supabase
        .from("favorites")
        .select("recipe_id")
        .eq("user_id", profile.id),
      supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6)
        .returns<Recipe[]>(),
    ]);

  const [{ data: plan }, { count: memberCount }] = await Promise.all([
    supabase.from("meal_plans").select("finalized").eq("week_start", ws).maybeSingle(),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("family_id", family!.id),
  ]);

  // Recipes for today's entries (for imagery).
  const recipeIds = (entries ?? [])
    .filter((e) => e.meal_date === todayISO && e.recipe_id)
    .map((e) => e.recipe_id!) as string[];
  const { data: todayRecipes } = recipeIds.length
    ? await supabase.from("recipes").select("*").in("id", recipeIds).returns<Recipe[]>()
    : { data: [] };
  const byId = new Map((todayRecipes ?? []).map((r) => [r.id, r]));

  const votedSuggestionIds = new Set(
    (pendingVotes ?? []).flatMap((s) =>
      s.suggestion_votes.some((v) => v.user_id === profile.id) ? [s.id] : [],
    ),
  );
  const needsVote = (pendingVotes ?? []).filter(
    (s) => !votedSuggestionIds.has(s.id) && s.suggestion_votes.length === 0,
  );
  const favSet = new Set((favs ?? []).map((f) => f.recipe_id));

  const todayEntries = (entries ?? []).filter((e) => e.meal_date === todayISO);
  const plannedCount = (entries ?? []).length;

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <header className="animate-fade-up flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-mango">
            {family?.name}
          </p>
          <h1 className="font-display text-3xl font-black md:text-5xl">
            {greeting()}, <span className="text-gradient-warm">{profile.name.split(" ")[0]}</span> 👋
          </h1>
        </div>
        <Link href="/settings" className="md:hidden">
          <span
            className="grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-white ring-2 ring-white shadow"
            style={{ backgroundColor: profile.avatar_color }}
          >
            {profile.name.slice(0, 1).toUpperCase()}
          </span>
        </Link>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 animate-fade-up" style={{ animationDelay: "60ms" }}>
        <StatCard icon="🍽️" value={plannedCount} label={plannedCount === 1 ? "meal planned" : "meals planned"} href="/plan" />
        <StatCard icon="🗳️" value={needsVote.length} label={needsVote.length === 1 ? "needs your vote" : "need your votes"} href="/plan" />
        <StatCard icon="❤️" value={favSet.size} label={favSet.size === 1 ? "favorite" : "favorites"} href="/favorites" />
        <StatCard icon="👨‍👩‍👧" value={memberCount ?? 1} label={(memberCount ?? 1) === 1 ? "member" : "members"} href="/settings" />
      </section>

      {/* Today's menu hero */}
      <section aria-label="Today's menu" className="animate-fade-up" style={{ animationDelay: "120ms" }}>
        <h2 className="mb-3 font-display text-2xl font-black">
          Today&apos;s table 🍯{" "}
          <span className="ml-1 align-middle text-xs font-sans font-bold uppercase tracking-wider text-ink-soft">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </span>
        </h2>
        {todayEntries.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-mango/50 bg-white/70 p-10 text-center">
            <div className="mb-3 text-5xl">🍳</div>
            <p className="font-display text-xl font-black">Nothing on the menu today</p>
            <p className="mt-1 text-ink-soft">Maybe leftovers night? Check the plan.</p>
            <Link href="/plan" className="mt-4 inline-block rounded-full bg-gradient-to-r from-tomato to-berry px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110">
              Open the plan →
            </Link>
          </div>
        ) : (
          <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:px-0">
            {todayEntries.map((e, i) => {
              const r = e.recipe_id ? byId.get(e.recipe_id) : null;
              const icon = e.meal_type === "breakfast" ? "🌅" : e.meal_type === "lunch" ? "☀️" : "🌙";
              return (
                <article
                  key={e.id}
                  className={`relative min-w-[85%] snap-center overflow-hidden rounded-3xl shadow-xl shadow-tomato/15 ring-1 ring-tomato/10 transition-transform duration-300 hover:-translate-y-1 sm:min-w-[55%] lg:min-w-0 ${
                    i === 0 ? "" : ""
                  }`}
                >
                  <Link href={r ? `/recipes/${r.id}` : "/plan"}>
                    <div className="relative aspect-[16/9]">
                      <FoodImage src={r?.image_url} alt={r?.title ?? e.custom_title ?? "Meal"} category={r?.category} sizes="(min-width:1024px) 33vw, 85vw" priority={i === 0} className="absolute inset-0 h-full w-full" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-bold backdrop-blur">
                        {icon} {e.meal_type}
                      </span>
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <h3 className="font-display text-xl font-black leading-tight text-white drop-shadow-lg">
                          {r?.title ?? e.custom_title ?? "Family choice"}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Needs your vote */}
      {needsVote.length > 0 && (
        <section aria-label="Needs your vote" className="animate-fade-up" style={{ animationDelay: "180ms" }}>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-black">Needs your vote 🗳️</h2>
            <Link href="/plan" className="text-sm font-bold text-tomato hover:underline">See all →</Link>
          </div>
          <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
            {needsVote.map((s) => (
              <Link
                key={s.id}
                href="/plan"
                className="group w-44 shrink-0 overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-tomato/10 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-square">
                  <FoodImage src={s.recipes?.image_url} alt={s.custom_title ?? s.recipes?.title ?? ""} category={s.recipes?.category} sizes="176px" className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-bold">{s.custom_title ?? s.recipes?.title}</p>
                  <p className="text-xs capitalize text-mango">
                    {dayName(s.meal_date)} · {s.meal_type}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Week at a glance */}
      <section aria-label="Week at a glance" className="animate-fade-up" style={{ animationDelay: "240ms" }}>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-black">Week at a glance</h2>
          <Link href="/plan" className="text-sm font-bold text-tomato hover:underline">Open plan →</Link>
        </div>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-7 md:px-0">
          {weekDates(ws).map((d) => {
            const dayEntries = (entries ?? []).filter((e) => e.meal_date === d);
            return (
              <Link
                key={d}
                href="/plan"
                className={`w-32 shrink-0 rounded-3xl p-3.5 ring-1 transition hover:-translate-y-0.5 ${
                  isToday(d)
                    ? "bg-gradient-to-br from-tomato to-berry text-white shadow-lg shadow-tomato/30 ring-transparent"
                    : "bg-white ring-tomato/10"
                }`}
              >
                <p className={`text-xs font-bold uppercase tracking-widest ${isToday(d) ? "text-white/80" : "text-ink-soft"}`}>
                  {dayName(d)}
                </p>
                <p className={`font-display text-xl font-black ${isToday(d) ? "" : ""}`}>
                  {new Date(`${d}T00:00:00`).getDate()}
                </p>
                {dayEntries.length === 0 ? (
                  <p className={`mt-2 text-xs ${isToday(d) ? "text-white/70" : "text-ink-soft/70"}`}>
                    open slot ✨
                  </p>
                ) : (
                  <ul className={`mt-2 space-y-1 text-[11px] font-semibold leading-snug ${isToday(d) ? "text-white/95" : ""}`}>
                    {dayEntries.map((e) => {
                      const r = e.recipe_id ? byId.get(e.recipe_id) : null;
                      return (
                        <li key={e.id} className="flex items-start gap-1">
                          <span>{e.meal_type === "breakfast" ? "🌅" : e.meal_type === "lunch" ? "☀️" : "🌙"}</span>
                          <span className="line-clamp-2">{r?.title ?? e.custom_title}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Status + recent recipes */}
      <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div
          className={`animate-fade-up rounded-3xl p-6 text-white shadow-xl ${plan?.finalized ? "bg-gradient-to-br from-basil to-emerald-700 shadow-basil/30" : "bg-gradient-to-br from-mango to-orange-600 shadow-mango/30"}`}
          style={{ animationDelay: "300ms" }}
        >
          {plan?.finalized ? (
            <>
              <p className="text-4xl">✅</p>
              <h2 className="mt-2 font-display text-2xl font-black">This week is locked in!</h2>
              <p className="mt-1 text-white/90">The grocery list is ready and merged.</p>
              <Link href="/grocery" className="mt-4 inline-block rounded-full bg-white/20 px-5 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/30">
                Open grocery list →
              </Link>
            </>
          ) : (
            <>
              <p className="text-4xl">🗳️</p>
              <h2 className="mt-2 font-display text-2xl font-black">Voting is open</h2>
              <p className="mt-1 text-white/90">
                {profile.is_organizer
                  ? "When you're ready, finalize the menu to lock the winners."
                  : `${family?.name}'s organizer will lock in the top-voted meals.`}
              </p>
              <Link href="/plan" className="mt-4 inline-block rounded-full bg-white/20 px-5 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/30">
                Cast your votes →
              </Link>
            </>
          )}
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "340ms" }}>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-black">Fresh from the kitchen</h2>
            <Link href="/recipes" className="text-sm font-bold text-tomato hover:underline">All recipes →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {(recent ?? []).slice(0, 3).map((r) => (
              <Link key={r.id} href={`/recipes/${r.id}`} className="group overflow-hidden rounded-3xl bg-white ring-1 ring-tomato/10 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="aspect-[4/3] relative">
                  <FoodImage src={r.image_url} alt={r.title} category={r.category} sizes="(min-width:640px) 25vw, 40vw" className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105" />
                </div>
                <p className="line-clamp-1 px-3 py-2 text-sm font-bold">{r.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  href,
}: {
  icon: string;
  value: number | string;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl bg-white p-4 ring-1 ring-tomato/10 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-tomato/10"
    >
      <p className="text-2xl">{icon}</p>
      <p className="font-display text-3xl font-black tabular-nums">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wide text-ink-soft group-hover:text-tomato">
        {label}
      </p>
    </Link>
  );
}
