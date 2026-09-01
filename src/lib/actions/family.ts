"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randomCode(): string {
  let out = "";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < 6; i++) out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  return out;
}

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return user;
}

export async function createFamily(formData: FormData) {
  const supabase = await createClient();
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/onboarding?error=name");

  // Retry a few times in case of an invite-code collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode();
    const { data: family, error } = await supabase
      .from("families")
      .insert({ name, invite_code: code, created_by: user.id })
      .select()
      .single();

    if (error) continue;

    await supabase
      .from("profiles")
      .update({ family_id: family.id, is_organizer: true })
      .eq("id", user.id);

    revalidatePath("/", "layout");
    redirect("/dashboard");
  }
  redirect("/onboarding?error=code");
}

export async function joinFamily(formData: FormData) {
  const supabase = await createClient();
  const user = await requireUser();
  const raw = String(formData.get("code") ?? "").trim().toUpperCase();
  if (raw.length !== 6) redirect("/onboarding?error=code-format");

  const { data: family } = await supabase
    .from("families")
    .select("id")
    .eq("invite_code", raw)
    .single();

  if (!family) redirect("/onboarding?error=no-family");

  const { error } = await supabase
    .from("profiles")
    .update({ family_id: family.id })
    .eq("id", user.id);

  if (error) redirect("/onboarding?error=code");

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/** Joins a family from an invite-code link, e.g. /join/<code>. */
export async function joinFamilyByCode(raw: string) {
  const supabase = await createClient();
  const user = await requireUser();
  const code = raw.trim().toUpperCase();
  if (code.length !== 6) redirect("/join/not-found");

  const { data: family } = await supabase
    .from("families")
    .select("id")
    .eq("invite_code", code)
    .single();

  if (!family) redirect("/join/not-found");

  // Already a member — nothing to do.
  const { data: profile } = await supabase
    .from("profiles")
    .select("family_id")
    .eq("id", user.id)
    .single();

  if (profile?.family_id === family.id) {
    revalidatePath("/", "layout");
    redirect("/plan");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ family_id: family.id })
    .eq("id", user.id);

  if (error) redirect("/join/not-found");

  revalidatePath("/", "layout");
  redirect("/plan");
}
