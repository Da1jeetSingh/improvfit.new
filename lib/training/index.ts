import { createClient } from "@/lib/supabase/server";
import { type TrainingSession, trainingSessionSelect } from "@/types/training";

export type TrainingSessionsResult = {
  sessions: TrainingSession[];
  error: string | null;
};

export async function getTrainingSessions(): Promise<TrainingSessionsResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { sessions: [], error: null };
  }

  const { data, error } = await supabase
    .from("training_sessions")
    .select(trainingSessionSelect)
    .eq("user_id", user.id)
    .order("session_date", { ascending: false });

  if (error) {
    console.error("[training] sessions query failed:", error.message);
    return { sessions: [], error: error.message };
  }

  return { sessions: (data ?? []) as TrainingSession[], error: null };
}
