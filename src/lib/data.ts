import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Family, Profile } from "@/lib/types";

export interface SessionData {
  user: { id: string; email?: string };
  profile: Profile;
  family: Family | null;
}

/** Loads the signed-in user, their profile, and their family. */
export async function getSession(): Promise<SessionData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  if (!profile.family_id) redirect("/onboarding");

  const { data: family } = await supabase
    .from("families")
    .select("*")
    .eq("id", profile.family_id)
    .single();

  return { user, profile, family: family ?? null };
}
