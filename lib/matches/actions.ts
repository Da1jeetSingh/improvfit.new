"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  dismissalTypes,
  matchFormats,
  matchSelect,
  type DismissalType,
  type MatchFormat,
} from "@/types/match";

export type MatchActionState = {
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

function parseNonNegativeInt(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  if (!text) {
    return null;
  }

  const parsed = Number(text);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
}

function computeStrikeRate(runs: number | null, ballsFaced: number | null) {
  if (runs === null || ballsFaced === null || ballsFaced === 0) {
    return null;
  }

  return Math.round((runs / ballsFaced) * 10000) / 100;
}

function parseMatchForm(formData: FormData) {
  const playedOn = parseOptionalText(formData.get("played_on"));
  if (!playedOn) {
    return { error: "Match date is required." as const };
  }

  const runs = parseNonNegativeInt(formData.get("runs"));
  if (runs === undefined) {
    return { error: "Runs scored must be a whole number of 0 or more." as const };
  }

  const ballsFaced = parseNonNegativeInt(formData.get("balls_faced"));
  if (ballsFaced === undefined) {
    return { error: "Balls faced must be a whole number of 0 or more." as const };
  }

  const fours = parseNonNegativeInt(formData.get("fours"));
  if (fours === undefined) {
    return { error: "Fours must be a whole number of 0 or more." as const };
  }

  const sixes = parseNonNegativeInt(formData.get("sixes"));
  if (sixes === undefined) {
    return { error: "Sixes must be a whole number of 0 or more." as const };
  }

  return {
    data: {
      played_on: playedOn,
      opposition: parseOptionalText(formData.get("opposition")),
      format: parseOptionalEnum<MatchFormat>(formData.get("format"), matchFormats),
      runs,
      balls_faced: ballsFaced,
      strike_rate: computeStrikeRate(runs, ballsFaced),
      fours,
      sixes,
      dismissal_type: parseOptionalEnum<DismissalType>(
        formData.get("dismissal_type"),
        dismissalTypes,
      ),
      notes: parseOptionalText(formData.get("notes")),
    },
  };
}

export async function createMatch(
  _prevState: MatchActionState,
  formData: FormData,
): Promise<MatchActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to save a match." };
  }

  const parsed = parseMatchForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const { data, error } = await supabase
    .from("matches")
    .insert({
      user_id: user.id,
      ...parsed.data,
    })
    .select(matchSelect)
    .single();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return { error: "Match could not be saved. Please try again." };
  }

  revalidatePath("/matches");
  revalidatePath("/dashboard");

  return { message: "Match saved." };
}

export async function updateMatch(
  _prevState: MatchActionState,
  formData: FormData,
): Promise<MatchActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to update a match." };
  }

  const matchId = String(formData.get("match_id") ?? "").trim();
  if (!matchId) {
    return { error: "Match not found." };
  }

  const parsed = parseMatchForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const { error } = await supabase
    .from("matches")
    .update(parsed.data)
    .eq("id", matchId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/matches");
  revalidatePath("/dashboard");
  revalidatePath(`/matches/${matchId}/edit`);
  redirect("/matches");
}

export async function deleteMatch(matchId: string): Promise<MatchActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to delete a match." };
  }

  const { error } = await supabase
    .from("matches")
    .delete()
    .eq("id", matchId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/matches");
  revalidatePath("/dashboard");

  return { message: "Match deleted." };
}
