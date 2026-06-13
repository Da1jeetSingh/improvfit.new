import { calculateGoalProgress, type Goal } from "@/types/goal";

import { ProgressBar } from "@/components/ui/progress-bar";

type GoalProgressProps = {
  goal: Goal;
};

export function GoalProgress({ goal }: GoalProgressProps) {
  const progress = calculateGoalProgress(goal);

  if (progress === null) {
    return (
      <p className="text-sm text-muted">
        {goal.current_value} logged
        {goal.target_value === null ? " · set a numeric target to track %" : ""}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          {goal.current_value}
          {goal.target_value !== null ? ` / ${goal.target_value}` : ""}
        </span>
        <span className="text-muted">{progress}%</span>
      </div>
      <ProgressBar value={progress} />
    </div>
  );
}
