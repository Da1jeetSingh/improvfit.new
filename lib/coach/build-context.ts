import { calculateRoleProgressStats } from "@/lib/stats/progress";
import { calculateActivityStreak } from "@/lib/dashboard/streak";
import type { Goal } from "@/types/goal";
import type { Match } from "@/types/match";
import type { PlayerProfile } from "@/types/profile";
import type { TrainingSession } from "@/types/training";

import type { CoachContext } from "@/lib/coach/messages";

export function buildCoachContext(
  profile: PlayerProfile | null,
  sessions: TrainingSession[],
  matches: Match[],
  goals: Goal[],
  event?: {
    latestTraining?: TrainingSession;
    latestMatch?: Match;
    latestGoal?: Goal;
  },
): CoachContext {
  const progress = calculateRoleProgressStats(
    profile?.role ?? null,
    sessions,
    matches,
    goals,
  );
  const streak = calculateActivityStreak(sessions, matches);
  const firstName = profile?.full_name?.split(" ")[0] ?? null;

  return {
    role: profile?.role ?? null,
    firstName,
    progress,
    streak,
    goals,
    matches,
    latestTraining: event?.latestTraining,
    latestMatch: event?.latestMatch,
    latestGoal: event?.latestGoal,
  };
}
