import { getSession } from "@/lib/data";
import { BottomNav, Sidebar } from "@/components/Nav";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, family } = await getSession();

  return (
    <div className="min-h-dvh">
      <Sidebar name={profile.name} familyName={family?.name ?? ""} avatarColor={profile.avatar_color} />
      <div className="md:pl-64">
        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 md:px-8 md:pb-12">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
