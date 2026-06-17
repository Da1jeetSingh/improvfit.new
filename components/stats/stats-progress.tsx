import { Card } from "@/components/ui/card";
import { StatsLineGraphs } from "@/components/stats/stats-line-graphs";
import {
  alertErrorClassName,
} from "@/components/ui/form-styles";
import type { StatsTrends } from "@/lib/stats/trends";

type StatsProgressProps = {
  trends: StatsTrends;
  hasAnyData: boolean;
  error?: string | null;
};

export function StatsProgress({ trends, hasAnyData, error }: StatsProgressProps) {
  if (error) {
    return (
      <Card title="Performance trends" description="Line graphs from your logs.">
        <p className={alertErrorClassName} role="alert">
          Could not load stats: {error}
        </p>
      </Card>
    );
  }

  return <StatsLineGraphs trends={trends} hasAnyData={hasAnyData} />;
}
