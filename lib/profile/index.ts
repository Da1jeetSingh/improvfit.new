import { createClient } from "@/lib/supabase/server";
import { type PlayerProfile, profileSelect } from "@/types/profile";

const minimalProfileSelect = "id, full_name, created_at";

function toPlayerProfile(
  row: Record<string, unknown>,
  userId: string,
): PlayerProfile {
  return {
    id: String(row.id ?? userId),
    full_name: (row.full_name as string | null | undefined) ?? null,
    age: (row.age as number | null | undefined) ?? null,
    role: (row.role as PlayerProfile["role"] | undefined) ?? null,
    batting_style:
      (row.batting_style as PlayerProfile["batting_style"] | undefined) ?? null,
    bowling_style:
      (row.bowling_style as PlayerProfile["bowling_style"] | undefined) ?? null,
    skill_level:
      (row.skill_level as PlayerProfile["skill_level"] | undefined) ?? null,
    personal_goals:
      (row.personal_goals as string | null | undefined) ?? null,
    created_at: String(row.created_at ?? new Date().toISOString()),
  };
}

export async function getProfile(): Promise<PlayerProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const fullResult = await supabase
    .from("users")
    .select(profileSelect)
    .eq("id", user.id)
    .maybeSingle();

  if (!fullResult.error && fullResult.data) {
    return toPlayerProfile(fullResult.data as Record<string, unknown>, user.id);
  }

  if (fullResult.error) {
    console.error("[profile] full profile select failed:", fullResult.error.message);
  }

  const fallback = await supabase
    .from("users")
    .select(minimalProfileSelect)
    .eq("id", user.id)
    .maybeSingle();

  if (fallback.error) {
    throw new Error(fallback.error.message);
  }

  if (fallback.data) {
    return toPlayerProfile(fallback.data as Record<string, unknown>, user.id);
  }

  const { data: created, error: insertError } = await supabase
    .from("users")
    .insert({ id: user.id })
    .select(minimalProfileSelect)
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  return toPlayerProfile(created as Record<string, unknown>, user.id);
}
