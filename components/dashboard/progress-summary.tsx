import { Card } from "@/components/ui/card";
import { alertErrorClassName, emptyCardClassName, formatDate } from "@/components/ui/form-styles";
import { StatTile } from "@/components/ui/stat-tile";
import type { ProgressSummary } from "@/lib/dashboard/progress-summary";

type ProgressSummaryCardProps = {
  summary: ProgressSummary;
  error?: string | null;
};

export function ProgressSummaryCard({ summary, error }: ProgressSummaryCardProps) {
  if (error) {
    return (
      <Card
        title="Progress summary"
        description="Your overall cricket activity at a glance."
      >
        <p className={alertErrorClassName} role="alert">
          Could not load progress summary: {error}
        </p>
      </Card>
    );
  }

  if (!summary.hasAnyData) {
    return (
      <Card
        title="Progress summary"
        description="Your overall cricket activity at a glance."
        className={emptyCardClassName}
      >
        <p className="text-sm leading-relaxed text-muted">
          No progress logged yet. Add a training session, match performance, or
          goal to see your summary here.
        </p>
      </Card>
    );
  }

  return (
    <Card
      title="Progress summary"
      description="Your overall cricket activity at a glance."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile
          compact
          label="Current streak"
          value={`${summary.currentStreak} ${summary.currentStreak === 1 ? "day" : "days"}`}
        />
        <StatTile compact label="Active goals" value={String(summary.activeGoals)} />
        <StatTile
          compact
          label="Latest training"
          value={
            summary.latestTrainingDate
              ? formatDate(summary.latestTrainingDate)
              : "—"
          }
        />
        <StatTile
          compact
          label="Latest match"
          value={
            summary.latestMatchDate ? formatDate(summary.latestMatchDate) : "—"
          }
        />
        <StatTile
          compact
          label="Total training sessions"
          value={String(summary.totalTrainingSessions)}
        />
        <StatTile
          compact
          label="Total match performances"
          value={String(summary.totalMatchPerformances)}
        />
      </div>
    </Card>
  );
}
