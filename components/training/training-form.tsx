"use client";

import { useActionState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  formatLabel,
  inputClassName,
  labelClassName,
} from "@/components/ui/form-styles";
import {
  createTrainingSession,
  type TrainingActionState,
} from "@/lib/training/actions";
import { cn } from "@/lib/utils";
import { focusAreas, selfRatings } from "@/types/training";

const initialState: TrainingActionState = {};

function todayDateValue() {
  return new Date().toISOString().slice(0, 10);
}

export function TrainingForm() {
  const [state, formAction, isPending] = useActionState(
    createTrainingSession,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <Card
        title="Log training"
        description="Record a practice session in under a minute."
      >
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

          <div>
            <label htmlFor="focus" className={labelClassName}>
              Focus area
            </label>
            <select
              id="focus"
              name="focus"
              required
              defaultValue=""
              className={inputClassName}
            >
              <option value="" disabled>
                Select focus
              </option>
              {focusAreas.map((area) => (
                <option key={area} value={area}>
                  {formatLabel(area)}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
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
      </Card>

      {state.error ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}

      {state.message ? (
        <p className="text-sm text-green-deep" role="status">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} fullWidth className="sm:w-auto">
        {isPending ? "Saving..." : "Save session"}
      </Button>
    </form>
  );
}
