import { createClient } from "@/lib/supabase/server";
import { calculateDashboardMetrics } from "@/lib/dashboard/metrics";
import { getProfile } from "@/lib/profile";
import { trainingSessionSelect } from "@/types/training";

export async function getDashboardData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [profile, sessionsResult] = await Promise.all([
    getProfile(),
    supabase
      .from("training_sessions")
      .select(trainingSessionSelect)
      .eq("user_id", user.id)
      .order("session_date", { ascending: false }),
  ]);

  if (sessionsResult.error) {
    throw new Error(sessionsResult.error.message);
  }

  const sessions = sessionsResult.data ?? [];

  return {
    profile,
    metrics: calculateDashboardMetrics(sessions),
    recentSessions: sessions.slice(0, 5),
  };
}
