import { Card } from "@/components/ui/card";
import type { PlayerStats } from "@/lib/dashboard/stats";

type StatsAnalyticsProps = {
  stats: PlayerStats;
  error?: string | null;
};

function StatItem({
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

function formatTrend(thisWeek: number, lastWeek: number) {
  const difference = thisWeek - lastWeek;

  if (difference === 0) {
    return "same as last week";
  }

  const sign = difference > 0 ? "+" : "";
  return `${sign}${difference} vs last week`;
}

function SplitBar({ trainingPercent, matchPercent }: {
  trainingPercent: number;
  matchPercent: number;
}) {
  if (trainingPercent === 0 && matchPercent === 0) {
    return null;
  }

  return (
    <div className="mt-3 h-3 overflow-hidden rounded-full bg-green-muted">
      <div className="flex h-full">
        <div
          className="h-full bg-green-deep"
          style={{ width: `${trainingPercent}%` }}
        />
        <div
          className="h-full bg-foreground/20"
          style={{ width: `${matchPercent}%` }}
        />
      </div>
    </div>
  );
}

export function StatsAnalytics({ stats, error }: StatsAnalyticsProps) {
  if (error) {
    return (
      <Card title="Your stats" description="Performance metrics from your logs.">
        <p className="text-sm text-red-600" role="alert">
          Could not load stats: {error}
        </p>
      </Card>
    );
  }

  if (!stats.hasAnyData) {
    return (
      <Card
        title="Your stats"
        description="Performance metrics from your logs."
        className="border-dashed"
      >
        <p className="text-sm text-muted">
          No stats yet. Log a training session or match performance to see your
          analytics here.
        </p>
      </Card>
    );
  }

  const { trainingVsMatchSplit: split, weekTrend } = stats;

  return (
    <div className="space-y-6">
      <Card title="Overview" description="All-time totals from your logs.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatItem
            label="Training sessions"
            value={String(stats.totalTrainingSessions)}
          />
          <StatItem
            label="Match performances"
            value={String(stats.totalMatchPerformances)}
          />
          <StatItem
            label="Training duration"
            value={formatDuration(stats.totalTrainingMinutes)}
          />
          <StatItem
            label="Balls faced (training)"
            value={String(stats.totalTrainingBallsFaced)}
          />
          <StatItem
            label="Runs scored"
            value={String(stats.totalMatchRuns)}
          />
          <StatItem
            label="Avg self-rating"
            value={
              stats.averageSelfRating === null
                ? "—"
                : `${stats.averageSelfRating} / 5`
            }
          />
          <StatItem
            label="Best streak"
            value={`${stats.bestStreak} ${stats.bestStreak === 1 ? "day" : "days"}`}
          />
        </div>
      </Card>

      <Card
        title="Training vs matches"
        description="How your logged activity is split."
      >
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Training</span>
            <span className="text-muted">
              {split.trainingCount} ({split.trainingPercent}%)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Matches</span>
            <span className="text-muted">
              {split.matchCount} ({split.matchPercent}%)
            </span>
          </div>
        </div>
        <SplitBar
          trainingPercent={split.trainingPercent}
          matchPercent={split.matchPercent}
        />
      </Card>

      <Card
        title="This week vs last week"
        description="Simple trend based on calendar weeks."
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Training sessions
              </p>
              <p className="text-2xl font-bold text-foreground">
                {weekTrend.trainingThisWeek}
              </p>
            </div>
            <p className="mt-2 text-sm text-muted">
              {formatTrend(weekTrend.trainingThisWeek, weekTrend.trainingLastWeek)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Match performances
              </p>
              <p className="text-2xl font-bold text-foreground">
                {weekTrend.matchesThisWeek}
              </p>
            </div>
            <p className="mt-2 text-sm text-muted">
              {formatTrend(weekTrend.matchesThisWeek, weekTrend.matchesLastWeek)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
