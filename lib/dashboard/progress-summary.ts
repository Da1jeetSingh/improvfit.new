import type { Goal } from "@/types/goal";
import type { Match } from "@/types/match";
import type { TrainingSession } from "@/types/training";

import { calculateActivityStreak, type ActivityStreak } from "@/lib/dashboard/streak";

export type ProgressSummary = {
  currentStreak: number;
  trainingSessionsThisWeek: number;
  matchesThisWeek: number;
  activeGoals: number;
  latestTrainingDate: string | null;
  latestMatchDate: string | null;
  hasAnyData: boolean;
};

function startOfLocalDay(date = new Date()) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function getThisWeekRange() {
  const weekEnd = startOfLocalDay();
  const weekStart = new Date(weekEnd);
  weekStart.setDate(weekStart.getDate() - 6);

  return { weekStart, weekEnd };
}

function isDateInRange(dateValue: string, weekStart: Date, weekEnd: Date) {
  const date = new Date(`${dateValue}T00:00:00`);
  return date >= weekStart && date <= weekEnd;
}

export function calculateProgressSummary(
  sessions: TrainingSession[],
  matches: Match[],
  goals: Goal[],
  streak: ActivityStreak,
): ProgressSummary {
  const { weekStart, weekEnd } = getThisWeekRange();

  const trainingSessionsThisWeek = sessions.filter((session) =>
    isDateInRange(session.session_date, weekStart, weekEnd),
  ).length;

  const matchesThisWeek = matches.filter((match) =>
    isDateInRange(match.played_on, weekStart, weekEnd),
  ).length;

  const activeGoals = goals.filter((goal) => goal.status !== "completed").length;

  const latestTrainingDate = sessions[0]?.session_date ?? null;
  const latestMatchDate = matches[0]?.played_on ?? null;

  const hasAnyData =
    streak.currentStreak > 0 ||
    streak.lastActiveDate !== null ||
    sessions.length > 0 ||
    matches.length > 0 ||
    goals.length > 0;

  return {
    currentStreak: streak.currentStreak,
    trainingSessionsThisWeek,
    matchesThisWeek,
    activeGoals,
    latestTrainingDate,
    latestMatchDate,
    hasAnyData,
  };
}
