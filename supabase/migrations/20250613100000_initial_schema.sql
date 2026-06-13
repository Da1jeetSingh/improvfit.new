-- IMPROV MVP schema
-- Run in the Supabase SQL editor or via: supabase db push

-- ---------------------------------------------------------------------------
-- Users (player profiles linked to Supabase Auth)
-- ---------------------------------------------------------------------------

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

comment on table public.users is 'Player profile for each authenticated Supabase user.';

-- ---------------------------------------------------------------------------
-- Matches
-- ---------------------------------------------------------------------------

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  played_on date not null,
  opposition text,
  runs integer check (runs is null or runs >= 0),
  wickets integer check (wickets is null or wickets >= 0),
  notes text,
  created_at timestamptz not null default now()
);

create index matches_user_id_idx on public.matches (user_id);
create index matches_played_on_idx on public.matches (played_on desc);

comment on table public.matches is 'Match performances logged by a player.';

-- ---------------------------------------------------------------------------
-- Training sessions
-- ---------------------------------------------------------------------------

create table public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  session_date date not null,
  focus text not null check (focus in ('batting', 'bowling', 'fielding', 'fitness', 'other')),
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  notes text,
  created_at timestamptz not null default now()
);

create index training_sessions_user_id_idx on public.training_sessions (user_id);
create index training_sessions_session_date_idx on public.training_sessions (session_date desc);

comment on table public.training_sessions is 'Practice and training sessions logged by a player.';

-- ---------------------------------------------------------------------------
-- Goals
-- ---------------------------------------------------------------------------

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index goals_user_id_idx on public.goals (user_id);
create index goals_due_date_idx on public.goals (due_date);

comment on table public.goals is 'Performance goals set by a player.';

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.users enable row level security;
alter table public.matches enable row level security;
alter table public.training_sessions enable row level security;
alter table public.goals enable row level security;

-- users: each person can only access their own profile
create policy "Users can view own profile"
  on public.users
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.users
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- matches
create policy "Users can view own matches"
  on public.matches
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own matches"
  on public.matches
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own matches"
  on public.matches
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own matches"
  on public.matches
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- training_sessions
create policy "Users can view own training sessions"
  on public.training_sessions
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own training sessions"
  on public.training_sessions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own training sessions"
  on public.training_sessions
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own training sessions"
  on public.training_sessions
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- goals
create policy "Users can view own goals"
  on public.goals
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own goals"
  on public.goals
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own goals"
  on public.goals
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own goals"
  on public.goals
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Auto-create a profile when someone signs up
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, full_name)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
