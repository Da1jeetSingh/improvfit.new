import { ChartLine } from "@/components/ui/chart-line";
import { alertErrorClassName } from "@/components/ui/form-styles";
import type { RoleProgressStats } from "@/lib/stats/progress";

type StatsProgressProps = {
  progress: RoleProgressStats;
  error?: string | null;
};

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
      <ChartLine
        data={[
          { label: "3w ago", value: 0 },
          { label: "2w ago", value: 0 },
          { label: "1w ago", value: 0 },
          { label: "This wk", value: 0 },
        ]}
        aria-label="No stats data yet"
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {progress.weeklyCharts.map((chart) => (
        <ChartLine
          key={chart.id}
          data={chart.data}
          aria-label={`${chart.label} over the last four weeks`}
        />
      ))}
    </div>
  );
}
