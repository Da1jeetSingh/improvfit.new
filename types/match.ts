export const dismissalTypes = [
  "not out",
  "bowled",
  "caught",
  "lbw",
  "run out",
  "stumped",
  "hit wicket",
  "retired",
] as const;

export const matchLevels = [
  "club",
  "school",
  "university",
  "county",
  "international",
] as const;

export const opponentTypes = [
  "league",
  "friendly",
  "tournament",
  "practice",
] as const;

export type DismissalType = (typeof dismissalTypes)[number];
export type MatchLevel = (typeof matchLevels)[number];
export type OpponentType = (typeof opponentTypes)[number];

export type Match = {
  id: string;
  user_id: string;
  played_on: string;
  runs: number | null;
  balls_faced: number | null;
  strike_rate: number | null;
  fours: number | null;
  sixes: number | null;
  dismissal_type: DismissalType | null;
  match_level: MatchLevel | null;
  opponent_type: OpponentType | null;
  notes: string | null;
  created_at: string;
};

export const matchSelect =
  "id, user_id, played_on, runs, balls_faced, strike_rate, fours, sixes, dismissal_type, match_level, opponent_type, notes, created_at";
