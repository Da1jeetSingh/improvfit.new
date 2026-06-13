-- Ensure training_sessions has MVP columns and constraints (safe to re-run)

alter table public.training_sessions
  add column if not exists balls_faced integer;

alter table public.training_sessions
  add column if not exists self_rating integer;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'training_sessions_balls_faced_check'
  ) then
    alter table public.training_sessions
      add constraint training_sessions_balls_faced_check
      check (balls_faced is null or balls_faced >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'training_sessions_self_rating_check'
  ) then
    alter table public.training_sessions
      add constraint training_sessions_self_rating_check
      check (
        self_rating is null
        or (self_rating >= 1 and self_rating <= 5)
      );
  end if;
end $$;

alter table public.training_sessions
  drop constraint if exists training_sessions_focus_check;

alter table public.training_sessions
  add constraint training_sessions_focus_check
  check (focus in ('batting', 'bowling', 'fielding', 'other'));
