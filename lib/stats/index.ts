import { createClient } from "@/lib/supabase/server";
import { calculateRoleProgressStats } from "@/lib/stats/progress";
import { calculateStatsTrends } from "@/lib/stats/trends";
import { getProfile } from "@/lib/profile";
import { goalSelect, type Goal } from "@/types/goal";
import { matchSelect, type Match } from "@/types/match";
import { trainingSessionSelect, type TrainingSession } from "@/types/training";

function queryErrorMessage(error: { message: string }) {
  return error.message;
}

export async function getStatsData() {
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

  let matches: Match[] = [];

  if (matchesResult.error) {
    console.error(
      "[stats] matches query failed:",
      queryErrorMessage(matchesResult.error),
    );
  } else {
    matches = (matchesResult.data ?? []) as Match[];
  }

  let sessions: TrainingSession[] = [];

  if (sessionsResult.error) {
    console.error(
      "[stats] training sessions query failed:",
      queryErrorMessage(sessionsResult.error),
    );
  } else {
    sessions = (sessionsResult.data ?? []) as TrainingSession[];
  }

  let goals: Goal[] = [];

  if (goalsResult.error) {
    console.error(
      "[stats] goals query failed:",
      queryErrorMessage(goalsResult.error),
    );
  } else {
    goals = (goalsResult.data ?? []) as Goal[];
  }

  const progress = calculateRoleProgressStats(
    profile?.role ?? null,
    sessions,
    matches,
    goals,
  );

  const trends = calculateStatsTrends(
    profile?.role ?? null,
    matches,
    sessions,
  );

  const statsError =
    matchesResult.error && sessionsResult.error && goalsResult.error
      ? "Could not load your stats data."
      : null;

  return {
    progress,
    trends,
    statsError,
  };
}
