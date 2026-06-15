import { Card } from "@/components/ui/card";
import { StatTile } from "@/components/ui/stat-tile";
import type { MonthlyRecap } from "@/lib/recap/calculate";

type RecapSummaryProps = {
  recap: MonthlyRecap;
};

export function RecapSummary({ recap }: RecapSummaryProps) {
  return (
    <Card
      title="Month at a glance"
      description={`Your totals for ${recap.monthLabel}.`}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile
          compact
          label="Training sessions"
          value={String(recap.totals.sessions)}
          hint={`${recap.totals.trainingMinutes} minutes logged`}
        />
        <StatTile
          compact
          label="Matches"
          value={String(recap.totals.matches)}
          hint={
            recap.totals.matchRuns > 0
              ? `${recap.totals.matchRuns} runs scored`
              : "Performances logged"
          }
        />
        <StatTile
          compact
          label="Active days"
          value={String(recap.totals.activeDays)}
          hint="Days with logged activity"
          accent={recap.totals.activeDays > 0}
        />
        <StatTile
          compact
          label="Total activity"
          value={String(recap.totals.totalActivity)}
          hint="Sessions and matches combined"
        />
        <StatTile
          compact
          label="Goals created"
          value={String(recap.totals.goalsCreated)}
          hint="New targets this month"
        />
        <StatTile
          compact
          label="Goals completed"
          value={String(recap.totals.goalsCompleted)}
          hint="All-time completed goals"
        />
      </div>
    </Card>
  );
}
