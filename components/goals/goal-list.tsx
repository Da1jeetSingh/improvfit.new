"use client";

import { useActionState, useTransition } from "react";

import { GoalProgress } from "@/components/goals/goal-progress";
import { Card } from "@/components/ui/card";
import {
  formatDate,
  formatLabel,
  inputClassName,
  labelClassName,
} from "@/components/ui/form-styles";
import {
  deleteGoal,
  updateGoalProgress,
  type GoalActionState,
} from "@/lib/goals/actions";
import { cn } from "@/lib/utils";
import { goalStatuses, isGoalOverdue, type Goal } from "@/types/goal";

type GoalListProps = {
  goals: Goal[];
};

const initialState: GoalActionState = {};

export function GoalList({ goals }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <Card title="Your goals" description="Created goals will appear here.">
        <p className="text-sm text-zinc-500">No goals yet.</p>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Your goals</h2>
        <p className="mt-1 text-sm text-zinc-500">
          {goals.length} active {goals.length === 1 ? "goal" : "goals"}
        </p>
      </div>

      <ul className="space-y-3">
        {goals.map((goal) => (
          <GoalListItem key={goal.id} goal={goal} />
        ))}
      </ul>
    </section>
  );
}

function GoalListItem({ goal }: { goal: Goal }) {
  const [isDeleting, startDeleteTransition] = useTransition();
  const [state, formAction, isPending] = useActionState(
    updateGoalProgress,
    initialState,
  );

  const overdue = isGoalOverdue(goal);

  function handleDelete() {
    if (!window.confirm("Delete this goal?")) {
      return;
    }

    startDeleteTransition(async () => {
      await deleteGoal(goal.id);
    });
  }

  return (
    <li>
      <Card className="p-4 sm:p-5">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-zinc-900">{goal.title}</h3>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    goal.status === "completed"
                      ? "bg-emerald-50 text-emerald-800"
                      : goal.status === "in_progress"
                        ? "bg-sky-50 text-sky-800"
                        : "bg-zinc-100 text-zinc-700",
                  )}
                >
                  {formatLabel(goal.status)}
                </span>
                {overdue ? (
                  <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                    Overdue
                  </span>
                ) : null}
              </div>

              {goal.due_date ? (
                <p className="text-sm text-zinc-500">
                  Deadline: {formatDate(goal.due_date)}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className={cn(
                "self-start rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700",
                "hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60",
              )}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>

          <GoalProgress goal={goal} />

          <form action={formAction} className="grid gap-3 border-t border-zinc-100 pt-4 sm:grid-cols-3">
            <input type="hidden" name="goal_id" value={goal.id} />

            <div>
              <label htmlFor={`current_value_${goal.id}`} className={labelClassName}>
                Update current value
              </label>
              <input
                id={`current_value_${goal.id}`}
                name="current_value"
                type="number"
                min={0}
                step="any"
                inputMode="decimal"
                defaultValue={goal.current_value}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor={`status_${goal.id}`} className={labelClassName}>
                Status
              </label>
              <select
                id={`status_${goal.id}`}
                name="status"
                defaultValue={goal.status}
                className={inputClassName}
              >
                {goalStatuses.map((status) => (
                  <option key={status} value={status}>
                    {formatLabel(status)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isPending}
                className={cn(
                  "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700",
                  "hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60",
                )}
              >
                {isPending ? "Updating..." : "Update progress"}
              </button>
            </div>
          </form>

          {state.message ? (
            <p className="text-sm text-emerald-700" role="status">
              {state.message}
            </p>
          ) : null}

          {state.error ? (
            <p className="text-sm text-red-600" role="alert">
              {state.error}
            </p>
          ) : null}
        </div>
      </Card>
    </li>
  );
}
