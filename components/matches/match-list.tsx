"use client";

import Link from "next/link";
import { useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  emptyCardClassName,
  formatDate,
  formatLabel,
  sectionHeadingClassName,
} from "@/components/ui/form-styles";
import { StatTile } from "@/components/ui/stat-tile";
import { TrendIndicator } from "@/components/ui/trend-indicator";
import { deleteMatch } from "@/lib/matches/actions";
import {
  getMatchRollingBaselines,
  getMetricContext,
} from "@/lib/stats/trends";
import { formatMatchFormat, type Match } from "@/types/match";

type MatchListProps = {
  matches: Match[];
};

export function MatchList({ matches }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <Card
        title="Past matches"
        description="Saved performances will appear here."
        className={emptyCardClassName}
      >
        <p className="text-sm leading-relaxed text-muted">
          No match performances yet. Tap Add Match to log your first innings.
        </p>
      </Card>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className={sectionHeadingClassName}>Past matches</h2>
        <p className="mt-1.5 text-sm text-muted">
          {matches.length} saved {matches.length === 1 ? "match" : "matches"}
        </p>
      </div>

      <ul className="space-y-4">
        {matches.map((match) => (
          <MatchListItem key={match.id} match={match} allMatches={matches} />
        ))}
      </ul>
    </section>
  );
}

function MatchListItem({
  match,
  allMatches,
}: {
  match: Match;
  allMatches: Match[];
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm("Delete this match?")) {
      return;
    }

    startTransition(async () => {
      await deleteMatch(match.id);
    });
  }

  const strikeRateDisplay =
    match.strike_rate !== null ? match.strike_rate.toFixed(2) : "—";

  const baselines = getMatchRollingBaselines(allMatches, match.id);
  const ballsContext = getMetricContext(match.balls_faced, baselines.ballsFacedBaseline);
  const strikeRateContext = getMetricContext(
    match.strike_rate,
    baselines.strikeRateBaseline,
  );

  return (
    <li>
      <Card padding="sm">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-muted">{formatDate(match.played_on)}</p>
            {match.format ? (
              <Badge variant="muted">{formatMatchFormat(match.format)}</Badge>
            ) : null}
          </div>

          {match.opposition ? (
            <p className="text-base font-bold text-foreground">vs {match.opposition}</p>
          ) : null}

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatTile compact label="Runs" value={String(match.runs ?? 0)} />
            <StatTile
              compact
              label="Balls"
              value={match.balls_faced !== null ? String(match.balls_faced) : "—"}
              hint={
                ballsContext ? (
                  <TrendIndicator
                    direction={ballsContext.direction}
                    label={ballsContext.label}
                  />
                ) : undefined
              }
            />
            <StatTile
              compact
              label="4s / 6s"
              value={`${match.fours ?? 0}/${match.sixes ?? 0}`}
            />
            <StatTile
              compact
              label="SR"
              value={strikeRateDisplay}
              accent
              hint={
                strikeRateContext ? (
                  <TrendIndicator
                    direction={strikeRateContext.direction}
                    label={strikeRateContext.label}
                  />
                ) : undefined
              }
            />
          </div>

          {match.dismissal_type ? (
            <p className="text-sm text-muted">
              Dismissal:{" "}
              <span className="font-medium text-foreground">
                {formatLabel(match.dismissal_type)}
              </span>
            </p>
          ) : null}

          {match.wickets !== null ||
          match.overs_bowled !== null ||
          match.runs_conceded !== null ? (
            <p className="text-sm text-muted">
              Bowling:{" "}
              <span className="font-medium text-foreground">
                {match.wickets ?? 0}/{match.overs_bowled ?? "—"} ov
                {match.runs_conceded !== null
                  ? ` · ${match.runs_conceded} runs`
                  : ""}
              </span>
            </p>
          ) : null}

          {match.notes ? (
            <p className="text-sm leading-relaxed text-muted">{match.notes}</p>
          ) : null}

          <div className="flex gap-2 pt-1">
            <Link href={`/matches/${match.id}/edit`}>
              <Button variant="secondary" size="sm">
                Edit
              </Button>
            </Link>
            <Button variant="danger" size="sm" onClick={handleDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Card>
    </li>
  );
}
