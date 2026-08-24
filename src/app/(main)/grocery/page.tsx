import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import GroceryChecklist from "./GroceryChecklist";
import { formatRange, weekStart as currentWeekStart } from "@/lib/utils";
import type { GroceryItem } from "@/lib/types";

export const metadata = { title: "Grocery list" };

export default async function GroceryPage() {
  const supabase = await createClient();

  // Latest week that actually has a list (falls back to this week).
  const [{ data: latest }, { data: items }] = await Promise.all([
    supabase
      .from("grocery_items")
      .select("week_start")
      .order("week_start", { ascending: false })
      .limit(1)
      .maybeSingle<{ week_start: string }>(),
    supabase.from("grocery_items").select("*").returns<GroceryItem[]>(),
  ]);

  const ws = latest?.week_start ?? currentWeekStart();

  if (!items || items.length === 0) {
    return (
      <div className="space-y-6">
        <Header />
        <div className="animate-fade-up rounded-3xl border border-dashed border-mango/50 bg-white/70 p-12 text-center">
          <div className="mb-4 text-6xl animate-floaty">🛒</div>
          <h2 className="font-display text-2xl font-black">Your cart is empty</h2>
          <p className="mx-auto mt-2 max-w-md text-ink-soft">
            Finalize a meal plan and the grocery list writes itself — every
            ingredient from every winning recipe, duplicates merged.
          </p>
          <Link
            href="/plan"
            className="mt-6 inline-block rounded-full bg-gradient-to-r from-tomato to-berry px-8 py-3 font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110"
          >
            Go to the meal plan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header subtitle={`Week of ${formatRange(ws)} · auto-built from finalized recipes`} />
      <GroceryChecklist items={items} weekStart={ws} />
    </div>
  );
}

function Header({ subtitle }: { subtitle?: string }) {
  return (
    <header className="animate-fade-up">
      <h1 className="font-display text-4xl font-black md:text-5xl">
        Grocery <span className="text-gradient-warm">List</span>
      </h1>
      <p className="mt-1 text-ink-soft">
        {subtitle ?? "One trip, zero forgotten ingredients."}
      </p>
    </header>
  );
}
