"use client";

import Link from "next/link";
import { useTransition } from "react";

import { GoalProgress } from "@/components/goals/goal-progress";
import { Card } from "@/components/ui/card";
import { formatDate, formatLabel } from "@/components/ui/form-styles";
import { deleteGoal } from "@/lib/goals/actions";
import { cn } from "@/lib/utils";
import {
  formatGoalCategory,
  formatGoalTarget,
  isGoalOverdue,
  type Goal,
} from "@/types/goal";

type GoalListProps = {
  goals: Goal[];
};

export function GoalList({ goals }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <Card
        title="Your goals"
        description="Created goals will appear here."
        className="border-dashed"
      >
        <p className="text-sm text-muted">
          No goals yet. Create your first target above — batting, bowling,
          fitness, or anything you want to improve.
        </p>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Your goals</h2>
        <p className="mt-1 text-sm text-muted">
          {goals.length} saved {goals.length === 1 ? "goal" : "goals"}
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
  const overdue = isGoalOverdue(goal);
  const target = formatGoalTarget(goal);

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
      <Card padding="sm">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-foreground">{goal.title}</h3>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    goal.status === "completed"
                      ? "bg-green-muted text-green-deep"
                      : goal.status === "in_progress"
                        ? "bg-green-muted text-foreground"
                        : "bg-green-muted/50 text-muted",
                  )}
                >
                  {formatLabel(goal.status)}
                </span>
                {goal.category ? (
                  <span className="rounded-full bg-green-muted px-2.5 py-0.5 text-xs font-medium text-green-deep">
                    {formatGoalCategory(goal.category)}
                  </span>
                ) : null}
                {overdue ? (
                  <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                    Overdue
                  </span>
                ) : null}
              </div>

              {goal.description ? (
                <p className="text-sm text-muted">{goal.description}</p>
              ) : null}

              {target ? (
                <p className="text-sm text-foreground">
                  Target: {target}
                </p>
              ) : null}

              {goal.due_date ? (
                <p className="text-sm text-muted">
                  Deadline: {formatDate(goal.due_date)}
                </p>
              ) : null}
            </div>

            <div className="flex gap-2">
              <Link
                href={`/goals/${goal.id}/edit`}
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
                disabled={isDeleting}
                className={cn(
                  "rounded-xl border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-700",
                  "hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60",
                )}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>

          <GoalProgress goal={goal} />
        </div>
      </Card>
    </li>
  );
}
