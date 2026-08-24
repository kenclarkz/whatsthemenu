import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/data";
import PlanBoard from "./PlanBoard";
import FinalizeControls from "./FinalizeControls";
import {
  addDays,
  formatRange,
  weekDates,
  weekStart as currentWeekStart,
} from "@/lib/utils";
import type { Recipe, Suggestion } from "@/lib/types";

export const metadata = { title: "Meal plan" };

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string; view?: string; error?: string }>;
}) {
  const { week, view = "weekly", error } = await searchParams;
  const { profile, family } = await getSession();
  const supabase = await createClient();

  const ws = week && /^\d{4}-\d{2}-\d{2}$/.test(week) ? week : currentWeekStart();
  const dayCount = view === "biweekly" ? 14 : 7;
  const days = weekDates(ws, dayCount);

  const [{ data: suggestions }, { data: plan }, { data: recipes }] =
    await Promise.all([
      supabase
        .from("suggestions")
        .select(
          `*,
           recipes(*),
           profiles(name, avatar_color),
           suggestion_votes(user_id)`,
        )
        .eq("week_start", ws)
        .returns<Suggestion[]>(),
      supabase
        .from("meal_plans")
        .select("finalized")
        .eq("week_start", ws)
        .maybeSingle(),
      supabase
        .from("recipes")
        .select("*")
        .order("title")
        .returns<Recipe[]>(),
    ]);

  const finalized = plan?.finalized ?? false;
  const all = suggestions ?? [];
  const prevWeek = addDays(ws, -7);
  const nextWeek = addDays(ws, 7);

  return (
    <div className="space-y-6">
      <header className="animate-fade-up space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-4xl font-black md:text-5xl">
              Meal <span className="text-gradient-warm">Plan</span>
            </h1>
            <p className="mt-1 text-ink-soft">
              {formatRange(ws, dayCount)} · {family?.name}
            </p>
          </div>
          <FinalizeControls
            weekStart={ws}
            finalized={finalized}
            isOrganizer={profile.is_organizer}
            hasSuggestions={all.length > 0}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/plan?week=${prevWeek}&view=${view}`}
            className="rounded-full bg-white px-4 py-2 text-sm font-bold ring-1 ring-tomato/15 transition hover:bg-cream-dark"
          >
            ← Prev
          </Link>
          <Link
            href={`/plan?view=${view}`}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              ws === currentWeekStart()
                ? "bg-ink text-white"
                : "bg-white ring-1 ring-tomato/15 hover:bg-cream-dark"
            }`}
          >
            This week
          </Link>
          <Link
            href={`/plan?week=${nextWeek}&view=${view}`}
            className="rounded-full bg-white px-4 py-2 text-sm font-bold ring-1 ring-tomato/15 transition hover:bg-cream-dark"
          >
            Next →
          </Link>

          <div className="ml-auto flex rounded-full bg-white p-1 text-sm font-bold ring-1 ring-tomato/10">
            {(["weekly", "biweekly"] as const).map((v) => (
              <Link
                key={v}
                href={`/plan?week=${ws}&view=${v}`}
                className={`rounded-full px-4 py-1.5 capitalize transition-all ${
                  view === v ? "bg-gradient-to-r from-tomato to-berry text-white shadow" : "text-ink-soft hover:text-ink"
                }`}
              >
                {v}
              </Link>
            ))}
          </div>
        </div>

        {finalized && (
          <p className="animate-pop rounded-2xl border border-basil/30 bg-basil/10 px-4 py-3 text-sm font-semibold text-basil">
            🔒 This week&apos;s menu is locked. Winners are shown in each slot — the
            grocery list has been generated on the{" "}
            <Link href="/grocery" className="underline underline-offset-2">grocery page</Link>.
          </p>
        )}
        {error === "vote" && (
          <p role="alert" className="rounded-2xl border border-tomato/30 bg-tomato/10 px-4 py-3 text-sm font-semibold text-tomato-dark">
            You can only vote once per suggestion.
          </p>
        )}
        {!finalized && (
          <p className="rounded-2xl bg-mango/10 px-4 py-3 text-sm font-semibold text-amber-700">
            🗳️ Suggest meals and vote ▲ — when the organizer finalizes, top votes win!
          </p>
        )}
      </header>

      {all.length === 0 ? (
        <EmptyPlan />
      ) : (
        <PlanBoard
          days={days}
          suggestions={all}
          recipes={recipes ?? []}
          familyId={family!.id}
          weekStart={ws}
          userId={profile.id}
          finalized={finalized}
        />
      )}
    </div>
  );
}

function EmptyPlan() {
  return (
    <div className="animate-fade-up rounded-3xl border border-dashed border-mango/50 bg-white/70 p-12 text-center">
      <div className="mb-4 text-6xl animate-floaty">📅</div>
      <h2 className="font-display text-2xl font-black">A blank menu awaits</h2>
      <p className="mx-auto mt-2 max-w-md text-ink-soft">
        No meal ideas for this stretch yet. Pick a day, hit{" "}
        <strong>+ Suggest a meal</strong>, and drop in a recipe from the
        cookbook — or your own wildcard idea.
      </p>
    </div>
  );
}
