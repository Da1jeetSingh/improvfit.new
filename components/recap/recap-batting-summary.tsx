import { CoachMessageCard } from "@/components/coach/coach-message-card";
import { Card } from "@/components/ui/card";
import { StatTile } from "@/components/ui/stat-tile";
import { formatDate } from "@/components/ui/form-styles";
import type { MonthlyRecap } from "@/lib/recap/calculate";

type RecapBattingSummaryProps = {
  recap: MonthlyRecap;
};

export function RecapBattingSummary({ recap }: RecapBattingSummaryProps) {
  const batting = recap.batting;

  if (!batting) {
    return null;
  }

  return (
    <Card
      title="Batting summary"
      description={`Your batting numbers for ${recap.monthLabel}.`}
      badge="Batting"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile compact label="Total runs" value={String(batting.totalRuns)} accent />
        <StatTile compact label="Matches played" value={String(batting.matchesPlayed)} />
        <StatTile
          compact
          label="Average"
          value={batting.battingAverage !== null ? String(batting.battingAverage) : "—"}
        />
        <StatTile
          compact
          label="Strike rate"
          value={batting.strikeRate !== null ? batting.strikeRate.toFixed(1) : "—"}
        />
        <StatTile
          compact
          label="Best match"
          value={`${batting.bestMatch?.runs ?? 0} runs`}
          hint={
            batting.bestMatch?.opposition
              ? `vs ${batting.bestMatch.opposition} · ${formatDate(batting.bestMatch.playedOn)}`
              : batting.bestMatch
                ? formatDate(batting.bestMatch.playedOn)
                : undefined
          }
        />
        <StatTile
          compact
          label="Weakest trend"
          value={batting.weakestTrend ?? "None flagged"}
          hint={batting.weakestTrend ? "Area to address" : "Form holding steady"}
        />
      </div>

      <div className="mt-4">
        <CoachMessageCard
          message={{ label: "Coach insight", text: batting.coachingInsight }}
          compact
        />
      </div>
    </Card>
  );
}
