-- IMPROV player MVP schema (profile + training only)
-- Run once in Supabase SQL Editor for a new project.

-- ---------------------------------------------------------------------------
-- Player profiles (linked to Supabase Auth)
-- ---------------------------------------------------------------------------

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  age integer check (age is null or (age >= 5 and age <= 100)),
  role text check (
    role is null
    or role in ('batsman', 'bowler', 'all-rounder', 'wicket-keeper')
  ),
  batting_style text check (
    batting_style is null
    or batting_style in ('right-hand', 'left-hand')
  ),
  bowling_style text check (
    bowling_style is null
    or bowling_style in (
      'none',
      'right-arm fast',
      'right-arm medium',
      'right-arm spin',
      'left-arm fast',
      'left-arm medium',
      'left-arm spin'
    )
  ),
  skill_level text check (
    skill_level is null
    or skill_level in ('beginner', 'intermediate', 'advanced', 'elite')
  ),
  personal_goals text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Training sessions
-- ---------------------------------------------------------------------------

create table public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  session_date date not null,
  focus text not null check (
    focus in ('batting', 'bowling', 'fielding', 'other')
  ),
  duration_minutes integer not null check (duration_minutes > 0),
  balls_faced integer check (balls_faced is null or balls_faced >= 0),
  self_rating integer check (
    self_rating is null
    or (self_rating >= 1 and self_rating <= 5)
  ),
  notes text,
  created_at timestamptz not null default now()
);

create index training_sessions_user_id_idx on public.training_sessions (user_id);
create index training_sessions_session_date_idx
  on public.training_sessions (session_date desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.users enable row level security;
alter table public.training_sessions enable row level security;

create policy "Users can view own profile"
  on public.users for select to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert to authenticated
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can view own training sessions"
  on public.training_sessions for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own training sessions"
  on public.training_sessions for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own training sessions"
  on public.training_sessions for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own training sessions"
  on public.training_sessions for delete to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Auto-create profile on sign-up
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
