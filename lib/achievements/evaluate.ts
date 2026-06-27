import {
  achievementDefinitions,
  buildAchievementContext,
  isAchievementEarned,
} from "./definitions";
import type { Achievement, AchievementsSummary } from "./types";
import type { Goal } from "@/types/goal";
import type { Match } from "@/types/match";
import type { TrainingSession } from "@/types/training";

type UnlockedRecord = {
  achievement_id: string;
  unlocked_at: string;
};

function buildAchievement(
  definition: (typeof achievementDefinitions)[number],
  context: ReturnType<typeof buildAchievementContext>,
  unlockedRecords: Map<string, string>,
): Achievement {
  const rawCurrent = definition.getCurrent(context);
  const earned = isAchievementEarned(definition, context);
  const persistedAt = unlockedRecords.get(definition.id) ?? null;
  const unlocked = earned || persistedAt !== null;
  const current = Math.min(rawCurrent, definition.target);
  const progress = unlocked
    ? 100
    : Math.round((current / definition.target) * 100);

  return {
    id: definition.id,
    title: definition.title,
    description: definition.description,
    icon: definition.icon,
    category: definition.category,
    unlocked,
    unlockedAt: persistedAt,
    current,
    target: definition.target,
    progress,
  };
}

export function evaluateAchievements(
  sessions: TrainingSession[],
  matches: Match[],
  goals: Goal[],
  unlockedRecords: UnlockedRecord[] = [],
): AchievementsSummary {
  const context = buildAchievementContext(sessions, matches, goals);
  const unlockedMap = new Map(
    unlockedRecords.map((record) => [record.achievement_id, record.unlocked_at]),
  );

  const achievements = achievementDefinitions.map((definition) =>
    buildAchievement(definition, context, unlockedMap),
  );

  const unlockedCount = achievements.filter(
    (achievement) => achievement.unlocked,
  ).length;

  const nextAchievement =
    achievements.find((achievement) => !achievement.unlocked) ?? null;

  return {
    achievements,
    unlockedCount,
    totalCount: achievements.length,
    nextAchievement,
  };
}
