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

export const matchFormats = ["t20", "odi", "test", "practice"] as const;

export type DismissalType = (typeof dismissalTypes)[number];
export type MatchFormat = (typeof matchFormats)[number];

export type Match = {
  id: string;
  user_id: string;
  played_on: string;
  opposition: string | null;
  format: MatchFormat | null;
  runs: number | null;
  balls_faced: number | null;
  strike_rate: number | null;
  fours: number | null;
  sixes: number | null;
  dismissal_type: DismissalType | null;
  wickets: number | null;
  overs_bowled: number | null;
  runs_conceded: number | null;
  notes: string | null;
  created_at: string;
};

export const matchSelect =
  "id, user_id, played_on, opposition, format, runs, balls_faced, strike_rate, fours, sixes, dismissal_type, wickets, overs_bowled, runs_conceded, notes, created_at";

export function formatMatchFormat(format: MatchFormat | null) {
  if (!format) {
    return null;
  }

  const labels: Record<MatchFormat, string> = {
    t20: "T20",
    odi: "ODI",
    test: "Test",
    practice: "Practice Match",
  };

  return labels[format];
}
