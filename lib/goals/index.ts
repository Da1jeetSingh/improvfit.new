import { createClient } from "@/lib/supabase/server";
import { type Goal, goalSelect } from "@/types/goal";

export async function getGoals(): Promise<Goal[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("goals")
    .select(goalSelect)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Goal[];
}
