import { createClient } from "@/lib/supabase/server";
import { calculateDashboardMetrics } from "@/lib/dashboard/metrics";
import { getProfile } from "@/lib/profile";
import { goalSelect } from "@/types/goal";
import { matchSelect, type Match } from "@/types/match";
import { trainingSessionSelect, type TrainingSession } from "@/types/training";
import type { Goal } from "@/types/goal";

function queryErrorMessage(error: { message: string }) {
  return error.message;
}

export async function getDashboardData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [profile, matchesResult, sessionsResult, goalsResult] = await Promise.all([
    getProfile(),
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

  if (sessionsResult.error) {
    throw new Error(queryErrorMessage(sessionsResult.error));
  }

  if (goalsResult.error) {
    throw new Error(queryErrorMessage(goalsResult.error));
  }

  let matches: Match[] = [];

  if (matchesResult.error) {
    console.error(
      "[dashboard] matches query failed:",
      queryErrorMessage(matchesResult.error),
    );
  } else {
    matches = (matchesResult.data ?? []) as Match[];
  }

  const sessions = (sessionsResult.data ?? []) as TrainingSession[];
  const goals = (goalsResult.data ?? []) as Goal[];

  return {
    profile,
    metrics: calculateDashboardMetrics(matches, sessions, goals),
    recentMatches: matches.slice(0, 3),
    recentSessions: sessions.slice(0, 3),
    recentGoals: goals.slice(0, 3),
  };
}
