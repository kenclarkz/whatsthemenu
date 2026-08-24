"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FoodImage from "@/components/FoodImage";
import { suggestMeal, vote, removeSuggestion } from "@/lib/actions/plan";
import type { Recipe, Suggestion, MealType } from "@/lib/types";

const MEAL_META: Record<MealType, { icon: string; label: string }> = {
  breakfast: { icon: "🌅", label: "Breakfast" },
  lunch: { icon: "☀️", label: "Lunch" },
  dinner: { icon: "🌙", label: "Dinner" },
};

export default function PlanBoard({
  days,
  suggestions,
  recipes,
  familyId,
  weekStart,
  userId,
  finalized,
}: {
  days: string[];
  suggestions: Suggestion[];
  recipes: Recipe[];
  familyId: string;
  weekStart: string;
  userId: string;
  finalized: boolean;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {days.map((day, di) => (
        <DayCard
          key={day}
          day={day}
          index={di}
          slots={suggestions.filter((s) => s.meal_date === day)}
          recipes={recipes}
          familyId={familyId}
          weekStart={weekStart}
          userId={userId}
          finalized={finalized}
        />
      ))}
    </div>
  );
}

function DayCard({
  day,
  index,
  slots,
  recipes,
  familyId,
  weekStart,
  userId,
  finalized,
}: {
  day: string;
  index: number;
  slots: Suggestion[];
  recipes: Recipe[];
  familyId: string;
  weekStart: string;
  userId: string;
  finalized: boolean;
}) {
  const [openSlot, setOpenSlot] = useState<MealType | null>(null);
  const d = new Date(`${day}T00:00:00`);
  const isToday = new Date().toDateString() === d.toDateString();
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  const dateLabel = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const grouped = useMemo(
    () =>
      (["breakfast", "lunch", "dinner"] as MealType[]).map((mt) => ({
        mealType: mt,
        items: slots
          .filter((s) => s.meal_type === mt)
          .sort(
            (a, b) =>
              b.suggestion_votes.length - a.suggestion_votes.length ||
              a.created_at.localeCompare(b.created_at),
          ),
      })),
    [slots],
  );

  return (
    <section
      className={`animate-fade-up rounded-3xl bg-white p-4 ring-1 transition-shadow ${
        isToday ? "ring-2 ring-mango shadow-xl shadow-mango/20" : "ring-tomato/10"
      }`}
      style={{ animationDelay: `${Math.min(index * 60, 420)}ms` }}
    >
      <header className="mb-3 flex items-baseline justify-between px-1">
        <h2 className="font-display text-lg font-black">
          {weekday}{" "}
          {isToday && (
            <span className="ml-1 rounded-full bg-mango/25 px-2 py-0.5 align-middle text-[10px] font-sans font-bold uppercase tracking-wider text-amber-700">
              Today
            </span>
          )}
        </h2>
        <span className="text-xs font-bold text-ink-soft">{dateLabel}</span>
      </header>

      <div className="space-y-2">
        {grouped.map(({ mealType, items }) => (
          <div key={mealType}>
            <p className="px-1 pb-1 text-[11px] font-bold uppercase tracking-widest text-ink-soft">
              {MEAL_META[mealType].icon} {MEAL_META[mealType].label}
            </p>

            {items.map((s) => (
              <SuggestionRow
                key={s.id}
                s={s}
                userId={userId}
                finalized={finalized}
              />
            ))}

            {!finalized && openSlot !== mealType && (
              <button
                onClick={() => setOpenSlot(mealType)}
                className="w-full rounded-2xl border border-dashed border-mango/60 py-2 text-sm font-bold text-mango transition hover:border-mango hover:bg-mango/10 hover:text-amber-600"
              >
                + Suggest a meal
              </button>
            )}
            {openSlot === mealType && (
              <SuggestForm
                day={day}
                mealType={mealType}
                recipes={recipes}
                familyId={familyId}
                weekStart={weekStart}
                onDone={() => setOpenSlot(null)}
                onCancel={() => setOpenSlot(null)}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function SuggestionRow({
  s,
  userId,
  finalized,
}: {
  s: Suggestion;
  userId: string;
  finalized: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const voted = s.suggestion_votes.some((v) => v.user_id === userId);

  function toggleVote() {
    startTransition(async () => {
      await vote(s.id);
      router.refresh();
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await removeSuggestion(s.id);
      router.refresh();
    });
  }

  return (
    <div
      className={`mb-1.5 flex overflow-hidden rounded-2xl ring-1 transition-all ${
        voted ? "bg-tomato/[0.06] ring-tomato/30" : "bg-cream/60 ring-tomato/10"
      }`}
    >
      <Link href={s.recipe_id ? `/recipes/${s.recipe_id}` : "#"} className="relative h-16 w-16 shrink-0">
        <FoodImage
          src={s.recipes?.image_url}
          alt={s.custom_title ?? s.recipes?.title ?? "Meal"}
          category={s.recipes?.category}
          sizes="64px"
          className="h-full w-full"
        />
      </Link>
      <div className="min-w-0 flex-1 px-3 py-1.5">
        <p className="truncate text-sm font-bold leading-tight">
          {s.custom_title ?? s.recipes?.title ?? "Custom idea"}
        </p>
        <p className="truncate text-xs text-ink-soft">
          by {s.profiles?.name ?? "someone"}
          {s.note ? ` · “${s.note}”` : ""}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1 pr-2">
        {!finalized && (
          <>
            <button
              onClick={toggleVote}
              disabled={pending}
              aria-label={voted ? "Remove vote" : "Vote"}
              aria-pressed={voted}
              className={`rounded-full px-2 py-1 text-xs font-bold tabular-nums transition-all ${
                voted
                  ? "animate-pop bg-gradient-to-r from-tomato to-berry text-white shadow-md shadow-tomato/30"
                  : "bg-white ring-1 ring-tomato/15 hover:bg-tomato/10"
              } ${pending ? "opacity-70" : ""}`}
            >
              ▲ {s.suggestion_votes.length}
            </button>
            {s.suggested_by === userId && (
              <button
                onClick={handleRemove}
                disabled={pending}
                aria-label="Remove suggestion"
                className="grid h-6 w-6 place-items-center rounded-full text-xs text-ink-soft transition hover:bg-tomato/10 hover:text-tomato"
              >
                ×
              </button>
            )}
          </>
        )}
        {finalized && (
          <span className="rounded-full bg-basil/15 px-2 py-0.5 text-[11px] font-bold text-basil">
            ✓ Winner
          </span>
        )}
      </div>
    </div>
  );
}

function SuggestForm({
  day,
  mealType,
  recipes,
  familyId,
  weekStart,
  onDone,
  onCancel,
}: {
  day: string;
  mealType: MealType;
  recipes: Recipe[];
  familyId: string;
  weekStart: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"recipe" | "idea">("recipe");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return recipes.slice(0, 8);
    return recipes
      .filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [recipes, search]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("familyId", familyId);
    fd.set("weekStart", weekStart);
    fd.set("mealDate", day);
    fd.set("mealType", mealType);
    fd.set("recipeId", mode === "recipe" ? (selected ?? "") : "");
    startTransition(async () => {
      await suggestMeal(fd);
      onDone();
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={submit}
      className="animate-fade-up mb-2 space-y-2.5 rounded-2xl border border-mango/40 bg-mango/5 p-3"
    >
      <div className="flex gap-1 rounded-full bg-white p-1 text-xs font-bold ring-1 ring-tomato/10">
        {(["recipe", "idea"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 rounded-full py-1.5 transition-all ${
              mode === m ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            {m === "recipe" ? "🍳 From cookbook" : "💡 Custom idea"}
          </button>
        ))}
      </div>

      {mode === "recipe" ? (
        <>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes…"
            aria-label="Search recipes"
            className="w-full rounded-xl border border-cream-dark bg-white px-3 py-2 text-sm outline-none focus:border-mango"
          />
          <ul className="max-h-52 space-y-1 overflow-y-auto">
            {filtered.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => setSelected(r.id === selected ? null : r.id)}
                  aria-pressed={r.id === selected}
                  className={`flex w-full items-center gap-2.5 rounded-xl p-1.5 text-left transition ${
                    r.id === selected ? "bg-tomato/10 ring-1 ring-tomato" : "hover:bg-white"
                  }`}
                >
                  <span className="h-9 w-9 shrink-0 overflow-hidden rounded-lg">
                    <FoodImage src={r.image_url} alt="" category={r.category} sizes="36px" className="h-full w-full" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">{r.title}</span>
                  {r.id === selected && <span className="text-sm">✅</span>}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="py-3 text-center text-xs text-ink-soft">No matches — try an idea instead.</li>
            )}
          </ul>
        </>
      ) : (
        <input
          name="customTitle"
          placeholder="e.g. Leftover pizza night 🍕"
          required
          className="w-full rounded-xl border border-cream-dark bg-white px-3 py-2 text-sm outline-none focus:border-mango"
        />
      )}

      <input name="note" placeholder="Note (optional)" maxLength={80} className="w-full rounded-xl border border-cream-dark bg-white px-3 py-2 text-xs outline-none focus:border-mango" />

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-full px-4 py-1.5 text-xs font-bold text-ink-soft hover:bg-white">
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending || (mode === "recipe" && !selected)}
          className="rounded-full bg-gradient-to-r from-tomato to-berry px-5 py-1.5 text-xs font-bold text-white shadow-md shadow-tomato/30 transition hover:brightness-110 disabled:opacity-50"
        >
          {pending ? "Adding…" : "Add suggestion"}
        </button>
      </div>
    </form>
  );
}
