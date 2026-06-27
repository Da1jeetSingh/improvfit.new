export type {
  Achievement,
  AchievementCategory,
  AchievementId,
  AchievementUnlock,
  AchievementsSummary,
} from "./types";

export { evaluateAchievements } from "./evaluate";
export { syncUserAchievements } from "./sync";

import type { SupabaseClient } from "@supabase/supabase-js";

import { syncUserAchievements } from "./sync";
import type { AchievementUnlock } from "./types";

export async function checkAchievementsAfterSave(
  supabase: SupabaseClient,
  userId: string,
): Promise<AchievementUnlock[]> {
  const { newlyUnlocked } = await syncUserAchievements(supabase, userId);
  return newlyUnlocked;
}
