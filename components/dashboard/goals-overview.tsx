import Link from "next/link";

import { GoalProgress } from "@/components/goals/goal-progress";
import { Card } from "@/components/ui/card";
import { formatLabel } from "@/components/ui/form-styles";
import type { GoalSummary } from "@/lib/dashboard/metrics";
import { cn } from "@/lib/utils";

type GoalsOverviewProps = {
  goalsTotal: number;
  goalsCompleted: number;
  averageGoalProgress: number | null;
  goalSummaries: GoalSummary[];
};

export function GoalsOverview({
  goalsTotal,
  goalsCompleted,
  averageGoalProgress,
  goalSummaries,
}: GoalsOverviewProps) {
  if (goalsTotal === 0) {
    return (
      <Card
        title="Goal progress"
        description="Track how close you are to your targets."
      >
        <p className="text-sm text-zinc-500">No goals created yet.</p>
        <Link
          href="/goals"
          className="mt-3 inline-block text-sm font-medium text-emerald-700 hover:underline"
        >
          Create your first goal →
        </Link>
      </Card>
    );
  }

  return (
    <Card
      title="Goal progress"
      description={`${goalsCompleted} of ${goalsTotal} completed`}
    >
      <div className="mb-6 flex flex-wrap gap-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Average progress
          </p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">
            {averageGoalProgress === null ? "—" : `${averageGoalProgress}%`}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Completed
          </p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">
            {goalsCompleted}
          </p>
        </div>
      </div>

      <ul className="space-y-4">
        {goalSummaries.slice(0, 4).map((goal) => (
          <li
            key={goal.id}
            className="rounded-lg border border-zinc-100 bg-zinc-50/60 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-medium text-zinc-900">{goal.title}</p>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                  goal.status === "completed"
                    ? "bg-emerald-50 text-emerald-800"
                    : goal.status === "in_progress"
                      ? "bg-sky-50 text-sky-800"
                      : "bg-zinc-100 text-zinc-700",
                )}
              >
                {formatLabel(goal.status)}
              </span>
            </div>
            <GoalProgress
              goal={{
                id: goal.id,
                user_id: "",
                title: goal.title,
                current_value: goal.current_value,
                target_value: goal.target_value,
                due_date: null,
                status: goal.status,
                created_at: "",
              }}
            />
          </li>
        ))}
      </ul>

      {goalSummaries.length > 4 ? (
        <Link
          href="/goals"
          className="mt-4 inline-block text-sm font-medium text-emerald-700 hover:underline"
        >
          View all goals →
        </Link>
      ) : (
        <Link
          href="/goals"
          className="mt-4 inline-block text-sm font-medium text-emerald-700 hover:underline"
        >
          Manage goals →
        </Link>
      )}
    </Card>
  );
}
