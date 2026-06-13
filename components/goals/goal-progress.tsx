import { calculateGoalProgress, type Goal } from "@/types/goal";
import { cn } from "@/lib/utils";

type GoalProgressProps = {
  goal: Goal;
};

export function GoalProgress({ goal }: GoalProgressProps) {
  const progress = calculateGoalProgress(goal);

  if (progress === null) {
    return (
      <p className="text-sm text-zinc-500">
        {goal.current_value} logged
        {goal.target_value === null ? " · set a target to track progress" : ""}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-700">
          {goal.current_value}
          {goal.target_value !== null ? ` / ${goal.target_value}` : ""}
        </span>
        <span className="text-zinc-500">{progress}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            goal.status === "completed" ? "bg-green-deep" : "bg-green-light",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
