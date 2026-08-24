"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleGroceryItem, regenerateGroceryList } from "@/lib/actions/plan";
import type { GroceryItem } from "@/lib/types";

const AISLE_ORDER = [
  "Produce", "Meat & Seafood", "Dairy", "Bakery",
  "Pantry", "Frozen", "Spices", "Other",
];

export default function GroceryChecklist({
  items,
  weekStart,
}: {
  items: GroceryItem[];
  weekStart: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(items.map((i) => [i.id, i.checked])),
  );
  const [confirming, setConfirming] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<string, GroceryItem[]>();
    for (const item of items) {
      const aisle = item.aisle || "Other";
      if (!map.has(aisle)) map.set(aisle, []);
      map.get(aisle)!.push(item);
    }
    return [...map.entries()].sort(
      (a, b) => AISLE_ORDER.indexOf(a[0]) - AISLE_ORDER.indexOf(b[0]),
    );
  }, [items]);

  const done = items.filter((i) => checked[i.id]).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  function toggle(item: GroceryItem) {
    setChecked((c) => ({ ...c, [item.id]: !c[item.id] }));
    startTransition(async () => {
      await toggleGroceryItem(item.id);
    });
  }

  function regenerate() {
    setConfirming(false);
    startTransition(async () => {
      await regenerateGroceryList(weekStart);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="animate-fade-up rounded-3xl bg-white p-5 ring-1 ring-tomato/10">
        <div className="mb-2 flex items-baseline justify-between">
          <p className="font-display text-lg font-black">
            {done} of {items.length} in the cart 🛒
          </p>
          <p className="text-sm font-bold tabular-nums text-tomato">{pct}%</p>
        </div>
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-3.5 overflow-hidden rounded-full bg-cream-dark"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-mango via-tomato to-berry transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <button
          onClick={() => setConfirming(true)}
          className="mt-4 rounded-full bg-cream px-5 py-2 text-sm font-bold text-tomato ring-1 ring-tomato/20 transition hover:bg-tomato hover:text-white"
        >
          ♻️ Rebuild from menu (merges duplicates)
        </button>
      </div>

      {/* Items by aisle */}
      <div className="grid gap-6 lg:grid-cols-2">
        {grouped.map(([aisle, aisleItems], gi) => (
          <section
            key={aisle}
            className="animate-fade-up rounded-3xl bg-white p-5 ring-1 ring-tomato/10"
            style={{ animationDelay: `${gi * 70}ms` }}
          >
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-black">
              <span>{aisleIcon(aisle)}</span> {aisle}
              <span className="ml-auto text-xs font-sans font-bold text-ink-soft tabular-nums">
                {aisleItems.filter((i) => checked[i.id]).length}/{aisleItems.length}
              </span>
            </h2>
            <ul className="divide-y divide-cream-dark">
              {aisleItems.map((item) => (
                <li key={item.id}>
                  <label
                    className={`flex cursor-pointer items-center gap-3 py-2.5 transition-all ${
                      checked[item.id] ? "opacity-50" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-xl border-2 text-sm transition-all duration-200 peer-checked:animate-pop peer-checked:border-basil peer-checked:bg-basil ${
                        checked[item.id] ? "border-basil bg-basil" : "border-tomato/30 bg-white"
                      }`}
                    >
                      {checked[item.id] ? (
                        <span className="text-white">✓</span>
                      ) : null}
                    </span>
                    <span
                      className={`flex-1 font-semibold transition-all ${
                        checked[item.id]
                          ? "line-through decoration-tomato/60 decoration-2"
                          : ""
                      }`}
                    >
                      {item.name}
                    </span>
                    {(item.quantity || item.unit) && (
                      <span className="shrink-0 text-sm font-bold text-ink-soft tabular-nums">
                        {[item.quantity, item.unit].filter(Boolean).join(" ")}
                      </span>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {pct === 100 && (
        <p className="animate-pop rounded-3xl border border-basil/30 bg-basil/10 px-5 py-4 text-center font-display text-lg font-black text-basil">
          🎉 Everything&apos;s in the cart — see you at checkout!
        </p>
      )}

      {confirming && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setConfirming(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm animate-fade-up rounded-3xl bg-white p-7 text-center shadow-2xl"
          >
            <div className="mb-3 text-5xl">♻️</div>
            <h3 className="font-display text-xl font-black">Rebuild the list?</h3>
            <p className="mt-2 text-sm text-ink-soft">
              We&apos;ll re-scan every finalized recipe for this week and merge
              duplicates. Checked-off items stay checked if they&apos;re still on the list.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setConfirming(false)}
                className="rounded-full bg-cream px-6 py-2.5 text-sm font-bold text-ink-soft transition hover:bg-cream-dark"
              >
                Cancel
              </button>
              <button
                onClick={regenerate}
                className="rounded-full bg-gradient-to-r from-tomato to-berry px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-tomato/30 transition hover:brightness-110"
              >
                Rebuild it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function aisleIcon(aisle: string): string {
  const map: Record<string, string> = {
    Produce: "🥦",
    "Meat & Seafood": "🥩",
    Dairy: "🧀",
    Bakery: "🥖",
    Pantry: "🥫",
    Frozen: "🧊",
    Spices: "🌶️",
    Other: "🧺",
  };
  return map[aisle] ?? "🧺";
}
