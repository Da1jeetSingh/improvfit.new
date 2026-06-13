-- Add goal progress fields and replace completed flag with status

alter table public.goals
  add column target_value numeric check (target_value is null or target_value > 0),
  add column current_value numeric not null default 0 check (current_value >= 0),
  add column status text not null default 'not_started' check (
    status in ('not_started', 'in_progress', 'completed')
  );

update public.goals
set status = 'completed'
where completed = true;

alter table public.goals
  drop column completed;
