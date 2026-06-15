import { createClient } from "@/lib/supabase/server";
import { calculateActivityStreak } from "@/lib/dashboard/streak";
import { matchSelect, type Match } from "@/types/match";
import { trainingSessionSelect, type TrainingSession } from "@/types/training";

export async function getActivityStreak() {
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
      .select("played_on")
      .eq("user_id", user.id),
    supabase
      .from("training_sessions")
      .select("session_date")
      .eq("user_id", user.id),
  ]);

  const matches = (matchesResult.data ?? []).map((row) => ({
    played_on: String(row.played_on),
  })) as Pick<Match, "played_on">[];
  const sessions = (sessionsResult.data ?? []).map((row) => ({
    session_date: String(row.session_date),
  })) as Pick<TrainingSession, "session_date">[];

  return calculateActivityStreak(
    sessions as TrainingSession[],
    matches as Match[],
  );
}
