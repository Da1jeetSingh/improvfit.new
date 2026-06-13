import { createClient } from "@/lib/supabase/server";
import { calculatePlayerStats } from "@/lib/dashboard/stats";
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

  const [matchesResult, sessionsResult] = await Promise.all([
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

  const stats = calculatePlayerStats(sessions, matches);
  const statsError =
    matchesResult.error && sessionsResult.error
      ? "Could not load your stats data."
      : null;

  return {
    stats,
    statsError,
  };
}
