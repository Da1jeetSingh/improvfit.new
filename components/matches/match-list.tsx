"use client";

import Link from "next/link";
import { useTransition } from "react";

import { Card } from "@/components/ui/card";
import { formatDate, formatLabel } from "@/components/ui/form-styles";
import { deleteMatch } from "@/lib/matches/actions";
import { cn } from "@/lib/utils";
import type { Match } from "@/types/match";

type MatchListProps = {
  matches: Match[];
};

export function MatchList({ matches }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <Card title="Your matches" description="Saved performances will appear here.">
        <p className="text-sm text-zinc-500">No matches logged yet.</p>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Your matches</h2>
        <p className="mt-1 text-sm text-zinc-500">
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
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-zinc-900">
                {formatDate(match.played_on)}
              </p>
              {match.match_level ? (
                <span className="rounded-full bg-green-muted px-2.5 py-0.5 text-xs font-medium text-green-deep">
                  {formatLabel(match.match_level)}
                </span>
              ) : null}
              {match.opponent_type ? (
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
                  {formatLabel(match.opponent_type)}
                </span>
              ) : null}
            </div>

            <p className="text-sm text-zinc-600">
              {match.runs ?? 0} runs
              {match.balls_faced !== null ? ` off ${match.balls_faced} balls` : ""}
              {match.strike_rate !== null ? ` · SR ${match.strike_rate}` : ""}
            </p>

            <p className="text-sm text-zinc-500">
              {match.fours ?? 0} fours · {match.sixes ?? 0} sixes
              {match.dismissal_type
                ? ` · ${formatLabel(match.dismissal_type)}`
                : ""}
            </p>

            {match.notes ? (
              <p className="text-sm text-zinc-600">{match.notes}</p>
            ) : null}
          </div>

          <div className="flex gap-2">
            <Link
              href={`/matches/${match.id}/edit`}
              className={cn(
                "rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700",
                "hover:bg-zinc-50",
              )}
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className={cn(
                "rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700",
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
