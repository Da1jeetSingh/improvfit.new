import { Card } from "@/components/ui/card";
import { ChartBars } from "@/components/ui/chart-bars";
import { formatDate } from "@/components/ui/form-styles";
import { StatTile } from "@/components/ui/stat-tile";
import type { RoleProgressStats } from "@/lib/stats/progress";

type StatsConsistencyProps = {
  progress: RoleProgressStats;
};

export function StatsConsistency({ progress }: StatsConsistencyProps) {
  const { consistency, weeklyActivity, training } = progress;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card
        title="Consistency"
        description="Your activity rhythm from logged training and matches."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <StatTile
            compact
            accent
            label="Current streak"
            value={`${consistency.currentStreak} ${
              consistency.currentStreak === 1 ? "day" : "days"
            }`}
            hint={
              consistency.loggedToday
                ? "Active today"
                : consistency.lastActiveDate
                  ? `Last active ${formatDate(consistency.lastActiveDate)}`
                  : "Log activity to start"
            }
          />
          <StatTile
            compact
            label="Training focus"
            value={`${training.battingSessions} / ${training.bowlingSessions}`}
            hint="Batting / bowling sessions"
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
