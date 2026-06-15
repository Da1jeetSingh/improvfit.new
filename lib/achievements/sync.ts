import type { SupabaseClient } from "@supabase/supabase-js";

import {
  achievementDefinitions,
  buildAchievementContext,
  isAchievementEarned,
} from "./definitions";
import { evaluateAchievements } from "./evaluate";
import { fetchUserActivity } from "./fetch-activity";
import type { AchievementUnlock, AchievementsSummary } from "./types";

type SyncResult = {
  summary: AchievementsSummary;
  newlyUnlocked: AchievementUnlock[];
};

async function fetchUnlockedAchievements(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from("user_achievements")
    .select("achievement_id, unlocked_at")
    .eq("user_id", userId);

  if (error) {
    console.error("[achievements] unlock query failed:", error.message);
    return [];
  }

  return data ?? [];
}

export async function syncUserAchievements(
  supabase: SupabaseClient,
  userId: string,
): Promise<SyncResult> {
  const [activity, unlockedRecords] = await Promise.all([
    fetchUserActivity(supabase, userId),
    fetchUnlockedAchievements(supabase, userId),
  ]);

  const context = buildAchievementContext(
    activity.sessions,
    activity.matches,
    activity.goals,
  );
  const existingIds = new Set(
    unlockedRecords.map((record) => record.achievement_id),
  );

  const toInsert = achievementDefinitions.filter(
    (definition) =>
      !existingIds.has(definition.id) &&
      isAchievementEarned(definition, context),
  );

  const newlyUnlocked: AchievementUnlock[] = [];

  if (toInsert.length > 0) {
    const { data, error } = await supabase
      .from("user_achievements")
      .insert(
        toInsert.map((definition) => ({
          user_id: userId,
          achievement_id: definition.id,
        })),
      )
      .select("achievement_id, unlocked_at");

    if (error) {
      console.error("[achievements] unlock insert failed:", error.message);
    } else {
      for (const row of data ?? []) {
        const definition = achievementDefinitions.find(
          (item) => item.id === row.achievement_id,
        );

        if (definition) {
          newlyUnlocked.push({
            id: definition.id,
            title: definition.title,
            description: definition.description,
            icon: definition.icon,
          });
        }
      }
    }
  }

  const allUnlocked = await fetchUnlockedAchievements(supabase, userId);
  const summary = evaluateAchievements(
    activity.sessions,
    activity.matches,
    activity.goals,
    allUnlocked,
  );

  return { summary, newlyUnlocked };
}
