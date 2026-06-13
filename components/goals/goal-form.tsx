"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  formatLabel,
  inputClassName,
  labelClassName,
} from "@/components/ui/form-styles";
import { createGoal, type GoalActionState } from "@/lib/goals/actions";
import { goalStatuses } from "@/types/goal";

const initialState: GoalActionState = {};

export function GoalForm() {
  const [state, formAction, isPending] = useActionState(createGoal, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <Card
        title="Create a goal"
        description="Set a target and track your progress over time."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className={labelClassName}>
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Example: Score 300 runs this month"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="target_value" className={labelClassName}>
              Target value
            </label>
            <input
              id="target_value"
              name="target_value"
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              placeholder="300"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="current_value" className={labelClassName}>
              Current value
            </label>
            <input
              id="current_value"
              name="current_value"
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              defaultValue={0}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="due_date" className={labelClassName}>
              Deadline
            </label>
            <input
              id="due_date"
              name="due_date"
              type="date"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="status" className={labelClassName}>
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue="not_started"
              className={inputClassName}
            >
              {goalStatuses.map((status) => (
                <option key={status} value={status}>
                  {formatLabel(status)}
                </option>
              ))}
            </select>
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
        {isPending ? "Saving..." : "Create goal"}
      </Button>
    </form>
  );
}
