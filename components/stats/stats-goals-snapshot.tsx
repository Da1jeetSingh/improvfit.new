import { Card } from "@/components/ui/card";
import { emptyCardClassName } from "@/components/ui/form-styles";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatTile } from "@/components/ui/stat-tile";
import type { RoleProgressStats } from "@/lib/stats/progress";

type StatsGoalsSnapshotProps = {
  progress: RoleProgressStats;
};

export function StatsGoalsSnapshot({ progress }: StatsGoalsSnapshotProps) {
  const { goals } = progress;

  if (goals.total === 0) {
    return (
      <Card
        title="Goals progress"
        description="Targets you are working toward."
        className={emptyCardClassName}
      >
        <p className="text-sm leading-relaxed text-muted">
          No goals set yet. Add a goal to track progress alongside your stats.
        </p>
      </Card>
    );
  }

  return (
    <Card title="Goals progress" description="Targets you are working toward.">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile compact label="Active" value={String(goals.active)} />
        <StatTile compact label="Completed" value={String(goals.completed)} />
        <StatTile
          compact
          label="Avg progress"
          value={
            goals.averageProgress !== null
              ? `${goals.averageProgress}%`
              : "—"
          }
        />
      </div>

      {goals.averageProgress !== null ? (
        <div className="mt-6">
          <ProgressBar value={goals.averageProgress} showLabel />
        </div>
      ) : null}
    </Card>
  );
}
