import { fetchUserActivity } from "@/lib/achievements/fetch-activity";
import { createClient } from "@/lib/supabase/server";
import { getMonthRange, isDateInMonth } from "@/lib/recap/month";

import { calculateMonthlyRecap } from "./calculate";

export async function getMonthlyRecapData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [activity, achievementsResult] = await Promise.all([
    fetchUserActivity(supabase, user.id),
    supabase
      .from("user_achievements")
      .select("unlocked_at")
      .eq("user_id", user.id),
  ]);

  const month = getMonthRange();
  const achievementsUnlockedThisMonth = achievementsResult.error
    ? 0
    : (achievementsResult.data?.filter((row) =>
        isDateInMonth(
          String(row.unlocked_at).slice(0, 10),
          month.monthStart,
          month.monthEnd,
        ),
      ).length ?? 0);

  const recap = calculateMonthlyRecap(
    activity.sessions,
    activity.matches,
    activity.goals,
    achievementsUnlockedThisMonth,
  );

  return {
    recap,
    recapError:
      achievementsResult.error && activity.sessions.length === 0
        ? "Could not load your recap data."
        : null,
  };
}
