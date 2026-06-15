import { syncUserAchievements, type AchievementsSummary } from "@/lib/achievements";
import { fetchUserActivity } from "@/lib/achievements/fetch-activity";
import { calculateActivityStreak } from "@/lib/dashboard/streak";
import { createClient } from "@/lib/supabase/server";
import type { PlayerProfile } from "@/types/profile";

import { getProfile } from "./index";

export type ProfileStats = {
  streakDays: number;
  sessionsLogged: number;
  matchesLogged: number;
  goalsCompleted: number;
};

export type ProfilePageData = {
  profile: PlayerProfile;
  stats: ProfileStats;
  achievements: AchievementsSummary;
};

export async function getProfilePageData(): Promise<ProfilePageData | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [profile, activity, achievementsResult] = await Promise.all([
    getProfile(),
    fetchUserActivity(supabase, user.id),
    syncUserAchievements(supabase, user.id),
  ]);

  if (!profile) {
    return null;
  }

  const streak = calculateActivityStreak(activity.sessions, activity.matches);

  return {
    profile,
    stats: {
      streakDays: streak.currentStreak,
      sessionsLogged: activity.sessions.length,
      matchesLogged: activity.matches.length,
      goalsCompleted: activity.goals.filter((goal) => goal.status === "completed")
        .length,
    },
    achievements: achievementsResult.summary,
  };
}
