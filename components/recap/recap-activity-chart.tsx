import { Card } from "@/components/ui/card";
import { ChartBars } from "@/components/ui/chart-bars";
import { emptyCardClassName } from "@/components/ui/form-styles";
import type { MonthlyRecap } from "@/lib/recap/calculate";

type RecapActivityChartProps = {
  recap: MonthlyRecap;
};

export function RecapActivityChart({ recap }: RecapActivityChartProps) {
  const hasActivity = recap.weeklyActivity.some((bar) => bar.value > 0);

  return (
    <Card
      title="Activity rhythm"
      description="Sessions and matches by week this month."
      className={!hasActivity ? emptyCardClassName : undefined}
    >
      {hasActivity ? (
        <ChartBars data={recap.weeklyActivity} />
      ) : (
        <p className="text-sm leading-relaxed text-muted">
          No activity logged this month yet. Your weekly rhythm will appear here
          as you train and play.
        </p>
      )}
    </Card>
  );
}
