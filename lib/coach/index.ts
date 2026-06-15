import { buildCoachContext } from "@/lib/coach/build-context";
import { pickCoachMessage, type CoachContext } from "@/lib/coach/messages";
import type { CoachEvent, CoachMessage } from "@/lib/coach/types";
import { getProfile } from "@/lib/profile";
import { goalSelect, type Goal } from "@/types/goal";
import { matchSelect, type Match } from "@/types/match";
import type { PlayerProfile } from "@/types/profile";
import { trainingSessionSelect, type TrainingSession } from "@/types/training";
import { createClient } from "@/lib/supabase/server";

async function fetchCoachData(userId: string) {
  const supabase = await createClient();

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

export async function getDashboardCoachMessage(): Promise<CoachMessage | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await getProfile();
  const data = await fetchCoachData(user.id);
  const context = buildCoachContext(profile, data.sessions, data.matches, data.goals);

  return pickCoachMessage("dashboard", context);
}

export async function getCoachMessageForEvent(
  event: CoachEvent,
  profile: PlayerProfile | null,
  data: {
    sessions: TrainingSession[];
    matches: Match[];
    goals: Goal[];
    latestTraining?: TrainingSession;
    latestMatch?: Match;
    latestGoal?: Goal;
  },
): Promise<CoachMessage | null> {
  const context = buildCoachContext(
    profile,
    data.sessions,
    data.matches,
    data.goals,
    {
      latestTraining: data.latestTraining,
      latestMatch: data.latestMatch,
      latestGoal: data.latestGoal,
    },
  );

  return pickCoachMessage(event, context);
}

export async function getCoachMessageAfterSave(
  event: Exclude<CoachEvent, "dashboard">,
  saved: TrainingSession | Match | Goal,
): Promise<CoachMessage | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await getProfile();
  const data = await fetchCoachData(user.id);

  return getCoachMessageForEvent(event, profile, {
    ...data,
    latestTraining: event === "training_saved" ? (saved as TrainingSession) : undefined,
    latestMatch: event === "match_saved" ? (saved as Match) : undefined,
    latestGoal: event === "goal_created" ? (saved as Goal) : undefined,
  });
}

export type { CoachContext };
