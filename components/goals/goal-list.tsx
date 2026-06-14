"use client";

import Link from "next/link";
import { useTransition } from "react";

import { GoalProgress } from "@/components/goals/goal-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  emptyCardClassName,
  formatDate,
  formatLabel,
  sectionHeadingClassName,
} from "@/components/ui/form-styles";
import { deleteGoal } from "@/lib/goals/actions";
import {
  calculateGoalProgress,
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
        className={emptyCardClassName}
      >
        <p className="text-sm leading-relaxed text-muted">
          No goals yet. Create your first target above — batting, bowling,
          fitness, or anything you want to improve.
        </p>
      </Card>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className={sectionHeadingClassName}>Your goals</h2>
        <p className="mt-1.5 text-sm text-muted">
          {goals.length} saved {goals.length === 1 ? "goal" : "goals"}
        </p>
      </div>

      <ul className="space-y-4">
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
  const progress = calculateGoalProgress(goal);

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
        <div className="space-y-5">
          <div className="flex gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-deep text-white"
              aria-hidden
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="8" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-foreground">{goal.title}</h3>
                {progress !== null ? (
                  <span className="shrink-0 text-xs font-medium text-muted">
                    {progress}% complete
                  </span>
                ) : null}
              </div>

              {goal.current_value !== null && goal.target_value !== null ? (
                <p className="mt-1 text-sm text-muted">
                  {goal.current_value} / {goal.target_value}
                </p>
              ) : null}

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    goal.status === "completed"
                      ? "success"
                      : goal.status === "in_progress"
                        ? "default"
                        : "muted"
                  }
                >
                  {formatLabel(goal.status)}
                </Badge>
                {goal.category ? (
                  <Badge variant="success">{formatGoalCategory(goal.category)}</Badge>
                ) : null}
                {overdue ? <Badge variant="danger">Overdue</Badge> : null}
              </div>

              {goal.description ? (
                <p className="mt-3 text-sm leading-relaxed text-muted">{goal.description}</p>
              ) : null}

              {target ? (
                <p className="mt-2 text-sm font-medium text-foreground">Target: {target}</p>
              ) : null}

              {goal.due_date ? (
                <p className="mt-1 text-sm text-muted">Deadline: {formatDate(goal.due_date)}</p>
              ) : null}
            </div>
          </div>

          <GoalProgress goal={goal} showLabel={false} />

          <div className="flex gap-2">
            <Link href={`/goals/${goal.id}/edit`}>
              <Button variant="secondary" size="sm">
                Edit
              </Button>
            </Link>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Card>
    </li>
  );
}
