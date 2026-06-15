import type { SupabaseClient } from "@supabase/supabase-js";

import { goalSelect, type Goal } from "@/types/goal";
import { matchSelect, type Match } from "@/types/match";
import {
  trainingSessionSelect,
  type TrainingSession,
} from "@/types/training";

export type UserActivityData = {
  sessions: TrainingSession[];
  matches: Match[];
  goals: Goal[];
};

export async function fetchUserActivity(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserActivityData> {
  const [matchesResult, sessionsResult, goalsResult] = await Promise.all([
    supabase
      .from("matches")
      .select(matchSelect)
      .eq("user_id", userId)
      .order("played_on", { ascending: false }),
    supabase
      .from("training_sessions")
      .select(trainingSessionSelect)
      .eq("user_id", userId)
      .order("session_date", { ascending: false }),
    supabase
      .from("goals")
      .select(goalSelect)
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  return {
    matches: (matchesResult.data ?? []) as Match[],
    sessions: (sessionsResult.data ?? []) as TrainingSession[],
    goals: (goalsResult.data ?? []) as Goal[],
  };
}
