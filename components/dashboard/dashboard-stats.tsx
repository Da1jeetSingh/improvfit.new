import { StatTile } from "@/components/ui/stat-tile";
import { formatMetric } from "@/lib/dashboard/metrics";
import type { DashboardMetrics } from "@/lib/dashboard/metrics";
import type { ProgressSummary } from "@/lib/dashboard/progress-summary";

type DashboardStatsProps = {
  metrics: DashboardMetrics;
  progressSummary: ProgressSummary;
};

export function DashboardStats({
  metrics,
  progressSummary,
}: DashboardStatsProps) {
  return (
    <section
      aria-label="Performance overview"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <StatTile
        compact
        label="Matches"
        value={String(metrics.matchesPlayed)}
        hint="Logged innings"
      />
      <StatTile
        compact
        label="Batting average"
        value={formatMetric(metrics.battingAverage)}
        hint="Runs per dismissal"
      />
      <StatTile
        compact
        label="Training (30d)"
        value={String(metrics.trainingSessionsLast30Days)}
        hint="Recent sessions"
      />
      <StatTile
        compact
        label="Active goals"
        value={String(progressSummary.activeGoals)}
        hint="In progress"
      />
    </section>
  );
}
