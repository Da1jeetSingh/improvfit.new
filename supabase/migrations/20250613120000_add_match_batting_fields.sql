-- Add batting performance columns to matches (safe to re-run)

alter table public.matches
  add column if not exists balls_faced integer;

alter table public.matches
  add column if not exists strike_rate numeric(6, 2);

alter table public.matches
  add column if not exists fours integer;

alter table public.matches
  add column if not exists sixes integer;

alter table public.matches
  add column if not exists dismissal_type text;

alter table public.matches
  add column if not exists match_level text;

alter table public.matches
  add column if not exists opponent_type text;

-- Add check constraints only if not already present
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'matches_balls_faced_check'
  ) then
    alter table public.matches
      add constraint matches_balls_faced_check
      check (balls_faced is null or balls_faced >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'matches_strike_rate_check'
  ) then
    alter table public.matches
      add constraint matches_strike_rate_check
      check (strike_rate is null or strike_rate >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'matches_fours_check'
  ) then
    alter table public.matches
      add constraint matches_fours_check
      check (fours is null or fours >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'matches_sixes_check'
  ) then
    alter table public.matches
      add constraint matches_sixes_check
      check (sixes is null or sixes >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'matches_dismissal_type_check'
  ) then
    alter table public.matches
      add constraint matches_dismissal_type_check
      check (
        dismissal_type is null
        or dismissal_type in (
          'not out',
          'bowled',
          'caught',
          'lbw',
          'run out',
          'stumped',
          'hit wicket',
          'retired'
        )
      );
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'matches_match_level_check'
  ) then
    alter table public.matches
      add constraint matches_match_level_check
      check (
        match_level is null
        or match_level in ('club', 'school', 'university', 'county', 'international')
      );
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'matches_opponent_type_check'
  ) then
    alter table public.matches
      add constraint matches_opponent_type_check
      check (
        opponent_type is null
        or opponent_type in ('league', 'friendly', 'tournament', 'practice')
      );
  end if;
end $$;
