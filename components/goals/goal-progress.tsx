import { calculateGoalProgress, type Goal } from "@/types/goal";

import { ProgressBar } from "@/components/ui/progress-bar";

type GoalProgressProps = {
  goal: Goal;
  showLabel?: boolean;
};

export function GoalProgress({ goal, showLabel = true }: GoalProgressProps) {
  const progress = calculateGoalProgress(goal);

  if (progress === null) {
    return (
      <p className="text-sm text-muted">
        {goal.current_value} logged
        {goal.target_value === null ? " · set a numeric target to track %" : ""}
      </p>
    );
  }

  return <ProgressBar value={progress} showLabel={showLabel} />;
}
