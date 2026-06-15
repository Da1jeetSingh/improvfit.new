"use server";

import { revalidatePath } from "next/cache";

import { getCoachMessageAfterSave } from "@/lib/coach";
import { createClient } from "@/lib/supabase/server";
import {
  focusAreas,
  selfRatings,
  trainingSessionSelect,
  type FocusArea,
  type SelfRating,
  type TrainingSession,
} from "@/types/training";

export type TrainingActionState = {
  error?: string;
  message?: string;
  coachMessage?: string;
};

function parseOptionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function parseRequiredEnum<T extends string>(
  value: FormDataEntryValue | null,
  allowed: readonly T[],
  fieldName: string,
) {
  const text = String(value ?? "").trim();
  if (!text) {
    return { error: `${fieldName} is required.` as const };
  }

  if (!allowed.includes(text as T)) {
    return { error: `Choose a valid ${fieldName.toLowerCase()}.` as const };
  }

  return { value: text as T };
}

function parsePositiveInt(
  value: FormDataEntryValue | null,
  fieldName: string,
  required = false,
) {
  const text = String(value ?? "").trim();
  if (!text) {
    return required
      ? { error: `${fieldName} is required.` as const }
      : { value: null as number | null };
  }

  const parsed = Number(text);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return { error: `${fieldName} must be a whole number greater than 0.` as const };
  }

  return { value: parsed };
}

function parseNonNegativeInt(value: FormDataEntryValue | null, fieldName: string) {
  const text = String(value ?? "").trim();
  if (!text) {
    return { value: null as number | null };
  }

  const parsed = Number(text);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return {
      error: `${fieldName} must be a whole number of 0 or more.` as const,
    };
  }

  return { value: parsed };
}

function parseSelfRating(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  if (!text) {
    return { value: null as SelfRating | null };
  }

  const parsed = Number(text);
  if (!selfRatings.includes(parsed as SelfRating)) {
    return { error: "Self-rating must be between 1 and 5." as const };
  }

  return { value: parsed as SelfRating };
}

function parseTrainingForm(formData: FormData) {
  const sessionDate = parseOptionalText(formData.get("session_date"));
  if (!sessionDate) {
    return { error: "Date is required." as const };
  }

  const focus = parseRequiredEnum<FocusArea>(
    formData.get("focus"),
    focusAreas,
    "Focus area",
  );
  if ("error" in focus) {
    return { error: focus.error };
  }

  const duration = parsePositiveInt(
    formData.get("duration_minutes"),
    "Duration",
    true,
  );
  if ("error" in duration) {
    return { error: duration.error };
  }

  const ballsFaced = parseNonNegativeInt(
    formData.get("balls_faced"),
    "Balls faced",
  );
  if ("error" in ballsFaced) {
    return { error: ballsFaced.error };
  }

  const oversBowledText = String(formData.get("overs_bowled") ?? "").trim();
  let oversBowled: number | null = null;
  if (oversBowledText) {
    const parsed = Number(oversBowledText);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return { error: "Overs bowled must be 0 or more." as const };
    }
    oversBowled = Math.round(parsed * 10) / 10;
  }

  const ballsBowled = parseNonNegativeInt(
    formData.get("balls_bowled"),
    "Balls bowled",
  );
  if ("error" in ballsBowled) {
    return { error: ballsBowled.error };
  }

  const selfRating = parseSelfRating(formData.get("self_rating"));
  if ("error" in selfRating) {
    return { error: selfRating.error };
  }

  return {
    data: {
      session_date: sessionDate,
      focus: focus.value,
      duration_minutes: duration.value,
      balls_faced: ballsFaced.value,
      overs_bowled: oversBowled,
      balls_bowled: ballsBowled.value,
      self_rating: selfRating.value,
      notes: parseOptionalText(formData.get("notes")),
    },
  };
}

export async function createTrainingSession(
  _prevState: TrainingActionState,
  formData: FormData,
): Promise<TrainingActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to save a training session." };
  }

  const parsed = parseTrainingForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const { data, error } = await supabase
    .from("training_sessions")
    .insert({
      user_id: user.id,
      ...parsed.data,
    })
    .select(trainingSessionSelect)
    .single();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return { error: "Training session could not be saved. Please try again." };
  }

  revalidatePath("/training");
  revalidatePath("/dashboard");

  const coach = await getCoachMessageAfterSave(
    "training_saved",
    data as TrainingSession,
  );

  return {
    message: "Training session saved.",
    coachMessage: coach?.text,
  };
}
