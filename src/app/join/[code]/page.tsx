import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { joinFamilyByCode } from "@/lib/actions/family";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Family invite" };

export default async function JoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const normalized = code.trim().toUpperCase();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not signed in — send them to sign in/up, returning to this link.
  if (!user) {
    redirect("/login?next=/join/" + encodeURIComponent(normalized));
  }

  const { data: family } = await supabase
    .from("families")
    .select("id, name")
    .eq("invite_code", normalized)
    .single();

  if (!family) redirect("/join/not-found");

  // Signed in and clicked the invite — join (or confirm) the family in place.
  await joinFamilyByCode(normalized);

  return null;
}
