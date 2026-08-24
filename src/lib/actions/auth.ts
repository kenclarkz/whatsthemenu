"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const AVATAR_COLORS = [
  "#ff5a3c", "#e63975", "#7c5cff", "#3f9142",
  "#ffa62b", "#0ea5b5", "#d946ef", "#f43f5e",
];

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const name = String(formData.get("name") ?? "").trim();
  let color = String(formData.get("avatar_color") ?? "");
  if (!AVATAR_COLORS.includes(color)) color = AVATAR_COLORS[0];

  if (!name) return;

  await supabase
    .from("profiles")
    .update({ name, avatar_color: color })
    .eq("id", user.id);

  revalidatePath("/", "layout");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
