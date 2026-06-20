import { Card } from "@/components/ui/card";
import { ChartLine } from "@/components/ui/chart-line";
import { alertErrorClassName } from "@/components/ui/form-styles";
import type { RoleProgressStats } from "@/lib/stats/progress";

type StatsProgressProps = {
  progress: RoleProgressStats;
  error?: string | null;
};

const EMPTY_WEEKLY = [
  { label: "3w ago", value: 0 },
  { label: "2w ago", value: 0 },
  { label: "1w ago", value: 0 },
  { label: "This wk", value: 0 },
];

export function StatsProgress({ progress, error }: StatsProgressProps) {
  if (error) {
    return (
      <p className={alertErrorClassName} role="alert">
        Could not load stats: {error}
      </p>
    );
  }

  if (!progress.hasAnyData) {
    return (
      <Card padding="sm">
        <h2 className="mb-4 text-base font-bold text-green-deep sm:text-lg">
          Weekly activity
        </h2>
        <ChartLine data={EMPTY_WEEKLY} aria-label="No stats data yet" />
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {progress.weeklyCharts.map((chart) => (
        <Card key={chart.id} padding="sm">
          <h2 className="mb-4 text-base font-bold text-green-deep sm:text-lg">
            {chart.title}
          </h2>
          <ChartLine
            data={chart.secondary ? undefined : chart.data}
            series={
              chart.secondary
                ? [
                    {
                      id: "primary",
                      data: chart.data,
                      color: "var(--green-deep)",
                      fill: "var(--green-tint)",
                      fillOpacity: 0.45,
                    },
                    {
                      id: "secondary",
                      data: chart.secondary,
                      color: chart.secondaryColor ?? "var(--green-sage)",
                      fill: "var(--green-muted)",
                      fillOpacity: 0.25,
                    },
                  ]
                : undefined
            }
            aria-label={`${chart.title} trend`}
          />
        </Card>
      ))}
    </div>
  );
}
