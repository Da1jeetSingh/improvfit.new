import { calculateGoalProgress, type Goal } from "@/types/goal";
import type { Match } from "@/types/match";
import type { TrainingSession } from "@/types/training";

import {
  getMonthRange,
  getPreviousMonthRange,
  getWeekBucketsInMonth,
  isDateInMonth,
  type MonthRange,
} from "./month";

export type MonthMetric = {
  thisMonth: number;
  lastMonth: number;
};

export type MonthlyHighlight = {
  title: string;
  description: string;
  icon: string;
};

export type MonthlyRecap = {
  monthLabel: string;
  previousMonthLabel: string;
  hasDataThisMonth: boolean;
  totals: {
    sessions: number;
    matches: number;
    trainingMinutes: number;
    goalsCreated: number;
    goalsCompleted: number;
    activeDays: number;
    totalActivity: number;
    matchRuns: number;
  };
  comparison: {
    sessions: MonthMetric;
    matches: MonthMetric;
    trainingMinutes: MonthMetric;
    goalsCreated: MonthMetric;
    activeDays: MonthMetric;
    totalActivity: MonthMetric;
  };
  highlights: MonthlyHighlight[];
  weeklyActivity: Array<{ label: string; value: number }>;
  goalProgress: {
    active: number;
    completed: number;
    averageProgress: number | null;
  };
};

function sumNullable(values: Array<number | null>) {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function countInMonth<T>(
  items: T[],
  getDate: (item: T) => string,
  month: MonthRange,
) {
  return items.filter((item) =>
    isDateInMonth(getDate(item), month.monthStart, month.monthEnd),
  ).length;
}

function sumInMonth<T>(
  items: T[],
  getDate: (item: T) => string,
  getValue: (item: T) => number | null,
  month: MonthRange,
) {
  return items
    .filter((item) =>
      isDateInMonth(getDate(item), month.monthStart, month.monthEnd),
    )
    .reduce((total, item) => total + (getValue(item) ?? 0), 0);
}

function collectActiveDaysInMonth(
  sessions: TrainingSession[],
  matches: Match[],
  month: MonthRange,
) {
  const dates = new Set<string>();

  for (const session of sessions) {
    if (isDateInMonth(session.session_date, month.monthStart, month.monthEnd)) {
      dates.add(session.session_date);
    }
  }

  for (const match of matches) {
    if (isDateInMonth(match.played_on, month.monthStart, month.monthEnd)) {
      dates.add(match.played_on);
    }
  }

  return dates;
}

function calculateBestStreakFromDates(dates: string[]) {
  if (dates.length === 0) {
    return 0;
  }

  const sorted = [...dates].sort();
  let best = 1;
  let current = 1;

  for (let index = 1; index < sorted.length; index += 1) {
    const previous = new Date(`${sorted[index - 1]}T00:00:00`);
    const day = new Date(`${sorted[index]}T00:00:00`);
    const dayGap = Math.round(
      (day.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (dayGap === 1) {
      current += 1;
      best = Math.max(best, current);
    } else if (dayGap > 1) {
      current = 1;
    }
  }

  return best;
}

function countActivityInWeek(
  sessions: TrainingSession[],
  matches: Match[],
  weekStart: Date,
  weekEnd: Date,
) {
  const sessionCount = sessions.filter((session) => {
    const date = new Date(`${session.session_date}T00:00:00`);
    return date >= weekStart && date <= weekEnd;
  }).length;

  const matchCount = matches.filter((match) => {
    const date = new Date(`${match.played_on}T00:00:00`);
    return date >= weekStart && date <= weekEnd;
  }).length;

  return sessionCount + matchCount;
}

function goalsCreatedInMonth(goals: Goal[], month: MonthRange) {
  return goals.filter((goal) => {
    const created = goal.created_at.slice(0, 10);
    return isDateInMonth(created, month.monthStart, month.monthEnd);
  }).length;
}

function buildHighlights({
  month,
  sessions,
  matches,
  goals,
  achievementsUnlocked,
  longestStreak,
  mostActiveWeek,
}: {
  month: MonthRange;
  sessions: number;
  matches: number;
  goals: Goal[];
  achievementsUnlocked: number;
  longestStreak: number;
  mostActiveWeek: { label: string; activityCount: number } | null;
}): MonthlyHighlight[] {
  const highlights: MonthlyHighlight[] = [];

  if (longestStreak >= 3) {
    highlights.push({
      icon: "🔥",
      title: `${longestStreak}-day streak`,
      description: `Your longest activity run in ${month.monthLabel}.`,
    });
  }

  if (mostActiveWeek && mostActiveWeek.activityCount > 0) {
    highlights.push({
      icon: "📅",
      title: "Most active week",
      description: `Week of ${mostActiveWeek.label} — ${mostActiveWeek.activityCount} sessions and matches logged.`,
    });
  }

  if (achievementsUnlocked > 0) {
    highlights.push({
      icon: "🏅",
      title: `${achievementsUnlocked} badge${achievementsUnlocked === 1 ? "" : "s"} earned`,
      description: "New achievements unlocked this month.",
    });
  }

  const completedGoals = goals.filter((goal) => goal.status === "completed").length;
  const measurable = goals
    .map((goal) => calculateGoalProgress(goal))
    .filter((progress): progress is number => progress !== null);
  const averageProgress =
    measurable.length > 0
      ? Math.round(
          (measurable.reduce((sum, value) => sum + value, 0) / measurable.length) *
            10,
        ) / 10
      : null;

  if (completedGoals > 0) {
    highlights.push({
      icon: "🎯",
      title: `${completedGoals} goal${completedGoals === 1 ? "" : "s"} completed`,
      description:
        averageProgress !== null
          ? `Active goals are tracking at ${averageProgress}% on average.`
          : "Strong progress on your targets.",
    });
  } else if (sessions + matches >= 10) {
    highlights.push({
      icon: "📈",
      title: "Consistency building",
      description: `${sessions + matches} logged activities this month — momentum is growing.`,
    });
  }

  if (highlights.length === 0) {
    highlights.push({
      icon: "🌱",
      title: "Room to grow",
      description: "Log training or a match to start building your monthly recap.",
    });
  }

  return highlights.slice(0, 4);
}

export function formatMonthTrend(thisMonth: number, lastMonth: number) {
  const difference = thisMonth - lastMonth;

  if (difference === 0) {
    return "Same as last month";
  }

  const sign = difference > 0 ? "+" : "";
  return `${sign}${difference} vs last month`;
}

export function calculateMonthlyRecap(
  sessions: TrainingSession[],
  matches: Match[],
  goals: Goal[],
  achievementsUnlockedThisMonth = 0,
  referenceDate = new Date(),
): MonthlyRecap {
  const currentMonth = getMonthRange(referenceDate);
  const previousMonth = getPreviousMonthRange(referenceDate);

  const monthSessions = countInMonth(
    sessions,
    (session) => session.session_date,
    currentMonth,
  );
  const monthMatches = countInMonth(
    matches,
    (match) => match.played_on,
    currentMonth,
  );
  const monthMinutes = sumInMonth(
    sessions,
    (session) => session.session_date,
    (session) => session.duration_minutes,
    currentMonth,
  );
  const monthRuns = sumInMonth(
    matches,
    (match) => match.played_on,
    (match) => match.runs,
    currentMonth,
  );
  const activeDays = collectActiveDaysInMonth(sessions, matches, currentMonth)
    .size;

  const prevSessions = countInMonth(
    sessions,
    (session) => session.session_date,
    previousMonth,
  );
  const prevMatches = countInMonth(
    matches,
    (match) => match.played_on,
    previousMonth,
  );
  const prevMinutes = sumInMonth(
    sessions,
    (session) => session.session_date,
    (session) => session.duration_minutes,
    previousMonth,
  );
  const prevActiveDays = collectActiveDaysInMonth(
    sessions,
    matches,
    previousMonth,
  ).size;
  const prevGoalsCreated = goalsCreatedInMonth(goals, previousMonth);

  const activeDaysList = [...collectActiveDaysInMonth(sessions, matches, currentMonth)];
  const longestStreak = calculateBestStreakFromDates(activeDaysList);

  const weekBuckets = getWeekBucketsInMonth(
    currentMonth.monthStart,
    currentMonth.monthEnd,
  );
  let mostActiveWeek: { label: string; activityCount: number } | null = null;

  const weeklyActivity = weekBuckets.map((bucket) => {
    const value = countActivityInWeek(
      sessions,
      matches,
      bucket.weekStart,
      bucket.weekEnd,
    );

    if (!mostActiveWeek || value > mostActiveWeek.activityCount) {
      mostActiveWeek = { label: bucket.label, activityCount: value };
    }

    return { label: bucket.label, value };
  });

  const measurable = goals
    .map((goal) => calculateGoalProgress(goal))
    .filter((progress): progress is number => progress !== null);

  const highlights = buildHighlights({
    month: currentMonth,
    sessions: monthSessions,
    matches: monthMatches,
    goals,
    achievementsUnlocked: achievementsUnlockedThisMonth,
    longestStreak,
    mostActiveWeek,
  });

  return {
    monthLabel: currentMonth.monthLabel,
    previousMonthLabel: previousMonth.monthLabel,
    hasDataThisMonth: monthSessions > 0 || monthMatches > 0,
    totals: {
      sessions: monthSessions,
      matches: monthMatches,
      trainingMinutes: monthMinutes,
      goalsCreated: goalsCreatedInMonth(goals, currentMonth),
      goalsCompleted: goals.filter((goal) => goal.status === "completed").length,
      activeDays,
      totalActivity: monthSessions + monthMatches,
      matchRuns: monthRuns,
    },
    comparison: {
      sessions: { thisMonth: monthSessions, lastMonth: prevSessions },
      matches: { thisMonth: monthMatches, lastMonth: prevMatches },
      trainingMinutes: { thisMonth: monthMinutes, lastMonth: prevMinutes },
      goalsCreated: {
        thisMonth: goalsCreatedInMonth(goals, currentMonth),
        lastMonth: prevGoalsCreated,
      },
      activeDays: { thisMonth: activeDays, lastMonth: prevActiveDays },
      totalActivity: {
        thisMonth: monthSessions + monthMatches,
        lastMonth: prevSessions + prevMatches,
      },
    },
    highlights,
    weeklyActivity,
    goalProgress: {
      active: goals.filter((goal) => goal.status !== "completed").length,
      completed: goals.filter((goal) => goal.status === "completed").length,
      averageProgress:
        measurable.length > 0
          ? Math.round(
              (measurable.reduce((sum, value) => sum + value, 0) /
                measurable.length) *
                10,
            ) / 10
          : null,
    },
  };
}
