"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/plan", label: "Plan", icon: "📅" },
  { href: "/recipes", label: "Recipes", icon: "🍳" },
  { href: "/grocery", label: "Grocery", icon: "🛒" },
  { href: "/favorites", label: "Faves", icon: "❤️" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-tomato/10 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden"
    >
      <ul className="grid grid-cols-5">
        {TABS.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold transition-all ${
                  active ? "text-tomato" : "text-ink-soft hover:text-tomato"
                }`}
              >
                <span
                  className={`text-xl transition-transform ${
                    active ? "-translate-y-0.5 scale-110" : ""
                  }`}
                >
                  {tab.icon}
                </span>
                {tab.label}
                <span
                  className={`h-1 w-6 rounded-full transition-all ${
                    active ? "bg-gradient-to-r from-tomato to-berry" : "bg-transparent"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Sidebar({
  name,
  familyName,
  avatarColor,
}: {
  name: string;
  familyName: string;
  avatarColor: string;
}) {
  const pathname = usePathname();
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-tomato/10 bg-white/70 px-5 py-7 backdrop-blur md:flex">
      <Link href="/dashboard" className="font-display text-2xl font-black leading-none">
        🍽️ <span className="text-gradient-warm">Whats For Dinner</span>
      </Link>
      <p className="mt-1.5 text-xs font-bold uppercase tracking-widest text-mango">
        {familyName}
      </p>

      <nav aria-label="Primary" className="mt-8 flex-1 space-y-1.5">
        {[...TABS, { href: "/settings", label: "Settings", icon: "⚙️" }].map(
          (tab) => {
            const active = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 font-bold transition-all ${
                  active
                    ? "bg-gradient-to-r from-tomato to-berry text-white shadow-lg shadow-tomato/25"
                    : "text-ink-soft hover:bg-cream-dark hover:text-ink"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </Link>
            );
          },
        )}
      </nav>

      <Link
        href="/settings"
        className="flex items-center gap-3 rounded-2xl p-3 transition hover:bg-cream-dark"
      >
        <span
          className="grid h-10 w-10 place-items-center rounded-full text-xs font-bold text-white ring-2 ring-white"
          style={{ backgroundColor: avatarColor }}
        >
          {initials}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold">{name}</span>
          <span className="block text-xs text-ink-soft">View settings</span>
        </span>
      </Link>
    </aside>
  );
}
