import { Card } from "@/components/ui/card";
import { emptyCardClassName } from "@/components/ui/form-styles";
import { StatTile } from "@/components/ui/stat-tile";
import type { PlayerStats } from "@/lib/dashboard/stats";

type StatsAnalyticsProps = {
  stats: PlayerStats;
  error?: string | null;
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

function formatTrend(thisWeek: number, lastWeek: number) {
  const difference = thisWeek - lastWeek;

  if (difference === 0) {
    return "same as last week";
  }

  const sign = difference > 0 ? "+" : "";
  return `${sign}${difference} vs last week`;
}

function SplitBar({
  trainingPercent,
  matchPercent,
}: {
  trainingPercent: number;
  matchPercent: number;
}) {
  if (trainingPercent === 0 && matchPercent === 0) {
    return null;
  }

  return (
    <div className="mt-4 h-3 overflow-hidden rounded-full bg-green-muted">
      <div className="flex h-full">
        <div
          className="h-full rounded-l-full bg-gradient-to-r from-green-deep to-green-brand transition-all duration-500"
          style={{ width: `${trainingPercent}%` }}
        />
        <div
          className="h-full rounded-r-full bg-green-soft/80"
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
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
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
        className={emptyCardClassName}
      >
        <p className="text-sm leading-relaxed text-muted">
          No stats yet. Log a training session or match performance to see your
          analytics here.
        </p>
      </Card>
    );
  }

  const { trainingVsMatchSplit: split, weekTrend } = stats;

  return (
    <div className="space-y-8">
      <Card title="Overview" description="All-time totals from your logs.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatTile compact label="Training sessions" value={String(stats.totalTrainingSessions)} />
          <StatTile compact label="Match performances" value={String(stats.totalMatchPerformances)} />
          <StatTile compact label="Training duration" value={formatDuration(stats.totalTrainingMinutes)} />
          <StatTile compact label="Balls faced (training)" value={String(stats.totalTrainingBallsFaced)} />
          <StatTile compact label="Runs scored" value={String(stats.totalMatchRuns)} />
          <StatTile
            compact
            label="Avg self-rating"
            value={
              stats.averageSelfRating === null
                ? "—"
                : `${stats.averageSelfRating} / 5`
            }
          />
          <StatTile
            compact
            label="Best streak"
            value={`${stats.bestStreak} ${stats.bestStreak === 1 ? "day" : "days"}`}
          />
        </div>
      </Card>

      <Card title="Training vs matches" description="How your logged activity is split.">
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">Training</span>
            <span className="font-bold text-foreground">
              {split.trainingCount}{" "}
              <span className="font-normal text-muted">({split.trainingPercent}%)</span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">Matches</span>
            <span className="font-bold text-foreground">
              {split.matchCount}{" "}
              <span className="font-normal text-muted">({split.matchPercent}%)</span>
            </span>
          </div>
        </div>
        <SplitBar trainingPercent={split.trainingPercent} matchPercent={split.matchPercent} />
      </Card>

      <Card title="This week vs last week" description="Simple trend based on calendar weeks.">
        <div className="grid gap-4 sm:grid-cols-2">
          <StatTile
            compact
            label="Training sessions"
            value={String(weekTrend.trainingThisWeek)}
            hint={formatTrend(weekTrend.trainingThisWeek, weekTrend.trainingLastWeek)}
          />
          <StatTile
            compact
            label="Match performances"
            value={String(weekTrend.matchesThisWeek)}
            hint={formatTrend(weekTrend.matchesThisWeek, weekTrend.matchesLastWeek)}
          />
        </div>
      </Card>
    </div>
  );
}
