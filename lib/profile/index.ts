import { createClient } from "@/lib/supabase/server";
import { type PlayerProfile, profileSelect } from "@/types/profile";

export async function getProfile(): Promise<PlayerProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select(profileSelect)
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data) {
    return data as PlayerProfile;
  }

  const { data: created, error: insertError } = await supabase
    .from("users")
    .insert({ id: user.id })
    .select(profileSelect)
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  return created as PlayerProfile;
}
