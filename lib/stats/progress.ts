import { calculateActivityStreak } from "@/lib/dashboard/streak";
import {
  getCurrentWeekRange,
  getPreviousWeekRange,
  isDateInWeek,
} from "@/lib/dashboard/week";
import { calculateGoalProgress, type Goal } from "@/types/goal";
import type { Match } from "@/types/match";
import type { PlayerRole } from "@/types/profile";
import type { TrainingSession } from "@/types/training";
import {
  showsBattingLogFields,
  showsBowlingLogFields,
} from "@/lib/logging/role-fields";
import { calculateRollingAverage } from "@/lib/stats/trends";

export type WeekMetric = {
  thisWeek: number;
  lastWeek: number;
};

export type BattingProgress = {
  totalRuns: number;
  battingAverage: number | null;
  strikeRate: number | null;
  totalBallsFaced: number;
  totalFours: number;
  totalSixes: number;
  weekRuns: WeekMetric;
  weekMatches: WeekMetric;
};

export type BowlingProgress = {
  totalWickets: number;
  totalOvers: number;
  runsConceded: number;
  economy: number | null;
  weekWickets: WeekMetric;
  weekOvers: WeekMetric;
};

export type TrainingProgress = {
  totalSessions: number;
  totalMinutes: number;
  battingSessions: number;
  bowlingSessions: number;
  weekSessions: WeekMetric;
};

export type GoalsProgress = {
  total: number;
  active: number;
  completed: number;
  averageProgress: number | null;
};

export type ConsistencyProgress = {
  currentStreak: number;
  loggedToday: boolean;
  lastActiveDate: string | null;
};

export type WeeklyActivityBar = {
  label: string;
  value: number;
};

export type WeeklyChartSeries = {
  id: string;
  title: string;
  data: WeeklyActivityBar[];
  secondary?: WeeklyActivityBar[];
  secondaryColor?: string;
  secondaryLabel?: string;
  secondaryDashed?: boolean;
};

export type RoleProgressStats = {
  role: PlayerRole | null;
  batting: BattingProgress | null;
  bowling: BowlingProgress | null;
  training: TrainingProgress;
  goals: GoalsProgress;
  consistency: ConsistencyProgress;
  weeklyActivity: WeeklyActivityBar[];
  weeklyCharts: WeeklyChartSeries[];
  hasAnyData: boolean;
};

function sumNullable(values: Array<number | null>) {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function isDismissed(match: Match) {
  return Boolean(match.dismissal_type && match.dismissal_type !== "not out");
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

function sumInWeek<T>(
  items: T[],
  getDate: (item: T) => string,
  getValue: (item: T) => number | null,
  weekStart: Date,
  weekEnd: Date,
) {
  return items
    .filter((item) => isDateInWeek(getDate(item), weekStart, weekEnd))
    .reduce((total, item) => total + (getValue(item) ?? 0), 0);
}

function calculateBattingProgress(
  matches: Match[],
  currentWeekStart: Date,
  currentWeekEnd: Date,
  previousWeekStart: Date,
  previousWeekEnd: Date,
): BattingProgress {
  const totalRuns = sumNullable(matches.map((match) => match.runs));
  const totalBallsFaced = sumNullable(matches.map((match) => match.balls_faced));
  const dismissals = matches.filter(isDismissed).length;

  return {
    totalRuns,
    battingAverage:
      dismissals > 0 ? Math.round((totalRuns / dismissals) * 100) / 100 : null,
    strikeRate:
      totalBallsFaced > 0
        ? Math.round((totalRuns / totalBallsFaced) * 10000) / 100
        : null,
    totalBallsFaced,
    totalFours: sumNullable(matches.map((match) => match.fours)),
    totalSixes: sumNullable(matches.map((match) => match.sixes)),
    weekRuns: {
      thisWeek: sumInWeek(
        matches,
        (match) => match.played_on,
        (match) => match.runs,
        currentWeekStart,
        currentWeekEnd,
      ),
      lastWeek: sumInWeek(
        matches,
        (match) => match.played_on,
        (match) => match.runs,
        previousWeekStart,
        previousWeekEnd,
      ),
    },
    weekMatches: {
      thisWeek: countInWeek(
        matches,
        (match) => match.played_on,
        currentWeekStart,
        currentWeekEnd,
      ),
      lastWeek: countInWeek(
        matches,
        (match) => match.played_on,
        previousWeekStart,
        previousWeekEnd,
      ),
    },
  };
}

function calculateBowlingProgress(
  matches: Match[],
  currentWeekStart: Date,
  currentWeekEnd: Date,
  previousWeekStart: Date,
  previousWeekEnd: Date,
): BowlingProgress {
  const totalWickets = sumNullable(matches.map((match) => match.wickets));
  const totalOvers = sumNullable(matches.map((match) => match.overs_bowled));
  const runsConceded = sumNullable(matches.map((match) => match.runs_conceded));

  return {
    totalWickets,
    totalOvers: Math.round(totalOvers * 10) / 10,
    runsConceded,
    economy:
      totalOvers > 0
        ? Math.round((runsConceded / totalOvers) * 100) / 100
        : null,
    weekWickets: {
      thisWeek: sumInWeek(
        matches,
        (match) => match.played_on,
        (match) => match.wickets,
        currentWeekStart,
        currentWeekEnd,
      ),
      lastWeek: sumInWeek(
        matches,
        (match) => match.played_on,
        (match) => match.wickets,
        previousWeekStart,
        previousWeekEnd,
      ),
    },
    weekOvers: {
      thisWeek: Math.round(
        sumInWeek(
          matches,
          (match) => match.played_on,
          (match) => match.overs_bowled,
          currentWeekStart,
          currentWeekEnd,
        ) * 10,
      ) / 10,
      lastWeek: Math.round(
        sumInWeek(
          matches,
          (match) => match.played_on,
          (match) => match.overs_bowled,
          previousWeekStart,
          previousWeekEnd,
        ) * 10,
      ) / 10,
    },
  };
}

function calculateTrainingProgress(
  sessions: TrainingSession[],
  currentWeekStart: Date,
  currentWeekEnd: Date,
  previousWeekStart: Date,
  previousWeekEnd: Date,
): TrainingProgress {
  return {
    totalSessions: sessions.length,
    totalMinutes: sumNullable(
      sessions.map((session) => session.duration_minutes),
    ),
    battingSessions: sessions.filter((session) => session.focus === "batting")
      .length,
    bowlingSessions: sessions.filter((session) => session.focus === "bowling")
      .length,
    weekSessions: {
      thisWeek: countInWeek(
        sessions,
        (session) => session.session_date,
        currentWeekStart,
        currentWeekEnd,
      ),
      lastWeek: countInWeek(
        sessions,
        (session) => session.session_date,
        previousWeekStart,
        previousWeekEnd,
      ),
    },
  };
}

function calculateGoalsProgress(goals: Goal[]): GoalsProgress {
  const measurable = goals
    .map((goal) => calculateGoalProgress(goal))
    .filter((progress): progress is number => progress !== null);

  return {
    total: goals.length,
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
  };
}

function getWeekRanges(referenceDate = new Date()) {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  return [3, 2, 1, 0].map((weeksAgo) => {
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() - weeksAgo * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);

    return {
      label: weeksAgo === 0 ? "This wk" : `${weeksAgo}w ago`,
      weekStart,
      weekEnd,
    };
  });
}

function getWeeklyActivityBars(
  sessions: TrainingSession[],
  matches: Match[],
  referenceDate = new Date(),
): WeeklyActivityBar[] {
  return getWeekRanges(referenceDate).map(({ label, weekStart, weekEnd }) => {
    const sessionCount = countInWeek(
      sessions,
      (session) => session.session_date,
      weekStart,
      weekEnd,
    );
    const matchCount = countInWeek(
      matches,
      (match) => match.played_on,
      weekStart,
      weekEnd,
    );

    return {
      label,
      value: sessionCount + matchCount,
    };
  });
}

function getWeeklyTrainingBars(
  sessions: TrainingSession[],
  referenceDate = new Date(),
): WeeklyActivityBar[] {
  return getWeekRanges(referenceDate).map(({ label, weekStart, weekEnd }) => ({
    label,
    value: countInWeek(
      sessions,
      (session) => session.session_date,
      weekStart,
      weekEnd,
    ),
  }));
}

function getWeeklyRunsBars(
  matches: Match[],
  referenceDate = new Date(),
): WeeklyActivityBar[] {
  return getWeekRanges(referenceDate).map(({ label, weekStart, weekEnd }) => ({
    label,
    value: sumInWeek(
      matches,
      (match) => match.played_on,
      (match) => match.runs,
      weekStart,
      weekEnd,
    ),
  }));
}

function getWeeklyWicketsBars(
  matches: Match[],
  referenceDate = new Date(),
): WeeklyActivityBar[] {
  return getWeekRanges(referenceDate).map(({ label, weekStart, weekEnd }) => ({
    label,
    value: sumInWeek(
      matches,
      (match) => match.played_on,
      (match) => match.wickets,
      weekStart,
      weekEnd,
    ),
  }));
}

function getRecentMatchSeries(
  matches: Match[],
  getValue: (match: Match) => number,
  limit = 5,
): WeeklyActivityBar[] {
  return [...matches]
    .sort((left, right) => left.played_on.localeCompare(right.played_on))
    .slice(-limit)
    .map((match, index) => ({
      label: `M${index + 1}`,
      value: getValue(match),
    }));
}

function getWeeklyTrainingFocusBars(
  sessions: TrainingSession[],
  focus: TrainingSession["focus"],
  referenceDate = new Date(),
): WeeklyActivityBar[] {
  const filtered = sessions.filter((session) => session.focus === focus);

  return getWeekRanges(referenceDate).map(({ label, weekStart, weekEnd }) => ({
    label,
    value: countInWeek(
      filtered,
      (session) => session.session_date,
      weekStart,
      weekEnd,
    ),
  }));
}

function buildWeeklyCharts(
  role: PlayerRole | null,
  sessions: TrainingSession[],
  matches: Match[],
  referenceDate = new Date(),
): WeeklyChartSeries[] {
  const charts: WeeklyChartSeries[] = [
    {
      id: "activity",
      title: "Weekly activity",
      data: getWeeklyActivityBars(sessions, matches, referenceDate),
    },
    {
      id: "training",
      title: "Training load",
      data: getWeeklyTrainingBars(sessions, referenceDate),
    },
  ];

  if (showsBattingLogFields(role)) {
    const battingSeries = getRecentMatchSeries(
      matches,
      (match) => match.runs ?? 0,
    );

    if (battingSeries.length > 0) {
      const rollingAverage = calculateRollingAverage(
        battingSeries.map((point) => point.value),
        5,
      );

      charts.unshift({
        id: "batting-form",
        title: "Batting form",
        data: battingSeries,
        secondary: battingSeries.map((point, index) => ({
          label: point.label,
          value: rollingAverage[index] ?? 0,
        })),
        secondaryColor: "var(--green-sage)",
        secondaryLabel: "5-match avg",
        secondaryDashed: true,
      });
    } else {
      charts.push({
        id: "runs",
        title: "Batting form",
        data: getWeeklyRunsBars(matches, referenceDate),
      });
    }
  }

  if (showsBowlingLogFields(role)) {
    const wicketsSeries = getRecentMatchSeries(
      matches,
      (match) => match.wickets ?? 0,
    );
    const economySeries = getRecentMatchSeries(matches, (match) =>
      match.overs_bowled && match.overs_bowled > 0 && match.runs_conceded !== null
        ? Math.round((match.runs_conceded / match.overs_bowled) * 10) / 10
        : 0,
    );

    if (wicketsSeries.length > 0) {
      charts.unshift({
        id: "bowling-impact",
        title: "Bowling impact",
        data: wicketsSeries,
        secondary: economySeries,
        secondaryColor: "var(--green-sage)",
      });
    } else {
      charts.push({
        id: "wickets",
        title: "Bowling impact",
        data: getWeeklyWicketsBars(matches, referenceDate),
      });
    }
  }

  const focusSeries = getWeeklyTrainingFocusBars(
    sessions,
    "batting",
    referenceDate,
  );
  const bowlingFocusSeries = getWeeklyTrainingFocusBars(
    sessions,
    "bowling",
    referenceDate,
  );

  if (focusSeries.some((point) => point.value > 0)) {
    charts.push({
      id: "training-focus",
      title: "Training focus",
      data: focusSeries,
      secondary: bowlingFocusSeries,
      secondaryColor: "var(--green-sage)",
    });
  }

  return charts;
}

export function calculateRoleProgressStats(
  role: PlayerRole | null,
  sessions: TrainingSession[],
  matches: Match[],
  goals: Goal[],
  referenceDate = new Date(),
): RoleProgressStats {
  const currentWeek = getCurrentWeekRange(referenceDate);
  const previousWeek = getPreviousWeekRange(referenceDate);
  const streak = calculateActivityStreak(sessions, matches);

  const batting = showsBattingLogFields(role)
    ? calculateBattingProgress(
        matches,
        currentWeek.weekStart,
        currentWeek.weekEnd,
        previousWeek.weekStart,
        previousWeek.weekEnd,
      )
    : null;

  const bowling = showsBowlingLogFields(role)
    ? calculateBowlingProgress(
        matches,
        currentWeek.weekStart,
        currentWeek.weekEnd,
        previousWeek.weekStart,
        previousWeek.weekEnd,
      )
    : null;

  const training = calculateTrainingProgress(
    sessions,
    currentWeek.weekStart,
    currentWeek.weekEnd,
    previousWeek.weekStart,
    previousWeek.weekEnd,
  );

  const hasAnyData =
    sessions.length > 0 || matches.length > 0 || goals.length > 0;

  return {
    role,
    batting,
    bowling,
    training,
    goals: calculateGoalsProgress(goals),
    consistency: {
      currentStreak: streak.currentStreak,
      loggedToday: streak.loggedToday,
      lastActiveDate: streak.lastActiveDate,
    },
    weeklyActivity: getWeeklyActivityBars(sessions, matches, referenceDate),
    weeklyCharts: buildWeeklyCharts(role, sessions, matches, referenceDate),
    hasAnyData,
  };
}

export function formatWeekTrend(thisWeek: number, lastWeek: number) {
  const difference = thisWeek - lastWeek;

  if (difference === 0) {
    return "Same as last week";
  }

  const sign = difference > 0 ? "+" : "";
  return `${sign}${difference} vs last week`;
}
