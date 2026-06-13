import type { Goal } from "@/types/goal";
import type { Match } from "@/types/match";
import type { TrainingSession } from "@/types/training";

import { calculateBestStreak } from "@/lib/dashboard/streak";

export type MilestoneId =
  | "first_training"
  | "first_match"
  | "three_training"
  | "seven_day_streak"
  | "ten_training"
  | "five_matches"
  | "first_goal_completed";

export type Milestone = {
  id: MilestoneId;
  title: string;
  description: string;
  unlocked: boolean;
  current: number;
  target: number;
  progress: number;
};

export type MilestonesSummary = {
  milestones: Milestone[];
  unlockedCount: number;
  totalCount: number;
};

type MilestoneDefinition = {
  id: MilestoneId;
  title: string;
  description: string;
  target: number;
  getCurrent: (context: MilestoneContext) => number;
};

type MilestoneContext = {
  trainingCount: number;
  matchCount: number;
  completedGoals: number;
  bestStreak: number;
};

const milestoneDefinitions: MilestoneDefinition[] = [
  {
    id: "first_training",
    title: "First steps",
    description: "Log your first training session.",
    target: 1,
    getCurrent: ({ trainingCount }) => trainingCount,
  },
  {
    id: "first_match",
    title: "Match day",
    description: "Log your first match performance.",
    target: 1,
    getCurrent: ({ matchCount }) => matchCount,
  },
  {
    id: "three_training",
    title: "Getting consistent",
    description: "Log 3 training sessions.",
    target: 3,
    getCurrent: ({ trainingCount }) => trainingCount,
  },
  {
    id: "seven_day_streak",
    title: "Week warrior",
    description: "Reach a 7-day activity streak.",
    target: 7,
    getCurrent: ({ bestStreak }) => bestStreak,
  },
  {
    id: "ten_training",
    title: "Training regular",
    description: "Log 10 training sessions.",
    target: 10,
    getCurrent: ({ trainingCount }) => trainingCount,
  },
  {
    id: "five_matches",
    title: "Match ready",
    description: "Log 5 match performances.",
    target: 5,
    getCurrent: ({ matchCount }) => matchCount,
  },
  {
    id: "first_goal_completed",
    title: "Goal getter",
    description: "Complete your first goal.",
    target: 1,
    getCurrent: ({ completedGoals }) => completedGoals,
  },
];

function buildMilestone(
  definition: MilestoneDefinition,
  context: MilestoneContext,
): Milestone {
  const current = Math.min(definition.getCurrent(context), definition.target);
  const unlocked = definition.getCurrent(context) >= definition.target;
  const progress = unlocked
    ? 100
    : Math.round((current / definition.target) * 100);

  return {
    id: definition.id,
    title: definition.title,
    description: definition.description,
    unlocked,
    current,
    target: definition.target,
    progress,
  };
}

export function calculateMilestones(
  sessions: TrainingSession[],
  matches: Match[],
  goals: Goal[],
): MilestonesSummary {
  const context: MilestoneContext = {
    trainingCount: sessions.length,
    matchCount: matches.length,
    completedGoals: goals.filter((goal) => goal.status === "completed").length,
    bestStreak: calculateBestStreak(sessions, matches),
  };

  const milestones = milestoneDefinitions.map((definition) =>
    buildMilestone(definition, context),
  );
  const unlockedCount = milestones.filter((milestone) => milestone.unlocked)
    .length;

  return {
    milestones,
    unlockedCount,
    totalCount: milestones.length,
  };
}
