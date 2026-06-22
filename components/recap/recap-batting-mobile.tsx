import Link from "next/link";

import { CoachMessageCard } from "@/components/coach/coach-message-card";
import { Card } from "@/components/ui/card";
import { StatTile } from "@/components/ui/stat-tile";
import { actionLinkClassName, formatDate } from "@/components/ui/form-styles";
import type { MonthlyRecap } from "@/lib/recap/calculate";

type RecapBattingMobileProps = {
  recap: MonthlyRecap;
};

export function RecapBattingMobile({ recap }: RecapBattingMobileProps) {
  const batting = recap.batting;

  if (!batting) {
    return (
      <section className="lg:hidden">
        <Card
          title="Monthly recap"
          description={`${recap.monthLabel} — log a match to unlock your batting summary.`}
        >
          <p className="text-sm leading-relaxed text-muted">
            Your progress summary appears here once you log match performances this month.
          </p>
          <Link href="/recap" className={`${actionLinkClassName} mt-4 inline-flex`}>
            View recap
          </Link>
        </Card>
      </section>
    );
  }

  return (
    <section className="lg:hidden">
      <Card
        title="Monthly recap"
        description={`${recap.monthLabel} batting summary`}
        badge="This month"
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <StatTile compact label="Total runs" value={String(batting.totalRuns)} accent />
          <StatTile compact label="Matches" value={String(batting.matchesPlayed)} />
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
                ? `vs ${batting.bestMatch.opposition}`
                : batting.bestMatch
                  ? formatDate(batting.bestMatch.playedOn)
                  : undefined
            }
          />
          <StatTile
            compact
            label="Weakest trend"
            value={batting.weakestTrend ?? "None flagged"}
            hint={batting.weakestTrend ? "Worth a closer look" : "Form holding steady"}
          />
        </div>

        <div className="mt-4">
          <CoachMessageCard
            message={{ label: "Coach", text: batting.coachingInsight }}
            compact
          />
        </div>

        <Link href="/recap" className={`${actionLinkClassName} mt-4 inline-flex`}>
          Full monthly recap
        </Link>
      </Card>
    </section>
  );
}
