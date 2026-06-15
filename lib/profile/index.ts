import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import {
  type PlayerProfile,
  profileSelect,
} from "@/types/profile";

const minimalProfileSelect =
  "id, email, full_name, onboarding_completed, created_at, updated_at";

function profileFromAuthUser(user: User): PlayerProfile {
  const fullName = user.user_metadata?.full_name;

  return {
    id: user.id,
    email: user.email ?? null,
    full_name: typeof fullName === "string" && fullName.length > 0 ? fullName : null,
    age: null,
    role: null,
    batting_hand: null,
    batting_order: null,
    bowling_hand: null,
    bowling_type: null,
    bowling_style_details: null,
    skill_level: null,
    personal_goals: null,
    onboarding_completed: false,
    created_at: user.created_at,
    updated_at: user.created_at,
  };
}

function toPlayerProfile(
  row: Record<string, unknown>,
  userId: string,
): PlayerProfile {
  return {
    id: String(row.id ?? userId),
    email: (row.email as string | null | undefined) ?? null,
    full_name: (row.full_name as string | null | undefined) ?? null,
    age: (row.age as number | null | undefined) ?? null,
    role: (row.role as PlayerProfile["role"] | undefined) ?? null,
    batting_hand:
      (row.batting_hand as PlayerProfile["batting_hand"] | undefined) ?? null,
    batting_order:
      (row.batting_order as PlayerProfile["batting_order"] | undefined) ?? null,
    bowling_hand:
      (row.bowling_hand as PlayerProfile["bowling_hand"] | undefined) ?? null,
    bowling_type:
      (row.bowling_type as PlayerProfile["bowling_type"] | undefined) ?? null,
    bowling_style_details:
      (row.bowling_style_details as
        | PlayerProfile["bowling_style_details"]
        | undefined) ?? null,
    skill_level:
      (row.skill_level as PlayerProfile["skill_level"] | undefined) ?? null,
    personal_goals:
      (row.personal_goals as string | null | undefined) ?? null,
    onboarding_completed: Boolean(row.onboarding_completed),
    created_at: String(row.created_at ?? new Date().toISOString()),
    updated_at: String(row.updated_at ?? new Date().toISOString()),
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

  try {
    const fullResult = await supabase
      .from("profiles")
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
      .from("profiles")
      .select(minimalProfileSelect)
      .eq("id", user.id)
      .maybeSingle();

    if (fallback.error) {
      console.error("[profile] minimal profile select failed:", fallback.error.message);
      return profileFromAuthUser(user);
    }

    if (fallback.data) {
      return toPlayerProfile(fallback.data as Record<string, unknown>, user.id);
    }

    const { data: created, error: insertError } = await supabase
      .from("profiles")
      .insert({ id: user.id, email: user.email })
      .select(minimalProfileSelect)
      .single();

    if (insertError) {
      console.error("[profile] profile insert failed:", insertError.message);
      return profileFromAuthUser(user);
    }

    return toPlayerProfile(created as Record<string, unknown>, user.id);
  } catch (error) {
    console.error("[profile] unexpected profile load failure:", error);
    return profileFromAuthUser(user);
  }
}

export async function getOnboardingStatus(): Promise<boolean | null> {
  const profile = await getProfile();
  if (!profile) {
    return null;
  }

  return profile.onboarding_completed;
}
