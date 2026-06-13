"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  battingStyles,
  bowlingStyles,
  playerRoles,
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

export async function updateProfile(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to update your profile." };
  }

  const age = parseAge(formData.get("age"));
  if (age === undefined) {
    return { error: "Age must be a whole number between 5 and 100." };
  }

  const role = parseOptionalEnum<PlayerRole>(
    formData.get("role"),
    playerRoles,
  );
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

  const { error } = await supabase
    .from("users")
    .update({
      full_name: parseOptionalText(formData.get("full_name")),
      age,
      role,
      batting_style: battingStyle,
      bowling_style: bowlingStyle,
      skill_level: skillLevel,
      personal_goals: parseOptionalText(formData.get("personal_goals")),
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");

  return { message: "Profile saved." };
}
