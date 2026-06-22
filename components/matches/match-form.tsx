"use client";

import { useActionState, useMemo, useState } from "react";

import { AchievementUnlockToast } from "@/components/achievements/achievement-unlock-toast";
import { CoachMessageCard } from "@/components/coach/coach-message-card";
import { useCoachSaveFeedback } from "@/components/coach/use-coach-save-feedback";
import { SaveInsightCard } from "@/components/save/save-insight-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import {
  alertErrorClassName,
  alertSuccessClassName,
  formatLabel,
  highlightValueClassName,
  inputClassName,
  labelClassName,
} from "@/components/ui/form-styles";
import {
  showsBattingLogFields,
  showsBowlingLogFields,
} from "@/lib/logging/role-fields";
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
import type { PlayerRole } from "@/types/profile";

const initialState: MatchActionState = {};

type MatchFormProps = {
  match?: Match;
  role?: PlayerRole | null;
  variant?: "page" | "modal";
  onSuccess?: () => void;
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

export function MatchForm({
  match,
  role = null,
  variant = "page",
  onSuccess,
}: MatchFormProps) {
  const action = match ? updateMatch : createMatch;
  const [state, formAction, isPending] = useActionState(action, initialState);

  const [runs, setRuns] = useState(String(match?.runs ?? ""));
  const [ballsFaced, setBallsFaced] = useState(String(match?.balls_faced ?? ""));

  const showBatting = match ? true : showsBattingLogFields(role);
  const showBowling = match ? true : showsBowlingLogFields(role);

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

  useCoachSaveFeedback({
    coachMessage: state.coachMessage,
    achievementUnlocks: state.achievementUnlocks,
    saveInsight: state.saveInsight,
    fallbackMessage: state.message,
    variant,
    onSuccess,
  });

  const fields = (
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

      {showBatting ? (
        <>
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
              <p className="text-3xl font-bold tracking-tight text-green-deep">
                {strikeRate === null ? "—" : strikeRate.toFixed(2)}
              </p>
            </div>
          </div>
        </>
      ) : null}

      {showBowling ? (
        <>
          <div>
            <label htmlFor="wickets" className={labelClassName}>
              Wickets
            </label>
            <input
              id="wickets"
              name="wickets"
              type="number"
              min={0}
              inputMode="numeric"
              defaultValue={match?.wickets ?? ""}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="overs_bowled" className={labelClassName}>
              Overs bowled
            </label>
            <input
              id="overs_bowled"
              name="overs_bowled"
              type="number"
              min={0}
              step={0.1}
              inputMode="decimal"
              defaultValue={match?.overs_bowled ?? ""}
              className={inputClassName}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="runs_conceded" className={labelClassName}>
              Runs conceded
            </label>
            <input
              id="runs_conceded"
              name="runs_conceded"
              type="number"
              min={0}
              inputMode="numeric"
              defaultValue={match?.runs_conceded ?? ""}
              className={inputClassName}
            />
          </div>
        </>
      ) : null}

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
  );

  return (
    <form action={formAction} className="space-y-5">
      {match ? <input type="hidden" name="match_id" value={match.id} /> : null}

      {variant === "page" ? (
        <Card
          badge="Match entry"
          title={match ? "Edit match" : "Log match performance"}
          description="Record your match performance with the fields that matter for your role."
        >
          {fields}
        </Card>
      ) : (
        fields
      )}

      {state.error ? (
        <p className={alertErrorClassName} role="alert">
          {state.error}
        </p>
      ) : null}

      {state.achievementUnlocks?.length ? (
        <AchievementUnlockToast unlocks={state.achievementUnlocks} compact />
      ) : null}

      {state.saveInsight ? (
        <SaveInsightCard insight={state.saveInsight} compact />
      ) : null}

      {state.coachMessage ? (
        <CoachMessageCard
          message={{ text: state.coachMessage, label: "Coach" }}
          compact
        />
      ) : null}

      {state.message &&
      variant === "page" &&
      !state.coachMessage &&
      !state.achievementUnlocks?.length ? (
        <p className={alertSuccessClassName} role="status">
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={
          isPending ||
          Boolean(
            (state.coachMessage ||
              state.achievementUnlocks?.length ||
              state.saveInsight) &&
              variant === "modal",
          )
        }
        fullWidth={variant === "modal"}
      >
        {isPending ? "Saving..." : match ? "Update match" : "Save match"}
      </Button>
    </form>
  );
}

type AddMatchButtonProps = {
  role: PlayerRole | null;
};

export function AddMatchButton({ role }: AddMatchButtonProps) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function handleSuccess() {
    setOpen(false);
    setFormKey((current) => current + 1);
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Add Match
      </Button>

      <Modal
        open={open}
        title="Add Match"
        description="Log a match performance with fields tailored to your role."
        onClose={() => setOpen(false)}
      >
        <MatchForm
          key={formKey}
          role={role}
          variant="modal"
          onSuccess={handleSuccess}
        />
      </Modal>
    </>
  );
}
