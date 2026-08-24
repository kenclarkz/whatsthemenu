"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Ingredient } from "@/lib/types";

export async function createRecipe(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("family_id")
    .single();
  if (!profile?.family_id) redirect("/onboarding");

  const title = String(formData.get("title") ?? "").trim();
  if (!title) redirect("/recipes/new?error=title");

  const ingredients: Ingredient[] = [];
  for (let i = 0; i < 30; i++) {
    const name = String(formData.get(`ing-name-${i}`) ?? "").trim();
    if (!name) continue;
    ingredients.push({
      name,
      quantity: String(formData.get(`ing-qty-${i}`) ?? "").trim(),
      unit: String(formData.get(`ing-unit-${i}`) ?? "").trim(),
      aisle: String(formData.get(`ing-aisle-${i}`) ?? "Other").trim(),
    });
  }

  const instructions = String(formData.get("instructions") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const servingsRaw = Number(formData.get("servings"));

  const { data, error } = await supabase
    .from("recipes")
    .insert({
      family_id: profile.family_id,
      created_by: user.id,
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      image_url: String(formData.get("image_url") ?? "").trim() || null,
      category: String(formData.get("category") ?? "Comfort Food"),
      servings:
        Number.isFinite(servingsRaw) && servingsRaw > 0 ? servingsRaw : 4,
      prep_minutes: Number(formData.get("prep_minutes")) || null,
      cook_minutes: Number(formData.get("cook_minutes")) || null,
      ingredients,
      instructions,
    })
    .select("id")
    .single();

  if (error) redirect("/recipes/new?error=save");

  revalidatePath("/recipes");
  redirect(`/recipes/${data.id}`);
}

export async function deleteRecipe(recipeId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", recipeId);
  if (error) throw new Error(error.message);
  revalidatePath("/recipes");
}
