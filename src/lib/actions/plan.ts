"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { MealType } from "@/lib/types";

export async function suggestMeal(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const familyId = String(formData.get("familyId"));
  const weekStart = String(formData.get("weekStart"));
  const mealDate = String(formData.get("mealDate"));
  const mealType = String(formData.get("mealType")) as MealType;
  const recipeId = String(formData.get("recipeId") ?? "");
  const customTitle = String(formData.get("customTitle") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!recipeId && !customTitle) return;

  const { error } = await supabase.from("suggestions").insert({
    family_id: familyId,
    week_start: weekStart,
    meal_date: mealDate,
    meal_type: mealType,
    recipe_id: recipeId || null,
    custom_title: customTitle || null,
    suggested_by: user.id,
    note: note || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/plan");
  revalidatePath("/dashboard");
}

export async function vote(suggestionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Optimistic toggle handled client-side; here we reconcile.
  const { data: existing } = await supabase
    .from("suggestion_votes")
    .select()
    .eq("suggestion_id", suggestionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("suggestion_votes")
      .delete()
      .eq("suggestion_id", suggestionId)
      .eq("user_id", user.id);
  } else {
    const { error } = await supabase
      .from("suggestion_votes")
      .insert({ suggestion_id: suggestionId });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/plan");
  revalidatePath("/dashboard");
}

export async function removeSuggestion(suggestionId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("suggestions")
    .delete()
    .eq("id", suggestionId);
  if (error) throw new Error(error.message);
  revalidatePath("/plan");
}

export async function finalizeMenu(weekStart: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("family_id")
    .single();
  if (!profile?.family_id) redirect("/onboarding");

  const { error } = await supabase.rpc("finalize_menu", {
    p_family_id: profile.family_id,
    p_week_start: weekStart,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/plan");
  revalidatePath("/grocery");
  revalidatePath("/dashboard");
}

export async function reopenMenu(weekStart: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("family_id")
    .single();
  if (!profile?.family_id) redirect("/onboarding");

  const { error } = await supabase.rpc("reopen_menu", {
    p_family_id: profile.family_id,
    p_week_start: weekStart,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/plan");
  revalidatePath("/grocery");
}

export async function regenerateGroceryList(weekStart: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("family_id")
    .single();
  if (!profile?.family_id) redirect("/onboarding");

  const { error } = await supabase.rpc("generate_grocery_list", {
    p_family_id: profile.family_id,
    p_week_start: weekStart,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/grocery");
}

export async function toggleGroceryItem(itemId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("toggle_grocery_item", {
    p_item_id: itemId,
  });
  return error ? null : true;
}
