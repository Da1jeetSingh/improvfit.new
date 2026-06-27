import type { Goal } from "@/types/goal";
import type { Match } from "@/types/match";
import type { TrainingSession } from "@/types/training";

import {
  calculateActivityStreak,
  calculateBestStreak,
} from "@/lib/dashboard/streak";

import type { AchievementCategory, AchievementId } from "./types";

export type AchievementContext = {
  trainingCount: number;
  matchCount: number;
  completedGoals: number;
  currentStreak: number;
  bestStreak: number;
  highestScore: number;
  totalRuns: number;
  battingMilestones: number;
  bowlingMilestones: number;
  consistentWeeks: number;
  consecutiveActiveWeeks: number;
};

type AchievementDefinition = {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  target: number;
  getCurrent: (context: AchievementContext) => number;
};

function sumRuns(matches: Match[]) {
  return matches.reduce((total, match) => total + (match.runs ?? 0), 0);
}

function getHighestScore(matches: Match[]) {
  return matches.reduce((best, match) => Math.max(best, match.runs ?? 0), 0);
}

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

function startOfUtcWeek(date: Date) {
  const day = date.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  const weekStart = new Date(date);
  weekStart.setUTCDate(date.getUTCDate() - diff);
  weekStart.setUTCHours(0, 0, 0, 0);
  return weekStart;
}

function getWeekKey(dateValue: string) {
  return startOfUtcWeek(new Date(`${dateValue}T00:00:00`)).toISOString();
}

function countSessionsByWeek(sessions: TrainingSession[]) {
  const counts = new Map<string, number>();

  for (const session of sessions) {
    const key = getWeekKey(session.session_date);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return counts;
}

function countActivityWeeks(sessions: TrainingSession[], matches: Match[]) {
  const weeks = new Set<string>();

  for (const session of sessions) {
    weeks.add(getWeekKey(session.session_date));
  }

  for (const match of matches) {
    weeks.add(getWeekKey(match.played_on));
  }

  return [...weeks].sort();
}

function countConsistentWeeks(sessions: TrainingSession[]) {
  const counts = countSessionsByWeek(sessions);
  return [...counts.values()].filter((count) => count >= 2).length;
}

function countConsecutiveActiveWeeks(
  sessions: TrainingSession[],
  matches: Match[],
) {
  const activeWeeks = countActivityWeeks(sessions, matches);

  if (activeWeeks.length === 0) {
    return 0;
  }

  let best = 1;
  let current = 1;

  for (let index = 1; index < activeWeeks.length; index += 1) {
    const previous = new Date(activeWeeks[index - 1]);
    const week = new Date(activeWeeks[index]);
    const gap = Math.round(
      (week.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24 * 7),
    );

    if (gap === 1) {
      current += 1;
      best = Math.max(best, current);
    } else if (gap > 1) {
      current = 1;
    }
  }

  return best;
}

export const achievementDefinitions: AchievementDefinition[] = [
  {
    id: "first_training",
    title: "First session",
    description: "Log your first training session.",
    icon: "TS",
    category: "getting_started",
    target: 1,
    getCurrent: ({ trainingCount }) => trainingCount,
  },
  {
    id: "first_match",
    title: "Match day",
    description: "Log your first match performance.",
    icon: "MD",
    category: "getting_started",
    target: 1,
    getCurrent: ({ matchCount }) => matchCount,
  },
  {
    id: "first_goal_completed",
    title: "Goal getter",
    description: "Complete your first goal.",
    icon: "G1",
    category: "getting_started",
    target: 1,
    getCurrent: ({ completedGoals }) => completedGoals,
  },
  {
    id: "three_day_streak",
    title: "3-day streak",
    description: "Stay active for 3 days in a row.",
    icon: "S3",
    category: "consistency",
    target: 3,
    getCurrent: ({ bestStreak }) => bestStreak,
  },
  {
    id: "seven_day_streak",
    title: "7-day streak",
    description: "Stay active for 7 days in a row.",
    icon: "S7",
    category: "consistency",
    target: 7,
    getCurrent: ({ bestStreak }) => bestStreak,
  },
  {
    id: "fourteen_day_streak",
    title: "14-day streak",
    description: "Stay active for 14 days in a row.",
    icon: "S14",
    category: "consistency",
    target: 14,
    getCurrent: ({ bestStreak }) => bestStreak,
  },
  {
    id: "weekly_consistency",
    title: "Weekly rhythm",
    description: "Log at least 2 training sessions in a single week.",
    icon: "WK",
    category: "consistency",
    target: 1,
    getCurrent: ({ consistentWeeks }) => consistentWeeks,
  },
  {
    id: "improvement_streak",
    title: "Momentum",
    description: "Stay active for 4 weeks in a row.",
    icon: "UP",
    category: "consistency",
    target: 4,
    getCurrent: ({ consecutiveActiveWeeks }) => consecutiveActiveWeeks,
  },
  {
    id: "ten_training",
    title: "10 sessions",
    description: "Complete 10 training sessions.",
    icon: "T10",
    category: "training",
    target: 10,
    getCurrent: ({ trainingCount }) => trainingCount,
  },
  {
    id: "twenty_five_training",
    title: "25 sessions",
    description: "Complete 25 training sessions.",
    icon: "T25",
    category: "training",
    target: 25,
    getCurrent: ({ trainingCount }) => trainingCount,
  },
  {
    id: "fifty_training",
    title: "50 sessions",
    description: "Complete 50 training sessions.",
    icon: "T50",
    category: "training",
    target: 50,
    getCurrent: ({ trainingCount }) => trainingCount,
  },
  {
    id: "ten_matches",
    title: "10 matches",
    description: "Log 10 match performances.",
    icon: "M10",
    category: "matches",
    target: 10,
    getCurrent: ({ matchCount }) => matchCount,
  },
  {
    id: "twenty_five_matches",
    title: "25 matches",
    description: "Log 25 match performances.",
    icon: "M25",
    category: "matches",
    target: 25,
    getCurrent: ({ matchCount }) => matchCount,
  },
  {
    id: "fifty_runs",
    title: "First 50",
    description: "Score 50 runs in a single innings.",
    icon: "50",
    category: "batting",
    target: 50,
    getCurrent: ({ highestScore }) => highestScore,
  },
  {
    id: "hundred_runs",
    title: "Century",
    description: "Score 100 runs in a single innings.",
    icon: "100",
    category: "batting",
    target: 100,
    getCurrent: ({ highestScore }) => highestScore,
  },
  {
    id: "double_century",
    title: "Double century",
    description: "Score 200 runs in a single innings.",
    icon: "200",
    category: "batting",
    target: 200,
    getCurrent: ({ highestScore }) => highestScore,
  },
  {
    id: "three_hundred_runs",
    title: "300 runs",
    description: "Reach 300 career runs.",
    icon: "300",
    category: "batting",
    target: 300,
    getCurrent: ({ totalRuns }) => totalRuns,
  },
  {
    id: "five_hundred_runs",
    title: "500 runs",
    description: "Reach 500 career runs.",
    icon: "500",
    category: "batting",
    target: 500,
    getCurrent: ({ totalRuns }) => totalRuns,
  },
  {
    id: "thousand_runs",
    title: "1000 runs",
    description: "Reach 1000 career runs.",
    icon: "1K",
    category: "batting",
    target: 1000,
    getCurrent: ({ totalRuns }) => totalRuns,
  },
  {
    id: "goal_master",
    title: "Goal master",
    description: "Complete 5 goals.",
    icon: "GM",
    category: "goals",
    target: 5,
    getCurrent: ({ completedGoals }) => completedGoals,
  },
  {
    id: "first_batting_milestone",
    title: "Batting logged",
    description: "Log your first batting performance in a match.",
    icon: "BAT",
    category: "batting",
    target: 1,
    getCurrent: ({ battingMilestones }) => battingMilestones,
  },
  {
    id: "first_bowling_milestone",
    title: "Bowling logged",
    description: "Log your first bowling performance in a match.",
    icon: "BWL",
    category: "matches",
    target: 1,
    getCurrent: ({ bowlingMilestones }) => bowlingMilestones,
  },
];

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
    highestScore: getHighestScore(matches),
    totalRuns: sumRuns(matches),
    battingMilestones: matches.filter(hasBattingPerformance).length,
    bowlingMilestones: matches.filter(hasBowlingPerformance).length,
    consistentWeeks: countConsistentWeeks(sessions),
    consecutiveActiveWeeks: countConsecutiveActiveWeeks(sessions, matches),
  };
}

export function isAchievementEarned(
  definition: AchievementDefinition,
  context: AchievementContext,
) {
  return definition.getCurrent(context) >= definition.target;
}

export const achievementCategoryLabels: Record<AchievementCategory, string> = {
  getting_started: "Getting started",
  consistency: "Consistency",
  training: "Training",
  matches: "Matches",
  batting: "Batting",
  goals: "Goals",
};
