import { createClient } from "@/lib/supabase/server";
import { calculateActivityStreak } from "@/lib/dashboard/streak";
import { calculateWeeklyProgress } from "@/lib/dashboard/weekly-progress";
import { goalSelect } from "@/types/goal";
import { matchSelect, type Match } from "@/types/match";
import { trainingSessionSelect, type TrainingSession } from "@/types/training";
import type { Goal } from "@/types/goal";

function queryErrorMessage(error: { message: string }) {
  return error.message;
}

export async function getWeeklyProgressData() {
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

  let matches: Match[] = [];

  if (matchesResult.error) {
    console.error(
      "[weekly] matches query failed:",
      queryErrorMessage(matchesResult.error),
    );
  } else {
    matches = (matchesResult.data ?? []) as Match[];
  }

  let sessions: TrainingSession[] = [];

  if (sessionsResult.error) {
    console.error(
      "[weekly] training sessions query failed:",
      queryErrorMessage(sessionsResult.error),
    );
  } else {
    sessions = (sessionsResult.data ?? []) as TrainingSession[];
  }

  let goals: Goal[] = [];

  if (goalsResult.error) {
    console.error(
      "[weekly] goals query failed:",
      queryErrorMessage(goalsResult.error),
    );
  } else {
    goals = (goalsResult.data ?? []) as Goal[];
  }

  const streak = calculateActivityStreak(sessions, matches);
  const weeklyProgress = calculateWeeklyProgress(sessions, matches, goals, streak);
  const weeklyProgressError =
    matchesResult.error && sessionsResult.error && goalsResult.error
      ? "Could not load your weekly activity data."
      : null;

  return {
    weeklyProgress,
    weeklyProgressError,
  };
}
