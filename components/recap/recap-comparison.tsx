import { Card } from "@/components/ui/card";
import { StatTile } from "@/components/ui/stat-tile";
import {
  formatMonthTrend,
  type MonthlyRecap,
} from "@/lib/recap/calculate";

type RecapComparisonProps = {
  recap: MonthlyRecap;
};

export function RecapComparison({ recap }: RecapComparisonProps) {
  const { comparison, previousMonthLabel } = recap;

  return (
    <Card
      title="Month over month"
      description={`Compared with ${previousMonthLabel}.`}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <StatTile
          compact
          label="Training sessions"
          value={String(comparison.sessions.thisMonth)}
          hint={formatMonthTrend(
            comparison.sessions.thisMonth,
            comparison.sessions.lastMonth,
          )}
        />
        <StatTile
          compact
          label="Matches"
          value={String(comparison.matches.thisMonth)}
          hint={formatMonthTrend(
            comparison.matches.thisMonth,
            comparison.matches.lastMonth,
          )}
        />
        <StatTile
          compact
          label="Training minutes"
          value={String(comparison.trainingMinutes.thisMonth)}
          hint={formatMonthTrend(
            comparison.trainingMinutes.thisMonth,
            comparison.trainingMinutes.lastMonth,
          )}
        />
        <StatTile
          compact
          label="Active days"
          value={String(comparison.activeDays.thisMonth)}
          hint={formatMonthTrend(
            comparison.activeDays.thisMonth,
            comparison.activeDays.lastMonth,
          )}
        />
        <StatTile
          compact
          label="Total activity"
          value={String(comparison.totalActivity.thisMonth)}
          hint={formatMonthTrend(
            comparison.totalActivity.thisMonth,
            comparison.totalActivity.lastMonth,
          )}
        />
        <StatTile
          compact
          label="Goals created"
          value={String(comparison.goalsCreated.thisMonth)}
          hint={formatMonthTrend(
            comparison.goalsCreated.thisMonth,
            comparison.goalsCreated.lastMonth,
          )}
        />
      </div>
    </Card>
  );
}
