import type { Goal } from "@/types/goal";
import type { Match } from "@/types/match";
import type { TrainingSession } from "@/types/training";

import type { ActivityStreak } from "@/lib/dashboard/streak";

export type ProgressSummary = {
  currentStreak: number;
  activeGoals: number;
  latestTrainingDate: string | null;
  latestMatchDate: string | null;
  totalTrainingSessions: number;
  totalMatchPerformances: number;
  hasAnyData: boolean;
};

export function calculateProgressSummary(
  sessions: TrainingSession[],
  matches: Match[],
  goals: Goal[],
  streak: ActivityStreak,
): ProgressSummary {
  const activeGoals = goals.filter((goal) => goal.status !== "completed").length;

  const hasAnyData =
    streak.currentStreak > 0 ||
    streak.lastActiveDate !== null ||
    sessions.length > 0 ||
    matches.length > 0 ||
    goals.length > 0;

  return {
    currentStreak: streak.currentStreak,
    activeGoals,
    latestTrainingDate: sessions[0]?.session_date ?? null,
    latestMatchDate: matches[0]?.played_on ?? null,
    totalTrainingSessions: sessions.length,
    totalMatchPerformances: matches.length,
    hasAnyData,
  };
}
