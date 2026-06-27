import { createClient } from "@/lib/supabase/server";
import { syncUserAchievements } from "@/lib/achievements";

export async function getMilestonesData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  try {
    const { summary } = await syncUserAchievements(supabase, user.id);

    return {
      milestones: summary,
      milestonesError: null,
    };
  } catch (error) {
    console.error("[milestones] sync failed:", error);
    return {
      milestones: {
        achievements: [],
        unlockedCount: 0,
        totalCount: 0,
        nextAchievement: null,
      },
      milestonesError: "Could not load your achievements.",
    };
  }
}
