import { Card } from "@/components/ui/card";
import { formatDate } from "@/components/ui/form-styles";
import type { ProgressSummary } from "@/lib/dashboard/progress-summary";

type ProgressSummaryCardProps = {
  summary: ProgressSummary;
  error?: string | null;
};

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export function ProgressSummaryCard({ summary, error }: ProgressSummaryCardProps) {
  if (error) {
    return (
      <Card
        title="Progress summary"
        description="Your overall cricket activity at a glance."
      >
        <p className="text-sm text-red-600" role="alert">
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
        className="border-dashed"
      >
        <p className="text-sm text-muted">
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
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryItem
          label="Current streak"
          value={`${summary.currentStreak} ${summary.currentStreak === 1 ? "day" : "days"}`}
        />
        <SummaryItem label="Active goals" value={String(summary.activeGoals)} />
        <SummaryItem
          label="Latest training"
          value={
            summary.latestTrainingDate
              ? formatDate(summary.latestTrainingDate)
              : "—"
          }
        />
        <SummaryItem
          label="Latest match"
          value={
            summary.latestMatchDate ? formatDate(summary.latestMatchDate) : "—"
          }
        />
        <SummaryItem
          label="Total training sessions"
          value={String(summary.totalTrainingSessions)}
        />
        <SummaryItem
          label="Total match performances"
          value={String(summary.totalMatchPerformances)}
        />
      </div>
    </Card>
  );
}
