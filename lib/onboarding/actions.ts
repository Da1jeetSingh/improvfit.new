"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { dashboardRoute } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  battingHands,
  battingOrders,
  bowlingHands,
  bowlingStyleDetails,
  bowlingTypes,
  hasBattingDetails,
  hasBowlingDetails,
  isOnboardingComplete,
  playerRoles,
  type BattingHand,
  type BattingOrder,
  type BowlingHand,
  type BowlingStyleDetail,
  type BowlingType,
  type PlayerRole,
} from "@/types/profile";

export type OnboardingActionState = {
  error?: string;
};

function parseRequiredEnum<T extends string>(
  value: FormDataEntryValue | null,
  allowed: readonly T[],
  label: string,
): T | { error: string } {
  const text = String(value ?? "").trim();
  if (!text || !allowed.includes(text as T)) {
    return { error: `Please select a valid ${label}.` };
  }

  return text as T;
}

export async function completeOnboarding(
  _prevState: OnboardingActionState,
  formData: FormData,
): Promise<OnboardingActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to continue." };
  }

  const roleResult = parseRequiredEnum<PlayerRole>(
    formData.get("role"),
    playerRoles,
    "role",
  );
  if (typeof roleResult === "object" && "error" in roleResult) {
    return { error: roleResult.error };
  }

  const role = roleResult;
  const profileUpdate: Record<string, unknown> = {
    id: user.id,
    email: user.email,
    role,
    batting_hand: null,
    batting_order: null,
    bowling_hand: null,
    bowling_type: null,
    bowling_style_details: null,
    onboarding_completed: false,
  };

  if (role === "batsman" || role === "all-rounder") {
    const battingHandResult = parseRequiredEnum<BattingHand>(
      formData.get("batting_hand"),
      battingHands,
      "batting hand",
    );
    if (typeof battingHandResult === "object" && "error" in battingHandResult) {
      return { error: battingHandResult.error };
    }

    const battingOrderResult = parseRequiredEnum<BattingOrder>(
      formData.get("batting_order"),
      battingOrders,
      "batting order",
    );
    if (typeof battingOrderResult === "object" && "error" in battingOrderResult) {
      return { error: battingOrderResult.error };
    }

    profileUpdate.batting_hand = battingHandResult;
    profileUpdate.batting_order = battingOrderResult;
  }

  if (role === "bowler" || role === "all-rounder") {
    const bowlingHandResult = parseRequiredEnum<BowlingHand>(
      formData.get("bowling_hand"),
      bowlingHands,
      "bowling hand",
    );
    if (typeof bowlingHandResult === "object" && "error" in bowlingHandResult) {
      return { error: bowlingHandResult.error };
    }

    const bowlingTypeResult = parseRequiredEnum<BowlingType>(
      formData.get("bowling_type"),
      bowlingTypes,
      "bowling type",
    );
    if (typeof bowlingTypeResult === "object" && "error" in bowlingTypeResult) {
      return { error: bowlingTypeResult.error };
    }

    profileUpdate.bowling_hand = bowlingHandResult;
    profileUpdate.bowling_type = bowlingTypeResult;

    if (bowlingTypeResult === "spinner") {
      const styleResult = parseRequiredEnum<BowlingStyleDetail>(
        formData.get("bowling_style_details"),
        bowlingStyleDetails,
        "spin style",
      );
      if (typeof styleResult === "object" && "error" in styleResult) {
        return { error: styleResult.error };
      }

      profileUpdate.bowling_style_details = styleResult;
    }
  }

  const profileForCheck = {
    id: user.id,
    email: user.email ?? null,
    full_name: null,
    age: null,
    role,
    batting_hand: profileUpdate.batting_hand as BattingHand | null,
    batting_order: profileUpdate.batting_order as BattingOrder | null,
    bowling_hand: profileUpdate.bowling_hand as BowlingHand | null,
    bowling_type: profileUpdate.bowling_type as BowlingType | null,
    bowling_style_details: profileUpdate.bowling_style_details as
      | BowlingStyleDetail
      | null,
    skill_level: null,
    personal_goals: null,
    onboarding_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (!isOnboardingComplete(profileForCheck)) {
    if (role === "batsman" && !hasBattingDetails(profileForCheck)) {
      return { error: "Please complete your batting details." };
    }

    if (role === "bowler" && !hasBowlingDetails(profileForCheck)) {
      return { error: "Please complete your bowling details." };
    }

    return { error: "Please complete all required fields." };
  }

  profileUpdate.onboarding_completed = true;

  const { error } = await supabase.from("profiles").upsert(profileUpdate, {
    onConflict: "id",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/onboarding");
  revalidatePath("/dashboard");
  revalidatePath("/profile");

  redirect(dashboardRoute);
}
