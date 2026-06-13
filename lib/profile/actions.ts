"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  battingStyles,
  bowlingStyles,
  playerRoles,
  profileSelect,
  skillLevels,
  type BattingStyle,
  type BowlingStyle,
  type PlayerRole,
  type SkillLevel,
} from "@/types/profile";

export type ProfileActionState = {
  error?: string;
  message?: string;
};

function parseOptionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function parseOptionalEnum<T extends string>(
  value: FormDataEntryValue | null,
  allowed: readonly T[],
) {
  const text = String(value ?? "").trim();
  if (!text) {
    return null;
  }

  return allowed.includes(text as T) ? (text as T) : null;
}

function parseAge(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  if (!text) {
    return null;
  }

  const age = Number(text);
  if (!Number.isInteger(age) || age < 5 || age > 100) {
    return undefined;
  }

  return age;
}

export async function saveProfile(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to save your profile." };
  }

  const age = parseAge(formData.get("age"));
  if (age === undefined) {
    return { error: "Age must be a whole number between 5 and 100." };
  }

  const role = parseOptionalEnum<PlayerRole>(formData.get("role"), playerRoles);
  const battingStyle = parseOptionalEnum<BattingStyle>(
    formData.get("batting_style"),
    battingStyles,
  );
  const bowlingStyle = parseOptionalEnum<BowlingStyle>(
    formData.get("bowling_style"),
    bowlingStyles,
  );
  const skillLevel = parseOptionalEnum<SkillLevel>(
    formData.get("skill_level"),
    skillLevels,
  );

  const profileData = {
    id: user.id,
    full_name: parseOptionalText(formData.get("full_name")),
    age,
    role,
    batting_style: battingStyle,
    bowling_style: bowlingStyle,
    skill_level: skillLevel,
    personal_goals: parseOptionalText(formData.get("personal_goals")),
  };

  const { error } = await supabase.from("users").upsert(profileData, {
    onConflict: "id",
  });

  if (error) {
    return { error: error.message };
  }

  const { data, error: verifyError } = await supabase
    .from("users")
    .select(profileSelect)
    .eq("id", user.id)
    .maybeSingle();

  if (verifyError) {
    return { error: verifyError.message };
  }

  if (!data) {
    return { error: "Profile could not be saved. Please try again." };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return { message: "Profile saved." };
}

/** @deprecated Use saveProfile */
export const updateProfile = saveProfile;
