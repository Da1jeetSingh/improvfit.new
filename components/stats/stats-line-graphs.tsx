import { Card } from "@/components/ui/card";
import { ChartLine } from "@/components/ui/chart-line";
import { emptyCardClassName } from "@/components/ui/form-styles";
import type { StatsTrends } from "@/lib/stats/trends";

type StatsLineGraphsProps = {
  trends: StatsTrends;
  hasAnyData: boolean;
};

export function StatsLineGraphs({ trends, hasAnyData }: StatsLineGraphsProps) {
  if (!hasAnyData) {
    return (
      <Card
        title="Performance trends"
        description="Line graphs from your logged activity."
        className={emptyCardClassName}
      >
        <p className="text-sm leading-relaxed text-muted">
          No data yet. Log a match or training session to unlock your trend
          graphs.
        </p>
      </Card>
    );
  }

  const showPrimary =
    trends.primary.length > 0 && trends.primaryLabel !== trends.activityLabel;
  const showSecondary = trends.secondary.length > 0;
  const showActivity = trends.activity.length > 0;

  return (
    <div className="space-y-8">
      {showPrimary ? (
        <Card
          title={trends.primaryLabel}
          description="Recent match performance over time."
        >
          <ChartLine data={trends.primary} />
        </Card>
      ) : null}

      {showSecondary ? (
        <Card
          title={trends.secondaryLabel}
          description="Supporting match trend from your logs."
        >
          <ChartLine
            data={trends.secondary}
            color="var(--chart-secondary)"
          />
        </Card>
      ) : null}

      {showActivity ? (
        <Card
          title={trends.activityLabel}
          description="Training sessions and matches per week."
        >
          <ChartLine
            data={trends.activity}
            color="var(--chart-tertiary)"
          />
        </Card>
      ) : null}
    </div>
  );
}
