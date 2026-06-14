import type { Match } from "@/types/match";
import type { TrainingSession } from "@/types/training";

import { calculateBestStreak } from "@/lib/dashboard/streak";
import {
  getCurrentWeekRange,
  getPreviousWeekRange,
  isDateInWeek,
} from "@/lib/dashboard/week";

export type TrainingMatchSplit = {
  trainingCount: number;
  matchCount: number;
  trainingPercent: number;
  matchPercent: number;
};

export type WeekTrend = {
  trainingThisWeek: number;
  trainingLastWeek: number;
  matchesThisWeek: number;
  matchesLastWeek: number;
};

export type PlayerStats = {
  totalTrainingSessions: number;
  totalMatchPerformances: number;
  totalTrainingMinutes: number;
  totalTrainingBallsFaced: number;
  totalMatchRuns: number;
  averageSelfRating: number | null;
  bestStreak: number;
  trainingVsMatchSplit: TrainingMatchSplit;
  weekTrend: WeekTrend;
  hasAnyData: boolean;
};

function sumNullable(values: Array<number | null>) {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function countInWeek<T>(
  items: T[],
  getDate: (item: T) => string,
  weekStart: Date,
  weekEnd: Date,
) {
  return items.filter((item) => isDateInWeek(getDate(item), weekStart, weekEnd))
    .length;
}

function averageSelfRating(sessions: TrainingSession[]) {
  const rated = sessions.filter((session) => session.self_rating !== null);

  if (rated.length === 0) {
    return null;
  }

  const total = rated.reduce((sum, session) => sum + (session.self_rating ?? 0), 0);
  return Math.round((total / rated.length) * 10) / 10;
}

export function calculatePlayerStats(
  sessions: TrainingSession[],
  matches: Match[],
  referenceDate = new Date(),
): PlayerStats {
  const totalTrainingSessions = sessions.length;
  const totalMatchPerformances = matches.length;
  const totalActivities = totalTrainingSessions + totalMatchPerformances;

  const trainingPercent =
    totalActivities > 0
      ? Math.round((totalTrainingSessions / totalActivities) * 100)
      : 0;
  const matchPercent =
    totalActivities > 0 ? 100 - trainingPercent : 0;

  const currentWeek = getCurrentWeekRange(referenceDate);
  const previousWeek = getPreviousWeekRange(referenceDate);

  return {
    totalTrainingSessions,
    totalMatchPerformances,
    totalTrainingMinutes: sumNullable(
      sessions.map((session) => session.duration_minutes),
    ),
    totalTrainingBallsFaced: sumNullable(
      sessions.map((session) => session.balls_faced),
    ),
    totalMatchRuns: sumNullable(matches.map((match) => match.runs)),
    averageSelfRating: averageSelfRating(sessions),
    bestStreak: calculateBestStreak(sessions, matches),
    trainingVsMatchSplit: {
      trainingCount: totalTrainingSessions,
      matchCount: totalMatchPerformances,
      trainingPercent,
      matchPercent,
    },
    weekTrend: {
      trainingThisWeek: countInWeek(
        sessions,
        (session) => session.session_date,
        currentWeek.weekStart,
        currentWeek.weekEnd,
      ),
      trainingLastWeek: countInWeek(
        sessions,
        (session) => session.session_date,
        previousWeek.weekStart,
        previousWeek.weekEnd,
      ),
      matchesThisWeek: countInWeek(
        matches,
        (match) => match.played_on,
        currentWeek.weekStart,
        currentWeek.weekEnd,
      ),
      matchesLastWeek: countInWeek(
        matches,
        (match) => match.played_on,
        previousWeek.weekStart,
        previousWeek.weekEnd,
      ),
    },
    hasAnyData: totalActivities > 0,
  };
}
