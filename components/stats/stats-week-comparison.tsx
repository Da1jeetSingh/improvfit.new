import { Card } from "@/components/ui/card";
import { StatTile } from "@/components/ui/stat-tile";
import {
  showsBattingLogFields,
  showsBowlingLogFields,
} from "@/lib/logging/role-fields";
import {
  formatWeekTrend,
  type RoleProgressStats,
} from "@/lib/stats/progress";

type StatsWeekComparisonProps = {
  progress: RoleProgressStats;
};

export function StatsWeekComparison({ progress }: StatsWeekComparisonProps) {
  const { role, batting, bowling, training } = progress;

  return (
    <Card
      title="This week vs last week"
      description="Calendar week comparison from your logged activity."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <StatTile
          compact
          label="Training sessions"
          value={String(training.weekSessions.thisWeek)}
          hint={formatWeekTrend(
            training.weekSessions.thisWeek,
            training.weekSessions.lastWeek,
          )}
        />

        {showsBattingLogFields(role) && batting ? (
          <>
            <StatTile
              compact
              label="Runs scored"
              value={String(batting.weekRuns.thisWeek)}
              hint={formatWeekTrend(
                batting.weekRuns.thisWeek,
                batting.weekRuns.lastWeek,
              )}
            />
            <StatTile
              compact
              label="Matches played"
              value={String(batting.weekMatches.thisWeek)}
              hint={formatWeekTrend(
                batting.weekMatches.thisWeek,
                batting.weekMatches.lastWeek,
              )}
            />
          </>
        ) : null}

        {showsBowlingLogFields(role) && bowling ? (
          <>
            <StatTile
              compact
              label="Wickets taken"
              value={String(bowling.weekWickets.thisWeek)}
              hint={formatWeekTrend(
                bowling.weekWickets.thisWeek,
                bowling.weekWickets.lastWeek,
              )}
            />
            <StatTile
              compact
              label="Overs bowled"
              value={String(bowling.weekOvers.thisWeek)}
              hint={formatWeekTrend(
                bowling.weekOvers.thisWeek,
                bowling.weekOvers.lastWeek,
              )}
            />
          </>
        ) : null}
      </div>
    </Card>
  );
}
