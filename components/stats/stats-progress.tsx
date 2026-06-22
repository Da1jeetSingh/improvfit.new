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
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-green-deep sm:text-lg">
              {chart.title}
            </h2>
            {chart.secondary && chart.secondaryLabel ? (
              <div className="flex items-center gap-3 text-[11px] font-semibold text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded-full bg-green-deep" />
                  Scores
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="h-0.5 w-4 rounded-full border-t-2 border-dashed"
                    style={{ borderColor: chart.secondaryColor ?? "var(--green-sage)" }}
                  />
                  {chart.secondaryLabel}
                </span>
              </div>
            ) : null}
          </div>
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
                      showFill: true,
                      showDots: true,
                    },
                    {
                      id: "secondary",
                      data: chart.secondary,
                      color: chart.secondaryColor ?? "var(--green-sage)",
                      dashed: chart.secondaryDashed ?? true,
                      showFill: false,
                      showDots: false,
                      strokeWidth: 2.5,
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
