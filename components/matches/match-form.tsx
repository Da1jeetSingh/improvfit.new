"use client";

import { useActionState, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  formatLabel,
  inputClassName,
  labelClassName,
} from "@/components/ui/form-styles";
import {
  createMatch,
  updateMatch,
  type MatchActionState,
} from "@/lib/matches/actions";
import { cn } from "@/lib/utils";
import {
  dismissalTypes,
  matchLevels,
  opponentTypes,
  type Match,
} from "@/types/match";

const initialState: MatchActionState = {};

type MatchFormProps = {
  match?: Match;
};

function computeStrikeRate(runs: number, balls: number) {
  if (!balls) {
    return null;
  }

  return Math.round((runs / balls) * 10000) / 100;
}

export function MatchForm({ match }: MatchFormProps) {
  const action = match ? updateMatch : createMatch;
  const [state, formAction, isPending] = useActionState(action, initialState);

  const [runs, setRuns] = useState(String(match?.runs ?? ""));
  const [ballsFaced, setBallsFaced] = useState(String(match?.balls_faced ?? ""));

  const strikeRate = useMemo(() => {
    const runsValue = runs.trim() === "" ? null : Number(runs);
    const ballsValue = ballsFaced.trim() === "" ? null : Number(ballsFaced);

    if (
      runsValue === null ||
      ballsValue === null ||
      !Number.isFinite(runsValue) ||
      !Number.isFinite(ballsValue)
    ) {
      return null;
    }

    return computeStrikeRate(runsValue, ballsValue);
  }, [runs, ballsFaced]);

  return (
    <form action={formAction} className="space-y-6">
      {match ? <input type="hidden" name="match_id" value={match.id} /> : null}

      <Card
        title={match ? "Edit match" : "Log a match"}
        description="Add your batting performance. Strike rate is calculated from runs and balls."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="played_on" className={labelClassName}>
              Date
            </label>
            <input
              id="played_on"
              name="played_on"
              type="date"
              required
              defaultValue={match?.played_on ?? ""}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="match_level" className={labelClassName}>
              Match level
            </label>
            <select
              id="match_level"
              name="match_level"
              defaultValue={match?.match_level ?? ""}
              className={inputClassName}
            >
              <option value="">Select level</option>
              {matchLevels.map((level) => (
                <option key={level} value={level}>
                  {formatLabel(level)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="opponent_type" className={labelClassName}>
              Opponent type
            </label>
            <select
              id="opponent_type"
              name="opponent_type"
              defaultValue={match?.opponent_type ?? ""}
              className={inputClassName}
            >
              <option value="">Select type</option>
              {opponentTypes.map((type) => (
                <option key={type} value={type}>
                  {formatLabel(type)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="runs" className={labelClassName}>
              Runs scored
            </label>
            <input
              id="runs"
              name="runs"
              type="number"
              min={0}
              inputMode="numeric"
              value={runs}
              onChange={(event) => setRuns(event.target.value)}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="balls_faced" className={labelClassName}>
              Balls faced
            </label>
            <input
              id="balls_faced"
              name="balls_faced"
              type="number"
              min={0}
              inputMode="numeric"
              value={ballsFaced}
              onChange={(event) => setBallsFaced(event.target.value)}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="strike_rate_display" className={labelClassName}>
              Strike rate
            </label>
            <input
              id="strike_rate_display"
              type="text"
              readOnly
              value={strikeRate === null ? "" : strikeRate.toFixed(2)}
              className={cn(inputClassName, "bg-zinc-50 text-zinc-600")}
            />
          </div>

          <div>
            <label htmlFor="dismissal_type" className={labelClassName}>
              Dismissal type
            </label>
            <select
              id="dismissal_type"
              name="dismissal_type"
              defaultValue={match?.dismissal_type ?? ""}
              className={inputClassName}
            >
              <option value="">Select dismissal</option>
              {dismissalTypes.map((type) => (
                <option key={type} value={type}>
                  {formatLabel(type)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fours" className={labelClassName}>
              Fours
            </label>
            <input
              id="fours"
              name="fours"
              type="number"
              min={0}
              inputMode="numeric"
              defaultValue={match?.fours ?? ""}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="sixes" className={labelClassName}>
              Sixes
            </label>
            <input
              id="sixes"
              name="sixes"
              type="number"
              min={0}
              inputMode="numeric"
              defaultValue={match?.sixes ?? ""}
              className={inputClassName}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="notes" className={labelClassName}>
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={match?.notes ?? ""}
              placeholder="Pitch conditions, what went well, what to improve..."
              className={cn(inputClassName, "resize-y")}
            />
          </div>
        </div>
      </Card>

      {state.error ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}

      {state.message ? (
        <p className="text-sm text-emerald-700" role="status">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} fullWidth className="sm:w-auto">
        {isPending ? "Saving..." : match ? "Update match" : "Save match"}
      </Button>
    </form>
  );
}
