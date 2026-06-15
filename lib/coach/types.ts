export type CoachMessage = {
  text: string;
  label?: string;
};

export type CoachEvent =
  | "dashboard"
  | "training_saved"
  | "match_saved"
  | "goal_created";

export type CoachMessageTone =
  | "encourage"
  | "insight"
  | "streak"
  | "nudge"
  | "celebrate";

export type ScoredCoachMessage = CoachMessage & {
  score: number;
  tone: CoachMessageTone;
};
