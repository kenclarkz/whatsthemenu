import { getSession } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import Avatar from "@/components/Avatar";
import ProfileForm from "./ProfileForm";
import SignOutButton from "./SignOutButton";
import CopyCode from "./CopyCode";
import InviteLink from "./InviteLink";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { profile, family, user } = await getSession();
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("profiles")
    .select("id, name, avatar_color, is_organizer")
    .eq("family_id", family!.id)
    .order("created_at");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="animate-fade-up">
        <h1 className="font-display text-4xl font-black md:text-5xl">Settings ⚙️</h1>
        <p className="mt-1 text-ink-soft">Your profile and family details.</p>
      </header>

      <ProfileForm profile={profile} />

      {/* Family card */}
      <section className="animate-fade-up rounded-3xl bg-white p-6 ring-1 ring-tomato/10 md:p-8" style={{ animationDelay: "80ms" }}>
        <h2 className="mb-1 font-display text-xl font-black">
          👨‍👩‍👧‍👦 {family?.name}
        </h2>
        <p className="mb-4 text-sm text-ink-soft">
          Send this link to family members so they can sign in and help choose the
          week&apos;s menu.
        </p>
        <InviteLink code={family?.invite_code ?? ""} />
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-dashed border-mango bg-mango/10 px-5 py-4">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
              Manual invite code
            </p>
            <code className="font-display text-2xl font-black tracking-[0.3em]">
              {family?.invite_code}
            </code>
          </div>
          <CopyCode code={family?.invite_code ?? ""} />
        </div>
        <ul className="mt-6 space-y-3">
          {(members ?? []).map((m) => (
            <li key={m.id} className="flex items-center gap-3">
              <Avatar name={m.name} color={m.avatar_color} />
              <span className="font-bold">{m.name}</span>
              {m.id === user.id && (
                <span className="rounded-full bg-tomato/10 px-2 py-0.5 text-[11px] font-bold text-tomato">you</span>
              )}
              {m.is_organizer && (
                <span className="rounded-full bg-grape/10 px-2 py-0.5 text-[11px] font-bold text-grape">
                  organizer 🌟
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="animate-fade-up rounded-3xl bg-white p-6 ring-1 ring-tomato/10" style={{ animationDelay: "160ms" }}>
        <h2 className="mb-2 font-display text-xl font-black">Account</h2>
        <p className="mb-4 text-sm text-ink-soft">Signed in as {user.email}</p>
        <SignOutButton />
      </section>
    </div>
  );
}
