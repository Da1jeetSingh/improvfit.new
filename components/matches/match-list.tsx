"use client";

import Link from "next/link";
import { useTransition } from "react";

import { Card } from "@/components/ui/card";
import { formatDate, formatLabel } from "@/components/ui/form-styles";
import { deleteMatch } from "@/lib/matches/actions";
import { cn } from "@/lib/utils";
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
        className="border-dashed"
      >
        <p className="text-sm text-muted">
          No match performances yet. Log your first innings above — even a
          practice knock counts.
        </p>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Your matches</h2>
        <p className="mt-1 text-sm text-muted">
          {matches.length} saved {matches.length === 1 ? "match" : "matches"}
        </p>
      </div>

      <ul className="space-y-3">
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-foreground">
                {formatDate(match.played_on)}
              </p>
              {match.format ? (
                <span className="rounded-full bg-green-muted px-2.5 py-0.5 text-xs font-medium text-green-deep">
                  {formatMatchFormat(match.format)}
                </span>
              ) : null}
            </div>

            {match.opposition ? (
              <p className="text-sm font-medium text-foreground">
                vs {match.opposition}
              </p>
            ) : null}

            <p className="text-sm text-muted">
              {match.runs ?? 0} runs
              {match.balls_faced !== null ? ` off ${match.balls_faced} balls` : ""}
              {match.strike_rate !== null ? ` · SR ${match.strike_rate}` : ""}
            </p>

            <p className="text-sm text-muted">
              {match.fours ?? 0} fours · {match.sixes ?? 0} sixes
              {match.dismissal_type
                ? ` · ${formatLabel(match.dismissal_type)}`
                : ""}
            </p>

            {match.notes ? (
              <p className="text-sm text-foreground">{match.notes}</p>
            ) : null}
          </div>

          <div className="flex gap-2">
            <Link
              href={`/matches/${match.id}/edit`}
              className={cn(
                "rounded-xl border-2 border-border px-3 py-1.5 text-sm font-semibold text-foreground",
                "hover:bg-green-muted",
              )}
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className={cn(
                "rounded-xl border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-700",
                "hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60",
              )}
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Card>
    </li>
  );
}
