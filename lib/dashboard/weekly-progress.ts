import type { Goal } from "@/types/goal";
import type { Match } from "@/types/match";
import type { TrainingSession } from "@/types/training";

import type { ActivityStreak } from "@/lib/dashboard/streak";
import { getCurrentWeekRange, isDateInWeek } from "@/lib/dashboard/week";

export type WeeklyProgress = {
  weekStart: string;
  weekEnd: string;
  trainingSessions: number;
  matches: number;
  totalTrainingMinutes: number;
  totalTrainingBallsFaced: number;
  totalMatchRuns: number;
  activeGoals: number;
  currentStreak: number;
  hasDataThisWeek: boolean;
};

function sumNullable(values: Array<number | null>) {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

export function calculateWeeklyProgress(
  sessions: TrainingSession[],
  matches: Match[],
  goals: Goal[],
  streak: ActivityStreak,
  referenceDate = new Date(),
): WeeklyProgress {
  const { weekStart, weekEnd, weekStartKey, weekEndKey } =
    getCurrentWeekRange(referenceDate);

  const weekSessions = sessions.filter((session) =>
    isDateInWeek(session.session_date, weekStart, weekEnd),
  );
  const weekMatches = matches.filter((match) =>
    isDateInWeek(match.played_on, weekStart, weekEnd),
  );

  const activeGoals = goals.filter((goal) => goal.status !== "completed").length;

  const hasDataThisWeek = weekSessions.length > 0 || weekMatches.length > 0;

  return {
    weekStart: weekStartKey,
    weekEnd: weekEndKey,
    trainingSessions: weekSessions.length,
    matches: weekMatches.length,
    totalTrainingMinutes: sumNullable(
      weekSessions.map((session) => session.duration_minutes),
    ),
    totalTrainingBallsFaced: sumNullable(
      weekSessions.map((session) => session.balls_faced),
    ),
    totalMatchRuns: sumNullable(weekMatches.map((match) => match.runs)),
    activeGoals,
    currentStreak: streak.currentStreak,
    hasDataThisWeek,
  };
}
