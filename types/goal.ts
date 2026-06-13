export const goalCategories = [
  "batting",
  "bowling",
  "fitness",
  "mental",
  "general",
] as const;

export const goalStatuses = ["not_started", "in_progress", "completed"] as const;

export type GoalCategory = (typeof goalCategories)[number];
export type GoalStatus = (typeof goalStatuses)[number];

export type Goal = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: GoalCategory | null;
  target_value: number | null;
  target_outcome: string | null;
  current_value: number;
  due_date: string | null;
  status: GoalStatus;
  created_at: string;
};

export const goalSelect =
  "id, user_id, title, description, category, target_value, target_outcome, current_value, due_date, status, created_at";

export function formatGoalCategory(category: GoalCategory | null) {
  if (!category) {
    return null;
  }

  const labels: Record<GoalCategory, string> = {
    batting: "Batting",
    bowling: "Bowling",
    fitness: "Fitness",
    mental: "Mental",
    general: "General",
  };

  return labels[category];
}

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

export function formatGoalTarget(goal: Goal) {
  if (goal.target_outcome) {
    return goal.target_outcome;
  }

  if (goal.target_value !== null) {
    return String(goal.target_value);
  }

  return null;
}
