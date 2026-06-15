import { createClient } from "@/lib/supabase/server";
import { isOnboardingComplete, profileSelect } from "@/types/profile";

export async function getOnboardingCompletedForUser(
  userId: string,
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(profileSelect)
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return isOnboardingComplete({
    id: String(data.id),
    email: data.email ?? null,
    full_name: data.full_name ?? null,
    age: data.age ?? null,
    role: data.role ?? null,
    batting_hand: data.batting_hand ?? null,
    batting_order: data.batting_order ?? null,
    bowling_hand: data.bowling_hand ?? null,
    bowling_type: data.bowling_type ?? null,
    bowling_style_details: data.bowling_style_details ?? null,
    skill_level: data.skill_level ?? null,
    personal_goals: data.personal_goals ?? null,
    onboarding_completed: Boolean(data.onboarding_completed),
    created_at: String(data.created_at),
    updated_at: String(data.updated_at ?? data.created_at),
  });
}
