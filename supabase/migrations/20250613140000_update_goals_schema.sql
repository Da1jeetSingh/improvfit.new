-- Align goals table with app schema (safe to re-run)

alter table public.goals
  add column if not exists target_value numeric;

alter table public.goals
  add column if not exists current_value numeric;

alter table public.goals
  add column if not exists status text;

update public.goals
set current_value = 0
where current_value is null;

update public.goals
set status = 'not_started'
where status is null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'goals'
      and column_name = 'completed'
  ) then
    update public.goals
    set status = case
      when completed then 'completed'
      when status is null or status = 'not_started' then 'not_started'
      else status
    end;
  end if;
end $$;

alter table public.goals
  alter column current_value set default 0;

alter table public.goals
  alter column status set default 'not_started';

alter table public.goals
  drop column if exists description;

alter table public.goals
  drop column if exists completed;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'goals_target_value_check'
  ) then
    alter table public.goals
      add constraint goals_target_value_check
      check (target_value is null or target_value > 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'goals_current_value_check'
  ) then
    alter table public.goals
      add constraint goals_current_value_check
      check (current_value >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'goals_status_check'
  ) then
    alter table public.goals
      add constraint goals_status_check
      check (status in ('not_started', 'in_progress', 'completed'));
  end if;
end $$;
