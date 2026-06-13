import { createClient } from "@/lib/supabase/server";
import { type Match, matchSelect } from "@/types/match";

export async function getMatches(): Promise<Match[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("matches")
    .select(matchSelect)
    .eq("user_id", user.id)
    .order("played_on", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Match[];
}

export async function getMatch(matchId: string): Promise<Match | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("matches")
    .select(matchSelect)
    .eq("id", matchId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Match | null;
}
