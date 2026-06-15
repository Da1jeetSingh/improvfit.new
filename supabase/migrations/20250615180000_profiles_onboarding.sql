-- Role-based onboarding: rename users → profiles and add onboarding fields

-- ---------------------------------------------------------------------------
-- Rename table
-- ---------------------------------------------------------------------------

alter table public.users rename to profiles;

comment on table public.profiles is 'Player profile for each authenticated Supabase user.';

-- ---------------------------------------------------------------------------
-- New onboarding columns
-- ---------------------------------------------------------------------------

alter table public.profiles
  add column if not exists email text,
  add column if not exists batting_hand text,
  add column if not exists batting_order text,
  add column if not exists bowling_hand text,
  add column if not exists bowling_type text,
  add column if not exists bowling_style_details text,
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

-- Migrate legacy batting_style → batting_hand
update public.profiles
set batting_hand = case
  when batting_style = 'right-hand' then 'right'
  when batting_style = 'left-hand' then 'left'
end
where batting_hand is null
  and batting_style is not null;

-- Migrate legacy bowling_style → bowling_hand / bowling_type
update public.profiles
set
  bowling_hand = case
    when bowling_style like 'right-arm%' then 'right'
    when bowling_style like 'left-arm%' then 'left'
  end,
  bowling_type = case
    when bowling_style like '% fast' then 'fast'
    when bowling_style like '% medium' then 'medium pace'
    when bowling_style like '% spin' then 'spinner'
  end
where bowling_hand is null
  and bowling_style is not null
  and bowling_style <> 'none';

-- Backfill email from auth.users
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and p.email is null;

-- Mark onboarding complete for existing users with enough profile data
update public.profiles
set onboarding_completed = true
where onboarding_completed = false
  and role is not null
  and (
    (role = 'batsman' and batting_hand is not null and batting_order is not null)
    or (
      role = 'bowler'
      and bowling_hand is not null
      and bowling_type is not null
      and (bowling_type <> 'spinner' or bowling_style_details is not null)
    )
    or (
      role = 'all-rounder'
      and batting_hand is not null
      and batting_order is not null
      and bowling_hand is not null
      and bowling_type is not null
      and (bowling_type <> 'spinner' or bowling_style_details is not null)
    )
    or role = 'wicket-keeper'
  );

-- ---------------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_batting_hand_check'
  ) then
    alter table public.profiles
      add constraint profiles_batting_hand_check
      check (batting_hand is null or batting_hand in ('left', 'right'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_batting_order_check'
  ) then
    alter table public.profiles
      add constraint profiles_batting_order_check
      check (
        batting_order is null
        or batting_order in ('top order', 'middle order', 'lower order')
      );
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_bowling_hand_check'
  ) then
    alter table public.profiles
      add constraint profiles_bowling_hand_check
      check (bowling_hand is null or bowling_hand in ('left', 'right'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_bowling_type_check'
  ) then
    alter table public.profiles
      add constraint profiles_bowling_type_check
      check (
        bowling_type is null
        or bowling_type in ('fast', 'medium pace', 'spinner')
      );
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_bowling_style_details_check'
  ) then
    alter table public.profiles
      add constraint profiles_bowling_style_details_check
      check (
        bowling_style_details is null
        or bowling_style_details in ('leg spin', 'off spin')
      );
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_profiles_updated_at();

-- ---------------------------------------------------------------------------
-- RLS policies (rename from users)
-- ---------------------------------------------------------------------------

drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can view own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
