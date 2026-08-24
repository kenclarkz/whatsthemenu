# 🍽️ Whats For Dinner

A modern, colorful, mobile-first family meal-planning app. Suggest meals, vote as a
family, let the organizer finalize the weekly menu — and the grocery list writes
itself with duplicate ingredients merged.

## Features

- **Family accounts** — email/password auth; create a family (become organizer) or
  join with a 6-character invite code. Every table is scoped to your family via RLS.
- **Meal plan** (`/plan`) — weekly *or* biweekly board with breakfast / lunch /
  dinner slots per day. Suggest recipes (or custom ideas), vote ▲, and the
  organizer **finalizes** the week: top-voted meal wins each slot.
- **Recipes** — searchable/filterable cookbook with big food photography,
  aisle-grouped ingredients and numbered steps on detail pages. Add your own
  recipes with a photo gallery picker. Favorites everywhere ❤️
- **Grocery list** (`/grocery`) — auto-generated from the finalized menu by a
  Postgres RPC that **merges duplicate ingredients** (sums quantities) and groups
  them by supermarket aisle. Check items off with animated checks; checked state
  survives rebuilds.
- **Dashboard** — greeting, stats, today's menu hero cards, a "needs your vote"
  queue, and a week-at-a-glance strip.
- **Favorites & history** — your greatest-hits grid plus past finalized weeks with
  one-tap "cook again".
- **Polish** — loading skeletons, empty states, error boundaries, confirmation
  dialogs, optimistic UI, bottom tab bar on phones and sidebar on desktop.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, server actions, `proxy.ts` for
  session refresh)
- TypeScript + Tailwind CSS v4
- [Supabase](https://supabase.com) — Postgres + Auth + Row Level Security

## Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com).
2. Run the SQL: open the Supabase SQL editor and run `supabase/schema.sql`, then
   `supabase/seed.sql` (22 starter recipes with photography).
3. In Supabase → Authentication → URL configuration, add your dev/prod URLs if you
   enable email confirmation links.
4. Copy env vars:

   ```bash
   cp .env.example .env.local
   ```

   then fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   from Supabase → Settings → API.

5. Run it:

   ```bash
   npm install
   npm run dev
   ```

6. Sign up, start a family (you become the organizer), invite others with the
   code in Settings, and start planning!

## Scripts

| Command       | What it does              |
| ------------- | ------------------------- |
| `npm run dev` | Dev server                |
| `npm run build` | Production build        |
| `npm run lint`  | ESLint                  |

## Project layout

```
src/
  app/
    login/ signup/ onboarding/     # auth + family setup
    (main)/                        # app shell (sidebar/bottom tabs)
      dashboard/ plan/ recipes/ grocery/ favorites/ settings/
  components/                      # shared UI
  lib/
    supabase/                      # client factories + proxy session refresh
    actions/                       # server actions (plan, recipes, family, auth)
supabase/
  schema.sql                       # tables, RLS policies, RPCs
  seed.sql                         # starter recipe library
```
