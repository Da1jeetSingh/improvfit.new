-- Add bowling performance fields for role-based match and training logging

alter table public.matches
  add column if not exists wickets integer,
  add column if not exists overs_bowled numeric(4, 1),
  add column if not exists runs_conceded integer;

alter table public.training_sessions
  add column if not exists overs_bowled numeric(4, 1),
  add column if not exists balls_bowled integer;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'matches_wickets_check'
  ) then
    alter table public.matches
      add constraint matches_wickets_check
      check (wickets is null or wickets >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'matches_overs_bowled_check'
  ) then
    alter table public.matches
      add constraint matches_overs_bowled_check
      check (overs_bowled is null or overs_bowled >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'matches_runs_conceded_check'
  ) then
    alter table public.matches
      add constraint matches_runs_conceded_check
      check (runs_conceded is null or runs_conceded >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'training_sessions_overs_bowled_check'
  ) then
    alter table public.training_sessions
      add constraint training_sessions_overs_bowled_check
      check (overs_bowled is null or overs_bowled >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'training_sessions_balls_bowled_check'
  ) then
    alter table public.training_sessions
      add constraint training_sessions_balls_bowled_check
      check (balls_bowled is null or balls_bowled >= 0);
  end if;
end $$;
