import { Card } from "@/components/ui/card";
import { alertErrorClassName, emptyCardClassName, formatDate } from "@/components/ui/form-styles";
import { StatTile } from "@/components/ui/stat-tile";
import type { WeeklyProgress } from "@/lib/dashboard/weekly-progress";

type WeeklyProgressCardProps = {
  progress: WeeklyProgress;
  error?: string | null;
  title?: string;
};

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

export function WeeklyProgressCard({
  progress,
  error,
  title = "Weekly progress",
}: WeeklyProgressCardProps) {
  const weekLabel = formatWeekRange(progress.weekStart, progress.weekEnd);

  if (error) {
    return (
      <Card title={title} description={weekLabel}>
        <p className={alertErrorClassName} role="alert">
          Could not load weekly progress: {error}
        </p>
      </Card>
    );
  }

  if (!progress.hasDataThisWeek) {
    return (
      <Card title={title} description={weekLabel} className={emptyCardClassName}>
        <p className="text-sm leading-relaxed text-muted">
          No training or matches logged this week yet. Log a session or match
          performance to see your weekly progress here.
        </p>
        <div className="mt-6">
          <StatTile compact label="Active goals" value={String(progress.activeGoals)} />
        </div>
      </Card>
    );
  }

  return (
    <Card title={title} description={weekLabel}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile compact label="Training sessions" value={String(progress.trainingSessions)} />
        <StatTile compact label="Matches" value={String(progress.matches)} />
        <StatTile compact label="Training time" value={formatDuration(progress.totalTrainingMinutes)} />
        <StatTile compact label="Balls faced (training)" value={String(progress.totalTrainingBallsFaced)} />
        <StatTile compact label="Runs scored" value={String(progress.totalMatchRuns)} />
        <StatTile compact label="Active goals" value={String(progress.activeGoals)} />
      </div>
    </Card>
  );
}
