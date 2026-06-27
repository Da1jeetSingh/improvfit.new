import { createClient } from "@/lib/supabase/server";
import {
  isOnboardingComplete,
  profileSelect,
  type PlayerProfile,
} from "@/types/profile";

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

  const profile = data as PlayerProfile;
  return isOnboardingComplete(profile);
}
