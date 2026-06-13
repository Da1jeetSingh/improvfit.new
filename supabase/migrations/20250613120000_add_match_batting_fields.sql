-- Expand matches table for batting performance tracking

alter table public.matches
  add column balls_faced integer check (balls_faced is null or balls_faced >= 0),
  add column strike_rate numeric(6, 2) check (strike_rate is null or strike_rate >= 0),
  add column fours integer check (fours is null or fours >= 0),
  add column sixes integer check (sixes is null or sixes >= 0),
  add column dismissal_type text check (
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
  ),
  add column match_level text check (
    match_level is null
    or match_level in ('club', 'school', 'university', 'county', 'international')
  ),
  add column opponent_type text check (
    opponent_type is null
    or opponent_type in ('league', 'friendly', 'tournament', 'practice')
  );
