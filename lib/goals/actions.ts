"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { goalStatuses, type GoalStatus } from "@/types/goal";

export type GoalActionState = {
  error?: string;
  message?: string;
};

function parseOptionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function parseRequiredText(value: FormDataEntryValue | null, fieldName: string) {
  const text = String(value ?? "").trim();
  if (!text) {
    return { error: `${fieldName} is required.` as const };
  }

  return { value: text };
}

function parseOptionalPositiveNumber(value: FormDataEntryValue | null, fieldName: string) {
  const text = String(value ?? "").trim();
  if (!text) {
    return { value: null as number | null };
  }

  const parsed = Number(text);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return { error: `${fieldName} must be greater than 0.` as const };
  }

  return { value: parsed };
}

function parseNonNegativeNumber(
  value: FormDataEntryValue | null,
  fieldName: string,
  defaultValue = 0,
) {
  const text = String(value ?? "").trim();
  if (!text) {
    return { value: defaultValue };
  }

  const parsed = Number(text);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return { error: `${fieldName} must be 0 or more.` as const };
  }

  return { value: parsed };
}

function parseStatus(value: FormDataEntryValue | null) {
  const text = String(value ?? "not_started").trim();
  if (!goalStatuses.includes(text as GoalStatus)) {
    return { error: "Choose a valid status." as const };
  }

  return { value: text as GoalStatus };
}

function parseGoalForm(formData: FormData) {
  const title = parseRequiredText(formData.get("title"), "Title");
  if ("error" in title) {
    return { error: title.error };
  }

  const targetValue = parseOptionalPositiveNumber(
    formData.get("target_value"),
    "Target value",
  );
  if ("error" in targetValue) {
    return { error: targetValue.error };
  }

  const currentValue = parseNonNegativeNumber(
    formData.get("current_value"),
    "Current value",
  );
  if ("error" in currentValue) {
    return { error: currentValue.error };
  }

  const status = parseStatus(formData.get("status"));
  if ("error" in status) {
    return { error: status.error };
  }

  return {
    data: {
      title: title.value,
      target_value: targetValue.value,
      current_value: currentValue.value,
      due_date: parseOptionalText(formData.get("due_date")),
      status: status.value,
    },
  };
}

export async function createGoal(
  _prevState: GoalActionState,
  formData: FormData,
): Promise<GoalActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to create a goal." };
  }

  const parsed = parseGoalForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const { error } = await supabase.from("goals").insert({
    user_id: user.id,
    ...parsed.data,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/goals");

  return { message: "Goal created." };
}

export async function updateGoalProgress(
  _prevState: GoalActionState,
  formData: FormData,
): Promise<GoalActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to update a goal." };
  }

  const goalId = String(formData.get("goal_id") ?? "").trim();
  if (!goalId) {
    return { error: "Goal not found." };
  }

  const currentValue = parseNonNegativeNumber(
    formData.get("current_value"),
    "Current value",
  );
  if ("error" in currentValue) {
    return { error: currentValue.error };
  }

  const status = parseStatus(formData.get("status"));
  if ("error" in status) {
    return { error: status.error };
  }

  const { error } = await supabase
    .from("goals")
    .update({
      current_value: currentValue.value,
      status: status.value,
    })
    .eq("id", goalId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/goals");

  return { message: "Goal updated." };
}

export async function deleteGoal(goalId: string): Promise<GoalActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to delete a goal." };
  }

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/goals");

  return { message: "Goal deleted." };
}
