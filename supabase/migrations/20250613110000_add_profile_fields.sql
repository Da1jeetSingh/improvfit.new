-- Add player profile fields to users

alter table public.users
  add column age integer check (age is null or (age >= 5 and age <= 100)),
  add column role text check (
    role is null
    or role in ('batsman', 'bowler', 'all-rounder', 'wicket-keeper')
  ),
  add column batting_style text check (
    batting_style is null
    or batting_style in ('right-hand', 'left-hand')
  ),
  add column bowling_style text check (
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
  add column skill_level text check (
    skill_level is null
    or skill_level in ('beginner', 'intermediate', 'advanced', 'elite')
  ),
  add column personal_goals text;

comment on column public.users.personal_goals is 'Free-text goals and aspirations on the player profile.';
