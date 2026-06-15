import { Card } from "@/components/ui/card";
import { StatsConsistency } from "@/components/stats/stats-consistency";
import { StatsGoalsSnapshot } from "@/components/stats/stats-goals-snapshot";
import { StatsSummary } from "@/components/stats/stats-summary";
import { StatsWeekComparison } from "@/components/stats/stats-week-comparison";
import { EmptyState } from "@/components/ui/empty-state";
import { alertErrorClassName } from "@/components/ui/form-styles";
import type { RoleProgressStats } from "@/lib/stats/progress";

type StatsProgressProps = {
  progress: RoleProgressStats;
  error?: string | null;
};

export function StatsProgress({ progress, error }: StatsProgressProps) {
  if (error) {
    return (
      <Card title="Your progress" description="Performance trends from your logs.">
        <p className={alertErrorClassName} role="alert">
          Could not load stats: {error}
        </p>
      </Card>
    );
  }

  if (!progress.hasAnyData) {
    return (
      <EmptyState
        title="Your progress"
        description="Performance trends from your logs."
        message="No data yet. Log a match, training session, or goal to unlock your progress stats."
      />
    );
  }

  return (
    <div className="space-y-8">
      <StatsSummary progress={progress} />
      <StatsWeekComparison progress={progress} />
      <StatsConsistency progress={progress} />
      <StatsGoalsSnapshot progress={progress} />
    </div>
  );
}
