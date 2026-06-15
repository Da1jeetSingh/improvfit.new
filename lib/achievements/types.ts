export type AchievementId =
  | "first_training"
  | "first_match"
  | "three_day_streak"
  | "seven_day_streak"
  | "ten_training"
  | "first_goal_completed"
  | "first_batting_milestone"
  | "first_bowling_milestone";

export type Achievement = {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
  current: number;
  target: number;
  progress: number;
};

export type AchievementsSummary = {
  achievements: Achievement[];
  unlockedCount: number;
  totalCount: number;
};

export type AchievementUnlock = {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
};
