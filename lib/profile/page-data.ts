import { syncUserAchievements, type AchievementsSummary } from "@/lib/achievements";
import { fetchUserActivity } from "@/lib/achievements/fetch-activity";
import {
  calculateCareerOverview,
  type CareerOverviewStats,
} from "@/lib/stats/trends";
import { createClient } from "@/lib/supabase/server";
import type { PlayerProfile } from "@/types/profile";

import { getProfile } from "./index";

export type ProfileStats = {
  sessionsLogged: number;
  matchesLogged: number;
  goalsCompleted: number;
};

export type ProfilePageData = {
  profile: PlayerProfile;
  stats: ProfileStats;
  career: CareerOverviewStats | null;
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

  return {
    profile,
    stats: {
      sessionsLogged: activity.sessions.length,
      matchesLogged: activity.matches.length,
      goalsCompleted: activity.goals.filter((goal) => goal.status === "completed")
        .length,
    },
    career: calculateCareerOverview(profile.role, activity.matches),
    achievements: achievementsResult.summary,
  };
}
