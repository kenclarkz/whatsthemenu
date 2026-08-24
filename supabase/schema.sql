-- Whats For Dinner — Supabase schema
-- Run this in the SQL editor of your Supabase project.

create extension if not exists pgcrypto;

-- ============ ENUMS ============
create type public.meal_type as enum ('breakfast', 'lunch', 'dinner');

-- ============ TABLES ============

create table public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code char(6) not null unique,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  family_id uuid references public.families(id) on delete set null,
  name text not null default 'Friend',
  avatar_color text not null default '#ff5a3c',
  is_organizer boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references public.families(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  image_url text,
  category text not null default 'Comfort Food',
  servings integer not null default 4,
  prep_minutes integer,
  cook_minutes integer,
  ingredients jsonb not null default '[]'::jsonb,
  instructions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

create table public.suggestions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  week_start date not null,
  meal_date date not null,
  meal_type public.meal_type not null,
  recipe_id uuid references public.recipes(id) on delete cascade,
  custom_title text,
  suggested_by uuid not null references auth.users(id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  check (recipe_id is not null or custom_title is not null)
);

create table public.suggestion_votes (
  suggestion_id uuid not null references public.suggestions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (suggestion_id, user_id)
);

create table public.meal_plans (
  family_id uuid not null references public.families(id) on delete cascade,
  week_start date not null,
  finalized boolean not null default false,
  finalized_at timestamptz,
  finalized_by uuid references auth.users(id) on delete set null,
  primary key (family_id, week_start)
);

create table public.meal_plan_entries (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  week_start date not null,
  meal_date date not null,
  meal_type public.meal_type not null,
  recipe_id uuid references public.recipes(id) on delete set null,
  custom_title text,
  unique (family_id, meal_date, meal_type)
);

create table public.grocery_items (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  week_start date not null,
  name text not null,
  quantity text,
  unit text,
  aisle text not null default 'Other',
  checked boolean not null default false,
  checked_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index on public.recipes (family_id);
create index on public.suggestions (family_id, week_start);
create index on public.meal_plan_entries (family_id, week_start);
create index on public.grocery_items (family_id, week_start);

-- ============ HELPERS ============

-- Security-definer membership check (avoids recursive RLS on profiles).
create function public.is_family_member(fid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and family_id = fid
  );
$$;

create function public.my_family_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select family_id from public.profiles where id = auth.uid();
$$;

-- Auto-create a profile whenever a user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1), 'Friend')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep organizer flag consistent: first member becomes organizer implicitly
-- via app logic; this helper promotes when a family has no organizer.
create function public.ensure_organizer(fid uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.profiles
    where family_id = fid and is_organizer
  ) then
    update public.profiles
    set is_organizer = true
    where id = (
      select id from public.profiles
      where family_id = fid
      order by created_at asc
      limit 1
    );
  end if;
end;
$$;

-- ============ RPCs ============

-- Finalize the menu: top-voted suggestion per slot becomes the plan entry.
create function public.finalize_menu(p_family_id uuid, p_week_start date)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_entry record;
begin
  if not public.is_family_member(p_family_id) then
    raise exception 'Not a member of this family';
  end if;

  delete from public.meal_plan_entries
  where family_id = p_family_id and week_start = p_week_start;

  for v_entry in
    select distinct meal_date, meal_type from public.suggestions
    where family_id = p_family_id and week_start = p_week_start
  loop
    insert into public.meal_plan_entries (family_id, week_start, meal_date, meal_type, recipe_id, custom_title)
    select p_family_id, p_week_start, v_entry.meal_date, v_entry.meal_type,
           s.recipe_id, s.custom_title
    from public.suggestions s
    left join public.suggestion_votes v on v.suggestion_id = s.id
    where s.family_id = p_family_id
      and s.week_start = p_week_start
      and s.meal_date = v_entry.meal_date
      and s.meal_type = v_entry.meal_type
    group by s.id, s.recipe_id, s.custom_title
    order by count(v.user_id) desc, s.created_at asc
    limit 1;
  end loop;

  insert into public.meal_plans (family_id, week_start, finalized, finalized_at, finalized_by)
  values (p_family_id, p_week_start, true, now(), auth.uid())
  on conflict (family_id, week_start)
  do update set finalized = true, finalized_at = now(), finalized_by = auth.uid();

  -- Seed the grocery list from the finalized recipes.
  perform public.generate_grocery_list(p_family_id, p_week_start);
end;
$$;

create function public.reopen_menu(p_family_id uuid, p_week_start date)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_family_member(p_family_id) then
    raise exception 'Not a member of this family';
  end if;
  update public.meal_plans
  set finalized = false, finalized_at = null, finalized_by = null
  where family_id = p_family_id and week_start = p_week_start;
end;
$$;

-- Rebuild the grocery list from all finalized recipes for the given week.
-- Merges duplicate ingredients (same normalized name + unit): quantities are
-- summed. Checked-off state is preserved across rebuilds.
create function public.generate_grocery_list(p_family_id uuid, p_week_start date)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_family_member(p_family_id) then
    raise exception 'Not a member of this family';
  end if;

  create temp table merged_ingredients (
    name text, quantity numeric, unit text, aisle text
  ) on commit drop;

  insert into merged_ingredients (name, quantity, unit, aisle)
  select
    lower(trim(i ->> 'name')) as name,
    sum(coalesce(nullif(regexp_replace(i ->> 'quantity', '[^0-9./ ]', '', 'g'), '')::numeric, 0)),
    coalesce(nullif(trim(i ->> 'unit'), ''), null),
    coalesce(nullif(trim(i ->> 'aisle'), ''), 'Other')
  from public.meal_plan_entries e
  join public.recipes r on r.id = e.recipe_id,
  lateral jsonb_array_elements(r.ingredients) as i
  where e.family_id = p_family_id
    and e.week_start = p_week_start
    and e.recipe_id is not null
  group by 1, 3, 4;

  -- Preserve checked state for items that still exist after the rebuild.
  create temp table checked_state on commit drop as
    select lower(trim(name)) as name, unit, checked
    from public.grocery_items
    where family_id = p_family_id and week_start = p_week_start;

  delete from public.grocery_items
  where family_id = p_family_id and week_start = p_week_start;

  insert into public.grocery_items (family_id, week_start, name, quantity, unit, aisle, checked)
  select
    p_family_id,
    p_week_start,
    initcap(m.name),
    case
      when m.quantity is null or m.quantity = 0 then null
      when m.quantity = floor(m.quantity) then m.quantity::int::text
      else m.quantity::text
    end,
    m.unit,
    m.aisle,
    coalesce(c.checked, false)
  from merged_ingredients m
  left join checked_state c
    on c.name = m.name
   and coalesce(c.unit, '') = coalesce(m.unit, '');
end;
$$;

-- Toggle a grocery item; any family member can check/uncheck.
create function public.toggle_grocery_item(p_item_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_checked boolean;
  v_family uuid;
begin
  select family_id, not checked into v_family, v_checked
  from public.grocery_items where id = p_item_id;

  if not public.is_family_member(v_family) then
    raise exception 'Not allowed';
  end if;

  update public.grocery_items
  set checked = v_checked, checked_by = auth.uid()
  where id = p_item_id;

  return v_checked;
end;
$$;

-- "Cook again": copy a past recipe into next week's dinner suggestions.
create function public.cook_again(p_recipe_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_family uuid := public.my_family_id();
  v_next_monday date;
  v_suggestion_id uuid;
begin
  if v_family is null then
    raise exception 'Join a family first';
  end if;

  if date_part('isodow', current_date) = 7 then
    v_next_monday := current_date + 1;
  else
    v_next_monday := current_date + (8 - date_part('isodow', current_date))::int;
  end if;

  insert into public.suggestions (family_id, week_start, meal_date, meal_type, recipe_id, suggested_by)
  values (v_family, v_next_monday, v_next_monday, 'dinner', p_recipe_id, auth.uid())
  returning id into v_suggestion_id;

  return v_suggestion_id;
end;
$$;

-- ============ RLS ============
alter table public.families enable row level security;
alter table public.profiles enable row level security;
alter table public.recipes enable row level security;
alter table public.favorites enable row level security;
alter table public.suggestions enable row level security;
alter table public.suggestion_votes enable row level security;
alter table public.meal_plans enable row level security;
alter table public.meal_plan_entries enable row level security;
alter table public.grocery_items enable row level security;

-- families
create policy "Members can view their family" on public.families
  for select using (public.is_family_member(id));

create policy "Users can create a family" on public.families
  for insert with check (auth.uid() = created_by);

-- profiles
create policy "Read profiles in same family" on public.profiles
  for select using (
    id = auth.uid()
    or (family_id is not null and public.is_family_member(family_id))
  );

create policy "Update own profile" on public.profiles
  for update using (id = auth.uid());

create policy "Insert own profile" on public.profiles
  for insert with check (id = auth.uid());

-- recipes: visible if global (family_id null) or owned by your family
create policy "Read family + shared recipes" on public.recipes
  for select using (
    family_id is null or public.is_family_member(family_id)
  );

create policy "Create recipes in own family" on public.recipes
  for insert with check (
    auth.uid() = created_by
    and (family_id is null or public.is_family_member(family_id))
  );

create policy "Update own recipes" on public.recipes
  for update using (auth.uid() = created_by);

create policy "Delete own recipes" on public.recipes
  for delete using (auth.uid() = created_by);

-- favorites
create policy "Manage own favorites" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- suggestions
create policy "Family members read suggestions" on public.suggestions
  for select using (public.is_family_member(family_id));

create policy "Members suggest meals" on public.suggestions
  for insert with check (
    auth.uid() = suggested_by and public.is_family_member(family_id)
  );

create policy "Authors can remove own suggestions" on public.suggestions
  for delete using (auth.uid() = suggested_by);

-- votes
create policy "Family members read votes" on public.suggestion_votes
  for select using (
    exists (
      select 1 from public.suggestions s
      where s.id = suggestion_id and public.is_family_member(s.family_id)
    )
  );

create policy "Vote within own family" on public.suggestion_votes
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.suggestions s
      where s.id = suggestion_id
        and s.suggested_by <> auth.uid()
        and s.family_id = public.my_family_id()
    )
  );

create policy "Remove own vote" on public.suggestion_votes
  for delete using (auth.uid() = user_id);

-- meal plans
create policy "Family reads meal plans" on public.meal_plans
  for select using (public.is_family_member(family_id));

create policy "Organizer finalizes" on public.meal_plans
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and family_id = meal_plans.family_id and is_organizer
    )
  );

create policy "Organizer inserts meal plans" on public.meal_plans
  for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and family_id = meal_plans.family_id and is_organizer
    )
  );

-- meal plan entries
create policy "Family reads entries" on public.meal_plan_entries
  for select using (public.is_family_member(family_id));

-- grocery items
create policy "Family reads grocery list" on public.grocery_items
  for select using (public.is_family_member(family_id));

create policy "Members toggle groceries" on public.grocery_items
  for update using (public.is_family_member(family_id));
