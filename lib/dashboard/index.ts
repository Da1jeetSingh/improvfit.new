import { createClient } from "@/lib/supabase/server";
import { calculateDashboardMetrics } from "@/lib/dashboard/metrics";
import { calculateProgressSummary } from "@/lib/dashboard/progress-summary";
import { calculateActivityStreak } from "@/lib/dashboard/streak";
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

  let profile = null;

  try {
    profile = await getProfile();
  } catch (error) {
    console.error("[dashboard] profile load failed:", error);
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

  let matches: Match[] = [];

  if (matchesResult.error) {
    console.error(
      "[dashboard] matches query failed:",
      queryErrorMessage(matchesResult.error),
    );
  } else {
    matches = (matchesResult.data ?? []) as Match[];
  }

  let sessions: TrainingSession[] = [];

  if (sessionsResult.error) {
    console.error(
      "[dashboard] training sessions query failed:",
      queryErrorMessage(sessionsResult.error),
    );
  } else {
    sessions = (sessionsResult.data ?? []) as TrainingSession[];
  }

  let goals: Goal[] = [];

  if (goalsResult.error) {
    console.error(
      "[dashboard] goals query failed:",
      queryErrorMessage(goalsResult.error),
    );
  } else {
    goals = (goalsResult.data ?? []) as Goal[];
  }

  const streak = calculateActivityStreak(sessions, matches);
  const progressSummary = calculateProgressSummary(
    sessions,
    matches,
    goals,
    streak,
  );
  const progressSummaryError =
    matchesResult.error && sessionsResult.error && goalsResult.error
      ? "Could not load your activity data."
      : null;

  return {
    profile,
    metrics: calculateDashboardMetrics(matches, sessions, goals),
    progressSummary,
    progressSummaryError,
    recentMatches: matches.slice(0, 3),
    recentSessions: sessions.slice(0, 3),
    recentGoals: goals.slice(0, 3),
  };
}
