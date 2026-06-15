import type { Goal } from "@/types/goal";
import type { Match } from "@/types/match";
import type { TrainingSession } from "@/types/training";

import {
  calculateActivityStreak,
  calculateBestStreak,
} from "@/lib/dashboard/streak";

import type { AchievementId } from "./types";

export type AchievementContext = {
  trainingCount: number;
  matchCount: number;
  completedGoals: number;
  currentStreak: number;
  bestStreak: number;
  battingMilestones: number;
  bowlingMilestones: number;
};

type AchievementDefinition = {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  target: number;
  getCurrent: (context: AchievementContext) => number;
};

export const achievementDefinitions: AchievementDefinition[] = [
  {
    id: "first_training",
    title: "First steps",
    description: "Log your first training session.",
    icon: "🏋️",
    target: 1,
    getCurrent: ({ trainingCount }) => trainingCount,
  },
  {
    id: "first_match",
    title: "Match day",
    description: "Log your first match performance.",
    icon: "🏏",
    target: 1,
    getCurrent: ({ matchCount }) => matchCount,
  },
  {
    id: "three_day_streak",
    title: "On a roll",
    description: "Reach a 3-day activity streak.",
    icon: "🔥",
    target: 3,
    getCurrent: ({ bestStreak }) => bestStreak,
  },
  {
    id: "seven_day_streak",
    title: "Week warrior",
    description: "Reach a 7-day activity streak.",
    icon: "⚡",
    target: 7,
    getCurrent: ({ bestStreak }) => bestStreak,
  },
  {
    id: "ten_training",
    title: "Training regular",
    description: "Complete 10 training sessions.",
    icon: "📈",
    target: 10,
    getCurrent: ({ trainingCount }) => trainingCount,
  },
  {
    id: "first_goal_completed",
    title: "Goal getter",
    description: "Complete your first goal.",
    icon: "🎯",
    target: 1,
    getCurrent: ({ completedGoals }) => completedGoals,
  },
  {
    id: "first_batting_milestone",
    title: "Middle order",
    description: "Log your first batting performance in a match.",
    icon: "🪵",
    target: 1,
    getCurrent: ({ battingMilestones }) => battingMilestones,
  },
  {
    id: "first_bowling_milestone",
    title: "New ball",
    description: "Log your first bowling performance in a match.",
    icon: "🎳",
    target: 1,
    getCurrent: ({ bowlingMilestones }) => bowlingMilestones,
  },
];

function hasBattingPerformance(match: Match) {
  return (
    (match.runs !== null && match.runs > 0) ||
    (match.balls_faced !== null && match.balls_faced > 0)
  );
}

function hasBowlingPerformance(match: Match) {
  return (
    (match.wickets !== null && match.wickets > 0) ||
    (match.overs_bowled !== null && match.overs_bowled > 0)
  );
}

export function buildAchievementContext(
  sessions: TrainingSession[],
  matches: Match[],
  goals: Goal[],
): AchievementContext {
  const streak = calculateActivityStreak(sessions, matches);

  return {
    trainingCount: sessions.length,
    matchCount: matches.length,
    completedGoals: goals.filter((goal) => goal.status === "completed").length,
    currentStreak: streak.currentStreak,
    bestStreak: calculateBestStreak(sessions, matches),
    battingMilestones: matches.filter(hasBattingPerformance).length,
    bowlingMilestones: matches.filter(hasBowlingPerformance).length,
  };
}

export function isAchievementEarned(
  definition: AchievementDefinition,
  context: AchievementContext,
) {
  return definition.getCurrent(context) >= definition.target;
}
