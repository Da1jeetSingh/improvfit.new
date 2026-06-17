import { isDateInWeek } from "@/lib/dashboard/week";
import {
  showsBattingLogFields,
  showsBowlingLogFields,
} from "@/lib/logging/role-fields";
import type { Match } from "@/types/match";
import type { PlayerRole } from "@/types/profile";
import type { TrainingSession } from "@/types/training";

import type { ChartLinePoint } from "@/components/ui/chart-line";

export type StatsTrends = {
  primary: ChartLinePoint[];
  secondary: ChartLinePoint[];
  activity: ChartLinePoint[];
  primaryLabel: string;
  secondaryLabel: string;
  activityLabel: string;
};

const MAX_MATCH_POINTS = 8;
const ACTIVITY_WEEKS = 8;

function sumNullable(values: Array<number | null>) {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function formatShortDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatWeekLabel(weeksAgo: number) {
  if (weeksAgo === 0) {
    return "This wk";
  }

  if (weeksAgo === 1) {
    return "Last wk";
  }

  return `${weeksAgo}w ago`;
}

function getRecentMatches(matches: Match[]) {
  return [...matches]
    .sort((left, right) => left.played_on.localeCompare(right.played_on))
    .slice(-MAX_MATCH_POINTS);
}

function getActivityTrend(
  sessions: TrainingSession[],
  matches: Match[],
  referenceDate = new Date(),
): ChartLinePoint[] {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: ACTIVITY_WEEKS }, (_, index) => {
    const weeksAgo = ACTIVITY_WEEKS - index - 1;
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() - weeksAgo * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);

    const sessionCount = sessions.filter((session) =>
      isDateInWeek(session.session_date, weekStart, weekEnd),
    ).length;
    const matchCount = matches.filter((match) =>
      isDateInWeek(match.played_on, weekStart, weekEnd),
    ).length;

    return {
      label: formatWeekLabel(weeksAgo),
      value: sessionCount + matchCount,
    };
  });
}

export function calculateStatsTrends(
  role: PlayerRole | null,
  matches: Match[],
  sessions: TrainingSession[],
  referenceDate = new Date(),
): StatsTrends {
  const recentMatches = getRecentMatches(matches);
  const activity = getActivityTrend(sessions, matches, referenceDate);

  if (showsBattingLogFields(role)) {
    return {
      primary: recentMatches.map((match) => ({
        label: formatShortDate(match.played_on),
        value: match.runs ?? 0,
      })),
      secondary: recentMatches.map((match) => ({
        label: formatShortDate(match.played_on),
        value: match.balls_faced ?? 0,
      })),
      activity,
      primaryLabel: "Runs per match",
      secondaryLabel: "Balls faced per match",
      activityLabel: "Weekly activity",
    };
  }

  if (showsBowlingLogFields(role)) {
    return {
      primary: recentMatches.map((match) => ({
        label: formatShortDate(match.played_on),
        value: match.wickets ?? 0,
      })),
      secondary: recentMatches.map((match) => ({
        label: formatShortDate(match.played_on),
        value: Math.round((match.overs_bowled ?? 0) * 10) / 10,
      })),
      activity,
      primaryLabel: "Wickets per match",
      secondaryLabel: "Overs per match",
      activityLabel: "Weekly activity",
    };
  }

  return {
    primary: activity,
    secondary: [],
    activity,
    primaryLabel: "Weekly activity",
    secondaryLabel: "",
    activityLabel: "Weekly activity",
  };
}

export type CareerOverviewStats = {
  matches: number;
  runs?: number;
  ballsFaced?: number;
  fours?: number;
  sixes?: number;
  overs?: number;
  wickets?: number;
};

export function calculateCareerOverview(
  role: PlayerRole | null,
  matches: Match[],
): CareerOverviewStats | null {
  if (matches.length === 0) {
    return null;
  }

  const base = { matches: matches.length };
  const showBatting = showsBattingLogFields(role);
  const showBowling = showsBowlingLogFields(role);

  return {
    ...base,
    ...(showBatting
      ? {
          runs: sumNullable(matches.map((match) => match.runs)),
          ballsFaced: sumNullable(matches.map((match) => match.balls_faced)),
          fours: sumNullable(matches.map((match) => match.fours)),
          sixes: sumNullable(matches.map((match) => match.sixes)),
        }
      : {}),
    ...(showBowling
      ? {
          overs:
            Math.round(sumNullable(matches.map((match) => match.overs_bowled)) * 10) /
            10,
          wickets: sumNullable(matches.map((match) => match.wickets)),
        }
      : {}),
  };
}
