import { createClient } from "@/lib/supabase/server";
import { calculateDashboardMetrics } from "@/lib/dashboard/metrics";
import { goalSelect } from "@/types/goal";
import { matchSelect } from "@/types/match";
import { trainingSessionSelect } from "@/types/training";

export async function getDashboardData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [matchesResult, sessionsResult, goalsResult] = await Promise.all([
    supabase
      .from("matches")
      .select(matchSelect)
      .eq("user_id", user.id)
      .order("played_on", { ascending: false }),
    supabase
      .from("training_sessions")
      .select(trainingSessionSelect)
      .eq("user_id", user.id)
      .order("session_date", { ascending: false }),
    supabase
      .from("goals")
      .select(goalSelect)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  if (matchesResult.error) {
    throw new Error(matchesResult.error.message);
  }

  if (sessionsResult.error) {
    throw new Error(sessionsResult.error.message);
  }

  if (goalsResult.error) {
    throw new Error(goalsResult.error.message);
  }

  const matches = matchesResult.data ?? [];
  const sessions = sessionsResult.data ?? [];
  const goals = goalsResult.data ?? [];

  return {
    userEmail: user.email ?? "",
    metrics: calculateDashboardMetrics(matches, sessions, goals),
  };
}
