export const focusAreas = ["batting", "bowling", "fielding", "other"] as const;

export const selfRatings = [1, 2, 3, 4, 5] as const;

export type FocusArea = (typeof focusAreas)[number];
export type SelfRating = (typeof selfRatings)[number];

export type TrainingSession = {
  id: string;
  user_id: string;
  session_date: string;
  duration_minutes: number | null;
  balls_faced: number | null;
  overs_bowled: number | null;
  balls_bowled: number | null;
  focus: FocusArea;
  notes: string | null;
  self_rating: SelfRating | null;
  created_at: string;
};

export const trainingSessionSelect =
  "id, user_id, session_date, duration_minutes, balls_faced, overs_bowled, balls_bowled, focus, notes, self_rating, created_at";
