import { calculateGoalProgress, type Goal } from "@/types/goal";
import type { Match } from "@/types/match";
import type { TrainingSession } from "@/types/training";

export type ChartBar = {
  label: string;
  value: number;
};

export type GoalSummary = {
  id: string;
  title: string;
  current_value: number;
  target_value: number | null;
  progress: number | null;
  status: Goal["status"];
};

export type DashboardMetrics = {
  matchesPlayed: number;
  totalRuns: number;
  battingAverage: number | null;
  strikeRate: number | null;
  trainingSessionsTotal: number;
  trainingSessionsLast30Days: number;
  trainingSessionsPerWeek: number | null;
  weeklyTraining: ChartBar[];
  goalsTotal: number;
  goalsCompleted: number;
  averageGoalProgress: number | null;
  goalSummaries: GoalSummary[];
};

function isDismissed(match: Match) {
  return Boolean(match.dismissal_type && match.dismissal_type !== "not out");
}

function getWeeklyTrainingBuckets(sessions: TrainingSession[]): ChartBar[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const buckets: ChartBar[] = [];

  for (let index = 3; index >= 0; index -= 1) {
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() - index * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);

    const count = sessions.filter((session) => {
      const sessionDate = new Date(`${session.session_date}T00:00:00`);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    }).length;

    buckets.push({
      label: index === 0 ? "This week" : `${index}w ago`,
      value: count,
    });
  }

  return buckets;
}

export function calculateDashboardMetrics(
  matches: Match[],
  sessions: TrainingSession[],
  goals: Goal[],
): DashboardMetrics {
  const totalRuns = matches.reduce((sum, match) => sum + (match.runs ?? 0), 0);
  const dismissals = matches.filter(isDismissed).length;
  const totalBalls = matches.reduce((sum, m) => sum + (m.balls_faced ?? 0), 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sessionsLast30Days = sessions.filter((session) => {
    const d = new Date(`${session.session_date}T00:00:00`);
    return d >= thirtyDaysAgo;
  }).length;

  const goalSummaries = goals.map((goal) => ({
    id: goal.id,
    title: goal.title,
    current_value: goal.current_value,
    target_value: goal.target_value,
    progress: calculateGoalProgress(goal),
    status: goal.status,
  }));

  const measurable = goalSummaries.filter((g) => g.progress !== null);

  return {
    matchesPlayed: matches.length,
    totalRuns,
    battingAverage:
      dismissals > 0 ? Math.round((totalRuns / dismissals) * 100) / 100 : null,
    strikeRate:
      totalBalls > 0
        ? Math.round((totalRuns / totalBalls) * 10000) / 100
        : null,
    trainingSessionsTotal: sessions.length,
    trainingSessionsLast30Days: sessionsLast30Days,
    trainingSessionsPerWeek:
      sessionsLast30Days > 0
        ? Math.round((sessionsLast30Days / 30) * 7 * 10) / 10
        : null,
    weeklyTraining: getWeeklyTrainingBuckets(sessions),
    goalsTotal: goals.length,
    goalsCompleted: goals.filter((g) => g.status === "completed").length,
    averageGoalProgress:
      measurable.length > 0
        ? Math.round(
            (measurable.reduce((s, g) => s + (g.progress ?? 0), 0) /
              measurable.length) *
              10,
          ) / 10
        : null,
    goalSummaries,
  };
}

export function formatMetric(value: number | null, suffix = "") {
  return value === null ? "—" : `${value}${suffix}`;
}
