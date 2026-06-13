import { createClient } from "@/lib/supabase/server";
import { type Match, matchSelect } from "@/types/match";

export type MatchesResult = {
  matches: Match[];
  error: string | null;
};

export async function getMatches(): Promise<MatchesResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { matches: [], error: null };
  }

  const { data, error } = await supabase
    .from("matches")
    .select(matchSelect)
    .eq("user_id", user.id)
    .order("played_on", { ascending: false });

  if (error) {
    console.error("[matches] query failed:", error.message);
    return { matches: [], error: error.message };
  }

  return { matches: (data ?? []) as Match[], error: null };
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
    console.error("[matches] single match query failed:", error.message);
    return null;
  }

  return data as Match | null;
}
