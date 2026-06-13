"use client";

import { useActionState, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  alertErrorClassName,
  alertSuccessClassName,
  formatLabel,
  highlightValueClassName,
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
  formatMatchFormat,
  matchFormats,
  type Match,
} from "@/types/match";

const initialState: MatchActionState = {};

type MatchFormProps = {
  match?: Match;
};

function todayDateValue() {
  return new Date().toISOString().slice(0, 10);
}

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
        badge="Match entry"
        title={match ? "Edit match" : "Log batting performance"}
        description="Record your batting performance from a game or practice match."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="played_on" className={labelClassName}>
              Match date
            </label>
            <input
              id="played_on"
              name="played_on"
              type="date"
              required
              defaultValue={match?.played_on ?? todayDateValue()}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="format" className={labelClassName}>
              Format
            </label>
            <select
              id="format"
              name="format"
              defaultValue={match?.format ?? ""}
              className={inputClassName}
            >
              <option value="">Select format</option>
              {matchFormats.map((format) => (
                <option key={format} value={format}>
                  {formatMatchFormat(format)}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="opposition" className={labelClassName}>
              Opponent
            </label>
            <input
              id="opposition"
              name="opposition"
              type="text"
              placeholder="Team or club name"
              defaultValue={match?.opposition ?? ""}
              className={inputClassName}
            />
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

          <div className="sm:col-span-2">
            <p className={labelClassName}>Auto strike rate</p>
            <div className={highlightValueClassName}>
              <p className="text-4xl font-bold tracking-tight text-green-deep">
                {strikeRate === null ? "—" : strikeRate.toFixed(2)}
              </p>
            </div>
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
        <p className={alertErrorClassName} role="alert">
          {state.error}
        </p>
      ) : null}

      {state.message ? (
        <p className={alertSuccessClassName} role="status">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} fullWidth>
        {isPending ? "Saving..." : match ? "Update match" : "+ Add match"}
      </Button>
    </form>
  );
}
