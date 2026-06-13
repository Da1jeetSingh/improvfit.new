import { createClient } from "@/lib/supabase/server";
import { type Goal, goalSelect } from "@/types/goal";

export type GoalsResult = {
  goals: Goal[];
  error: string | null;
};

export async function getGoals(): Promise<GoalsResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { goals: [], error: null };
  }

  const { data, error } = await supabase
    .from("goals")
    .select(goalSelect)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[goals] query failed:", error.message);
    return { goals: [], error: error.message };
  }

  return { goals: (data ?? []) as Goal[], error: null };
}

export async function getGoal(goalId: string): Promise<Goal | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("goals")
    .select(goalSelect)
    .eq("id", goalId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[goals] single goal query failed:", error.message);
    return null;
  }

  return data as Goal | null;
}
