import { Card } from "@/components/ui/card";
import { StatTile } from "@/components/ui/stat-tile";
import { formatMetric } from "@/lib/dashboard/metrics";
import type { RoleProgressStats } from "@/lib/stats/progress";
import {
  showsBattingLogFields,
  showsBowlingLogFields,
} from "@/lib/logging/role-fields";
import { formatLabel } from "@/components/ui/form-styles";

type StatsSummaryProps = {
  progress: RoleProgressStats;
};

export function StatsSummary({ progress }: StatsSummaryProps) {
  const { role, batting, bowling, training, goals } = progress;
  const roleLabel = role ? formatLabel(role) : "Player";

  return (
    <Card
      title="Summary"
      description={`${roleLabel} performance at a glance.`}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {showsBattingLogFields(role) && batting ? (
          <>
            <StatTile
              compact
              accent
              label="Total runs"
              value={String(batting.totalRuns)}
              hint={`Avg ${formatMetric(batting.battingAverage)}`}
            />
            <StatTile
              compact
              label="Strike rate"
              value={formatMetric(batting.strikeRate)}
              hint={`${batting.totalBallsFaced} balls faced`}
            />
          </>
        ) : null}

        {showsBowlingLogFields(role) && bowling ? (
          <>
            <StatTile
              compact
              accent={!showsBattingLogFields(role)}
              label="Total wickets"
              value={String(bowling.totalWickets)}
              hint={`${bowling.totalOvers} overs`}
            />
            <StatTile
              compact
              label="Economy"
              value={formatMetric(bowling.economy)}
              hint={`${bowling.runsConceded} runs conceded`}
            />
          </>
        ) : null}

        <StatTile
          compact
          label="Training sessions"
          value={String(training.totalSessions)}
          hint={`${training.totalMinutes} min total`}
        />

        <StatTile
          compact
          label="Active goals"
          value={String(goals.active)}
          hint={
            goals.averageProgress !== null
              ? `${goals.averageProgress}% avg progress`
              : `${goals.completed} completed`
          }
        />
      </div>
    </Card>
  );
}
