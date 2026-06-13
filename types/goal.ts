export const goalStatuses = ["not_started", "in_progress", "completed"] as const;

export type GoalStatus = (typeof goalStatuses)[number];

export type Goal = {
  id: string;
  user_id: string;
  title: string;
  target_value: number | null;
  current_value: number;
  due_date: string | null;
  status: GoalStatus;
  created_at: string;
};

export const goalSelect =
  "id, user_id, title, target_value, current_value, due_date, status, created_at";

export function calculateGoalProgress(goal: Goal): number | null {
  if (goal.status === "completed") {
    return 100;
  }

  if (goal.target_value === null || goal.target_value <= 0) {
    return null;
  }

  const progress = (goal.current_value / goal.target_value) * 100;

  return Math.min(100, Math.round(progress * 10) / 10);
}

export function isGoalOverdue(goal: Goal) {
  if (!goal.due_date || goal.status === "completed") {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(`${goal.due_date}T00:00:00`);

  return deadline < today;
}
