import { Card } from "@/components/ui/card";
import { ChartBars } from "@/components/ui/chart-bars";
import { StatTile } from "@/components/ui/stat-tile";
import type { RoleProgressStats } from "@/lib/stats/progress";

type StatsConsistencyProps = {
  progress: RoleProgressStats;
};

export function StatsConsistency({ progress }: StatsConsistencyProps) {
  const { weeklyActivity, training } = progress;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card
        title="Consistency"
        description="Training focus split from your logged sessions."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <StatTile
            compact
            label="Batting sessions"
            value={String(training.battingSessions)}
            hint="All-time batting focus"
          />
          <StatTile
            compact
            label="Bowling sessions"
            value={String(training.bowlingSessions)}
            hint="All-time bowling focus"
          />
        </div>
      </Card>

      <Card
        title="Weekly activity"
        description="Training sessions + matches over the last four weeks."
      >
        <ChartBars data={weeklyActivity} />
      </Card>
    </div>
  );
}
