"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  alertErrorClassName,
  alertSuccessClassName,
  formatLabel,
  inputClassName,
  labelClassName,
} from "@/components/ui/form-styles";
import {
  createGoal,
  updateGoal,
  type GoalActionState,
} from "@/lib/goals/actions";
import { cn } from "@/lib/utils";
import { goalCategories, goalStatuses, formatGoalCategory, type Goal } from "@/types/goal";

const initialState: GoalActionState = {};

type GoalFormProps = {
  goal?: Goal;
};

export function GoalForm({ goal }: GoalFormProps) {
  const action = goal ? updateGoal : createGoal;
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {goal ? <input type="hidden" name="goal_id" value={goal.id} /> : null}

      <Card
        title={goal ? "Edit goal" : "Create a goal"}
        description="Set a target and track your progress over time."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className={labelClassName}>
              Goal title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Example: Score 300 runs this month"
              defaultValue={goal?.title ?? ""}
              className={inputClassName}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className={labelClassName}>
              Goal description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="What does success look like for this goal?"
              defaultValue={goal?.description ?? ""}
              className={cn(inputClassName, "resize-y")}
            />
          </div>

          <div>
            <label htmlFor="category" className={labelClassName}>
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={goal?.category ?? ""}
              className={inputClassName}
            >
              <option value="">Select category</option>
              {goalCategories.map((category) => (
                <option key={category} value={category}>
                  {formatGoalCategory(category)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="due_date" className={labelClassName}>
              Deadline date
            </label>
            <input
              id="due_date"
              name="due_date"
              type="date"
              defaultValue={goal?.due_date ?? ""}
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
              defaultValue={goal?.target_value ?? ""}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="target_outcome" className={labelClassName}>
              Target outcome
            </label>
            <input
              id="target_outcome"
              name="target_outcome"
              type="text"
              placeholder="Example: Make the 1st XI"
              defaultValue={goal?.target_outcome ?? ""}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="current_value" className={labelClassName}>
              Current progress value
            </label>
            <input
              id="current_value"
              name="current_value"
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              defaultValue={goal?.current_value ?? 0}
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
              defaultValue={goal?.status ?? "not_started"}
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
        <p className={alertErrorClassName} role="alert">
          {state.error}
        </p>
      ) : null}

      {state.message ? (
        <p className={alertSuccessClassName} role="status">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} fullWidth className="sm:w-auto">
        {isPending ? "Saving..." : goal ? "Update goal" : "Create goal"}
      </Button>
    </form>
  );
}
