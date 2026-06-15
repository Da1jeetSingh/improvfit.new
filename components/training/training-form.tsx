"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { CoachMessageCard } from "@/components/coach/coach-message-card";
import { useCoachSaveFeedback } from "@/components/coach/use-coach-save-feedback";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import {
  alertErrorClassName,
  alertSuccessClassName,
  formatLabel,
  inputClassName,
  labelClassName,
} from "@/components/ui/form-styles";
import {
  getDefaultTrainingFocus,
  getTrainingFocusOptions,
  showsBattingLogFields,
  showsBowlingLogFields,
} from "@/lib/logging/role-fields";
import {
  createTrainingSession,
  type TrainingActionState,
} from "@/lib/training/actions";
import { cn } from "@/lib/utils";
import { selfRatings } from "@/types/training";
import type { PlayerRole } from "@/types/profile";

const initialState: TrainingActionState = {};

type TrainingFormProps = {
  role?: PlayerRole | null;
  variant?: "page" | "modal";
  onSuccess?: () => void;
};

function todayDateValue() {
  return new Date().toISOString().slice(0, 10);
}

export function TrainingForm({
  role = null,
  variant = "page",
  onSuccess,
}: TrainingFormProps) {
  const [state, formAction, isPending] = useActionState(
    createTrainingSession,
    initialState,
  );

  const focusOptions = getTrainingFocusOptions(role);
  const defaultFocus = getDefaultTrainingFocus(role);
  const showBatting = showsBattingLogFields(role);
  const showBowling = showsBowlingLogFields(role);

  useCoachSaveFeedback({
    coachMessage: state.coachMessage,
    fallbackMessage: state.message,
    variant,
    onSuccess,
  });

  const fields = (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="session_date" className={labelClassName}>
          Date
        </label>
        <input
          id="session_date"
          name="session_date"
          type="date"
          required
          defaultValue={todayDateValue()}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="duration_minutes" className={labelClassName}>
          Duration (minutes)
        </label>
        <input
          id="duration_minutes"
          name="duration_minutes"
          type="number"
          min={1}
          inputMode="numeric"
          required
          placeholder="60"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="focus" className={labelClassName}>
          Focus area
        </label>
        <select
          id="focus"
          name="focus"
          required
          defaultValue={defaultFocus}
          className={inputClassName}
        >
          {focusOptions.map((area) => (
            <option key={area} value={area}>
              {formatLabel(area)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="self_rating" className={labelClassName}>
          Self-rating
        </label>
        <select
          id="self_rating"
          name="self_rating"
          defaultValue=""
          className={inputClassName}
        >
          <option value="">No rating</option>
          {selfRatings.map((rating) => (
            <option key={rating} value={rating}>
              {rating} / 5
            </option>
          ))}
        </select>
      </div>

      {showBatting ? (
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
            placeholder="Optional"
            className={inputClassName}
          />
        </div>
      ) : null}

      {showBowling ? (
        <>
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
              placeholder="Optional"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="balls_bowled" className={labelClassName}>
              Balls bowled
            </label>
            <input
              id="balls_bowled"
              name="balls_bowled"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Optional"
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
          placeholder="Drills, what clicked, what to repeat next time..."
          className={cn(inputClassName, "resize-y")}
        />
      </div>
    </div>
  );

  return (
    <form action={formAction} className="space-y-5">
      {variant === "page" ? (
        <Card
          badge="Session capture"
          title="Log today's work"
          description="Record a practice session in under a minute."
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

      {state.coachMessage ? (
        <CoachMessageCard
          message={{ text: state.coachMessage, label: "Coach" }}
          compact
        />
      ) : null}

      {state.message && variant === "page" && !state.coachMessage ? (
        <p className={alertSuccessClassName} role="status">
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isPending || Boolean(state.coachMessage && variant === "modal")}
        fullWidth={variant === "modal"}
      >
        {isPending ? "Saving..." : "Save session"}
      </Button>
    </form>
  );
}

type AddTrainingButtonProps = {
  role: PlayerRole | null;
};

export function AddTrainingButton({ role }: AddTrainingButtonProps) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function handleSuccess() {
    setOpen(false);
    setFormKey((current) => current + 1);
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Add Session
      </Button>

      <Modal
        open={open}
        title="Add Session"
        description="Log a training session with workload fields for your role."
        onClose={() => setOpen(false)}
      >
        <TrainingForm
          key={formKey}
          role={role}
          variant="modal"
          onSuccess={handleSuccess}
        />
      </Modal>
    </>
  );
}
