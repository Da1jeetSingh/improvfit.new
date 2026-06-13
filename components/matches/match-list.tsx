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
import { deleteMatch } from "@/lib/matches/actions";
import { formatMatchFormat, type Match } from "@/types/match";

type MatchListProps = {
  matches: Match[];
};

export function MatchList({ matches }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <Card
        title="Your matches"
        description="Saved performances will appear here."
        className={emptyCardClassName}
      >
        <p className="text-sm leading-relaxed text-muted">
          No match performances yet. Log your first innings above — even a
          practice knock counts.
        </p>
      </Card>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className={sectionHeadingClassName}>Your matches</h2>
        <p className="mt-1.5 text-sm text-muted">
          {matches.length} saved {matches.length === 1 ? "match" : "matches"}
        </p>
      </div>

      <ul className="space-y-4">
        {matches.map((match) => (
          <MatchListItem key={match.id} match={match} />
        ))}
      </ul>
    </section>
  );
}

function MatchListItem({ match }: { match: Match }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm("Delete this match?")) {
      return;
    }

    startTransition(async () => {
      await deleteMatch(match.id);
    });
  }

  return (
    <li>
      <Card padding="sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold text-foreground">{formatDate(match.played_on)}</p>
              {match.format ? (
                <Badge variant="success">{formatMatchFormat(match.format)}</Badge>
              ) : null}
            </div>

            {match.opposition ? (
              <p className="text-sm font-semibold text-foreground">vs {match.opposition}</p>
            ) : null}

            <p className="text-sm text-muted">
              <span className="font-bold text-foreground">{match.runs ?? 0}</span> runs
              {match.balls_faced !== null ? ` off ${match.balls_faced} balls` : ""}
              {match.strike_rate !== null ? ` · SR ${match.strike_rate}` : ""}
            </p>

            <p className="text-sm text-muted">
              {match.fours ?? 0} fours · {match.sixes ?? 0} sixes
              {match.dismissal_type ? ` · ${formatLabel(match.dismissal_type)}` : ""}
            </p>

            {match.notes ? (
              <p className="text-sm leading-relaxed text-foreground">{match.notes}</p>
            ) : null}
          </div>

          <div className="flex gap-2">
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
