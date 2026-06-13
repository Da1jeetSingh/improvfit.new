-- Ensure player profile columns exist on public.users (safe to re-run)

alter table public.users
  add column if not exists age integer;

alter table public.users
  add column if not exists role text;

alter table public.users
  add column if not exists batting_style text;

alter table public.users
  add column if not exists bowling_style text;

alter table public.users
  add column if not exists skill_level text;

alter table public.users
  add column if not exists personal_goals text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'users_age_check'
  ) then
    alter table public.users
      add constraint users_age_check
      check (age is null or (age >= 5 and age <= 100));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'users_role_check'
  ) then
    alter table public.users
      add constraint users_role_check
      check (
        role is null
        or role in ('batsman', 'bowler', 'all-rounder', 'wicket-keeper')
      );
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'users_batting_style_check'
  ) then
    alter table public.users
      add constraint users_batting_style_check
      check (
        batting_style is null
        or batting_style in ('right-hand', 'left-hand')
      );
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'users_bowling_style_check'
  ) then
    alter table public.users
      add constraint users_bowling_style_check
      check (
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
      );
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'users_skill_level_check'
  ) then
    alter table public.users
      add constraint users_skill_level_check
      check (
        skill_level is null
        or skill_level in ('beginner', 'intermediate', 'advanced', 'elite')
      );
  end if;
end $$;
