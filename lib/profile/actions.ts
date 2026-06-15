"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  battingHands,
  battingOrders,
  bowlingHands,
  bowlingStyleDetails,
  bowlingTypes,
  playerRoles,
  profileSelect,
  skillLevels,
  type BattingHand,
  type BattingOrder,
  type BowlingHand,
  type BowlingStyleDetail,
  type BowlingType,
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
  const battingHand = parseOptionalEnum<BattingHand>(
    formData.get("batting_hand"),
    battingHands,
  );
  const battingOrder = parseOptionalEnum<BattingOrder>(
    formData.get("batting_order"),
    battingOrders,
  );
  const bowlingHand = parseOptionalEnum<BowlingHand>(
    formData.get("bowling_hand"),
    bowlingHands,
  );
  const bowlingType = parseOptionalEnum<BowlingType>(
    formData.get("bowling_type"),
    bowlingTypes,
  );
  const bowlingStyleDetail = parseOptionalEnum<BowlingStyleDetail>(
    formData.get("bowling_style_details"),
    bowlingStyleDetails,
  );
  const skillLevel = parseOptionalEnum<SkillLevel>(
    formData.get("skill_level"),
    skillLevels,
  );

  const profileData = {
    id: user.id,
    email: user.email,
    full_name: parseOptionalText(formData.get("full_name")),
    age,
    role,
    batting_hand: battingHand,
    batting_order: battingOrder,
    bowling_hand: bowlingHand,
    bowling_type: bowlingType,
    bowling_style_details:
      bowlingType === "spinner" ? bowlingStyleDetail : null,
    skill_level: skillLevel,
    personal_goals: parseOptionalText(formData.get("personal_goals")),
  };

  const { error } = await supabase.from("profiles").upsert(profileData, {
    onConflict: "id",
  });

  if (error) {
    return { error: error.message };
  }

  const { data, error: verifyError } = await supabase
    .from("profiles")
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
