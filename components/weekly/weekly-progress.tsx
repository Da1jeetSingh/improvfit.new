import { Card } from "@/components/ui/card";
import { formatDate } from "@/components/ui/form-styles";
import type { WeeklyProgress } from "@/lib/dashboard/weekly-progress";

type WeeklyProgressCardProps = {
  progress: WeeklyProgress;
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

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (remainder === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainder}m`;
}

function formatWeekRange(weekStart: string, weekEnd: string) {
  return `${formatDate(weekStart)} – ${formatDate(weekEnd)}`;
}

export function WeeklyProgressCard({ progress, error }: WeeklyProgressCardProps) {
  const weekLabel = formatWeekRange(progress.weekStart, progress.weekEnd);

  if (error) {
    return (
      <Card
        title="This week"
        description={weekLabel}
      >
        <p className="text-sm text-red-600" role="alert">
          Could not load weekly progress: {error}
        </p>
      </Card>
    );
  }

  if (!progress.hasDataThisWeek) {
    return (
      <Card
        title="This week"
        description={weekLabel}
        className="border-dashed"
      >
        <p className="text-sm text-muted">
          No training or matches logged this week yet. Log a session or match
          performance to see your weekly progress here.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <SummaryItem
            label="Current streak"
            value={`${progress.currentStreak} ${progress.currentStreak === 1 ? "day" : "days"}`}
          />
          <SummaryItem
            label="Active goals"
            value={String(progress.activeGoals)}
          />
        </div>
      </Card>
    );
  }

  return (
    <Card title="This week" description={weekLabel}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryItem
          label="Training sessions"
          value={String(progress.trainingSessions)}
        />
        <SummaryItem label="Matches" value={String(progress.matches)} />
        <SummaryItem
          label="Training time"
          value={formatDuration(progress.totalTrainingMinutes)}
        />
        <SummaryItem
          label="Balls faced (training)"
          value={String(progress.totalTrainingBallsFaced)}
        />
        <SummaryItem
          label="Runs scored"
          value={String(progress.totalMatchRuns)}
        />
        <SummaryItem
          label="Active goals"
          value={String(progress.activeGoals)}
        />
        <SummaryItem
          label="Current streak"
          value={`${progress.currentStreak} ${progress.currentStreak === 1 ? "day" : "days"}`}
        />
      </div>
    </Card>
  );
}
