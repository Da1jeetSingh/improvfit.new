-- Add training session fields and remove fitness from focus options

alter table public.training_sessions
  add column balls_faced integer check (balls_faced is null or balls_faced >= 0),
  add column self_rating integer check (
    self_rating is null
    or (self_rating >= 1 and self_rating <= 5)
  );

alter table public.training_sessions
  drop constraint if exists training_sessions_focus_check;

alter table public.training_sessions
  add constraint training_sessions_focus_check
  check (focus in ('batting', 'bowling', 'fielding', 'other'));
