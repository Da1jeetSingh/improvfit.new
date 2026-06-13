-- Add MVP goal fields (safe to re-run)

alter table public.goals
  add column if not exists description text;

alter table public.goals
  add column if not exists category text;

alter table public.goals
  add column if not exists target_outcome text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'goals_category_check'
  ) then
    alter table public.goals
      add constraint goals_category_check
      check (
        category is null
        or category in ('batting', 'bowling', 'fitness', 'mental', 'general')
      );
  end if;
end $$;
