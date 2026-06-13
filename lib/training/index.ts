import { createClient } from "@/lib/supabase/server";
import { type TrainingSession, trainingSessionSelect } from "@/types/training";

export async function getTrainingSessions(): Promise<TrainingSession[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("training_sessions")
    .select(trainingSessionSelect)
    .eq("user_id", user.id)
    .order("session_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as TrainingSession[];
}
