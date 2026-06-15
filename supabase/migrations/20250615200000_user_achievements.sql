-- Persist unlocked achievement badges per user

create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create index user_achievements_user_id_idx on public.user_achievements (user_id);
create index user_achievements_unlocked_at_idx on public.user_achievements (unlocked_at desc);

comment on table public.user_achievements is 'Achievement badges unlocked by a player.';

alter table public.user_achievements enable row level security;

create policy "Users can view own achievements"
  on public.user_achievements
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own achievements"
  on public.user_achievements
  for insert
  to authenticated
  with check (auth.uid() = user_id);
