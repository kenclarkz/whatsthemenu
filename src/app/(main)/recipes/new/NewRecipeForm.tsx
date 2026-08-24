"use client";

import { useState } from "react";
import { createRecipe as create } from "@/lib/actions/recipes";
import FoodImage from "@/components/FoodImage";
import { CATEGORIES, AISLES } from "@/lib/types";

const GALLERY = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1200&q=80",
];

interface Row {
  name: string;
  quantity: string;
  unit: string;
  aisle: string;
}

export default function NewRecipeForm({ error }: { error?: string }) {
  const [rows, setRows] = useState<Row[]>([
    { name: "", quantity: "", unit: "", aisle: "Produce" },
  ]);
  const [imageUrl, setImageUrl] = useState<string>("");

  function updateRow(i: number, patch: Partial<Row>) {
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  return (
    <form action={create} className="space-y-8">
      {error && (
        <p role="alert" className="animate-pop rounded-2xl border border-tomato/30 bg-tomato/10 px-4 py-3 text-sm font-semibold text-tomato-dark">
          {error === "title"
            ? "A title is required."
            : error === "save"
              ? "Could not save — check your inputs and try again."
              : "Something went wrong."}
        </p>
      )}

      {/* Basics */}
      <section className="rounded-3xl bg-white p-6 ring-1 ring-tomato/10 md:p-8">
        <h2 className="mb-5 font-display text-xl font-black">The basics</h2>
        <div className="grid gap-4">
          <Field label="Recipe name" htmlFor="title">
            <input id="title" name="title" required placeholder="Grandma's Lasagna" className={inputCls} />
          </Field>
          <Field label="Description" htmlFor="description" hint="One tasty sentence.">
            <input id="description" name="description" placeholder="Layered with love and lots of cheese…" className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field label="Category" htmlFor="category">
              <select id="category" name="category" className={inputCls} defaultValue="Comfort Food">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Servings" htmlFor="servings">
              <input id="servings" name="servings" type="number" min={1} defaultValue={4} className={inputCls} />
            </Field>
            <Field label="Prep (min)" htmlFor="prep_minutes">
              <input id="prep_minutes" name="prep_minutes" type="number" min={0} placeholder="15" className={inputCls} />
            </Field>
            <Field label="Cook (min)" htmlFor="cook_minutes">
              <input id="cook_minutes" name="cook_minutes" type="number" min={0} placeholder="45" className={inputCls} />
            </Field>
          </div>
        </div>
      </section>

      {/* Photo */}
      <section className="rounded-3xl bg-white p-6 ring-1 ring-tomato/10 md:p-8">
        <h2 className="mb-1 font-display text-xl font-black">Photo 📸</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Pick from our gallery or paste your own image link.
        </p>
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://…"
          aria-label="Photo URL"
          className={`${inputCls} mb-4`}
        />
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {GALLERY.map((url) => (
            <button
              type="button"
              key={url}
              onClick={() => setImageUrl(url)}
              aria-label="Pick photo"
              aria-pressed={imageUrl === url}
              className={`relative aspect-square overflow-hidden rounded-2xl transition-all ${
                imageUrl === url
                  ? "scale-95 ring-4 ring-tomato"
                  : "ring-1 ring-tomato/10 hover:scale-105 hover:ring-mango"
              }`}
            >
              <FoodImage src={url} alt="Option" category="" className="h-full w-full" />
              {imageUrl === url && (
                <span className="absolute inset-0 grid place-items-center text-2xl drop-shadow">✅</span>
              )}
            </button>
          ))}
        </div>
        <input type="hidden" name="image_url" value={imageUrl} />
      </section>

      {/* Ingredients */}
      <section className="rounded-3xl bg-white p-6 ring-1 ring-tomato/10 md:p-8">
        <h2 className="mb-5 font-display text-xl font-black">Ingredients</h2>
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_5rem_5rem_9rem_2rem] items-center gap-2 sm:grid-cols-[1fr_6rem_6rem_11rem_2rem]">
              <span className="sr-only">Name</span>
              <input
                name={`ing-name-${i}`}
                value={row.name}
                onChange={(e) => updateRow(i, { name: e.target.value })}
                placeholder="Ingredient"
                className={inputCls}
                aria-label={`Ingredient ${i + 1} name`}
              />
              <span className="sr-only">Quantity</span>
              <input
                name={`ing-qty-${i}`}
                value={row.quantity}
                onChange={(e) => updateRow(i, { quantity: e.target.value })}
                placeholder="2"
                className={inputCls}
                aria-label={`Ingredient ${i + 1} quantity`}
              />
              <span className="sr-only">Unit</span>
              <input
                name={`ing-unit-${i}`}
                value={row.unit}
                onChange={(e) => updateRow(i, { unit: e.target.value })}
                placeholder="cups"
                className={inputCls}
                aria-label={`Ingredient ${i + 1} unit`}
              />
              <span className="sr-only">Aisle</span>
              <select
                name={`ing-aisle-${i}`}
                value={row.aisle}
                onChange={(e) => updateRow(i, { aisle: e.target.value })}
                className={inputCls}
                aria-label={`Ingredient ${i + 1} aisle`}
              >
                {AISLES.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setRows((rs) => rs.filter((_, idx) => idx !== i))}
                disabled={rows.length === 1}
                className="grid h-9 w-9 place-items-center rounded-full text-lg text-ink-soft transition hover:bg-tomato/10 hover:text-tomato disabled:opacity-30"
                aria-label={`Remove ingredient ${i + 1}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            setRows((rs) => [...rs, { name: "", quantity: "", unit: "", aisle: "Produce" }])
          }
          className="mt-4 rounded-full bg-cream px-5 py-2 text-sm font-bold text-tomato ring-1 ring-tomato/20 transition hover:bg-tomato/10"
        >
          + Add ingredient
        </button>
      </section>

      {/* Instructions */}
      <section className="rounded-3xl bg-white p-6 ring-1 ring-tomato/10 md:p-8">
        <h2 className="mb-1 font-display text-xl font-black">Instructions</h2>
        <p className="mb-4 text-sm text-ink-soft">
          One step per line — they&apos;ll become a numbered list.
        </p>
        <textarea
          name="instructions"
          rows={8}
          placeholder={"Preheat oven to 425°F.\nLayer noodles, sauce, and cheese.\nBake until bubbling, 40 minutes."}
          className={`${inputCls} resize-y leading-relaxed`}
        />
      </section>

      <div className="flex justify-end pb-4">
        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-tomato to-berry px-10 py-3.5 font-display text-lg font-bold text-white shadow-xl shadow-tomato/30 transition hover:brightness-110 active:scale-[0.97]"
        >
          Save recipe 🍳
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-2xl border border-cream-dark bg-cream px-4 py-2.5 outline-none transition focus:border-mango focus:ring-4 focus:ring-mango/20";

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-bold">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}
