export type AchievementId =
  | "first_training"
  | "first_match"
  | "first_goal_completed"
  | "three_day_streak"
  | "seven_day_streak"
  | "fourteen_day_streak"
  | "weekly_consistency"
  | "improvement_streak"
  | "ten_training"
  | "twenty_five_training"
  | "fifty_training"
  | "ten_matches"
  | "twenty_five_matches"
  | "fifty_runs"
  | "hundred_runs"
  | "double_century"
  | "three_hundred_runs"
  | "five_hundred_runs"
  | "thousand_runs"
  | "goal_master"
  | "first_batting_milestone"
  | "first_bowling_milestone";

export type AchievementCategory =
  | "getting_started"
  | "consistency"
  | "training"
  | "matches"
  | "batting"
  | "goals";

export type Achievement = {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
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
  nextAchievement: Achievement | null;
};

export type AchievementUnlock = {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
};
