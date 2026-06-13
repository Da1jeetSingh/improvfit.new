-- Add match format and ensure opponent field exists (safe to re-run)

alter table public.matches
  add column if not exists opposition text;

alter table public.matches
  add column if not exists format text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'matches_format_check'
  ) then
    alter table public.matches
      add constraint matches_format_check
      check (
        format is null
        or format in ('t20', 'odi', 'test', 'practice')
      );
  end if;
end $$;
