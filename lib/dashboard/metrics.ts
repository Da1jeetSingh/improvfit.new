import type { TrainingSession } from "@/types/training";

export type WeeklyTrainingBucket = {
  label: string;
  count: number;
};

export type DashboardMetrics = {
  trainingSessionsTotal: number;
  trainingSessionsLast30Days: number;
  trainingSessionsPerWeek: number | null;
  weeklyTraining: WeeklyTrainingBucket[];
};

function getWeeklyTrainingBuckets(
  sessions: TrainingSession[],
): WeeklyTrainingBucket[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const buckets: WeeklyTrainingBucket[] = [];

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
      count,
    });
  }

  return buckets;
}

export function calculateDashboardMetrics(
  sessions: TrainingSession[],
): DashboardMetrics {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sessionsLast30Days = sessions.filter((session) => {
    const sessionDate = new Date(`${session.session_date}T00:00:00`);
    return sessionDate >= thirtyDaysAgo;
  }).length;

  const trainingSessionsPerWeek =
    sessionsLast30Days > 0
      ? Math.round((sessionsLast30Days / 30) * 7 * 10) / 10
      : null;

  return {
    trainingSessionsTotal: sessions.length,
    trainingSessionsLast30Days: sessionsLast30Days,
    trainingSessionsPerWeek,
    weeklyTraining: getWeeklyTrainingBuckets(sessions),
  };
}

export function formatMetric(value: number | null, suffix = "") {
  if (value === null) {
    return "—";
  }

  return `${value}${suffix}`;
}
