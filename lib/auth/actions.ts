"use server";

import { redirect } from "next/navigation";

import {
  dashboardRoute,
  onboardingRoute,
  sanitizeNextPath,
} from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
  message?: string;
};

function authFailureMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export async function login(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? dashboardRoute);

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }
  } catch (error) {
    console.error("[auth] login failed:", error);
    return { error: authFailureMessage(error, "Sign in failed.") };
  }

  redirect(sanitizeNextPath(next));
}

export async function signup(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const ageText = String(formData.get("age") ?? "").trim();

  if (!fullName) {
    return { error: "Name is required." };
  }

  if (!ageText) {
    return { error: "Age is required." };
  }

  const age = Number(ageText);
  if (!Number.isInteger(age) || age < 5 || age > 100) {
    return { error: "Age must be a whole number between 5 and 100." };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      return { error: error.message };
    }

    if (!data.user) {
      return { error: "Account creation failed. Please try again." };
    }

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
        age,
      },
      { onConflict: "id" },
    );

    if (profileError) {
      return { error: profileError.message };
    }
  } catch (error) {
    console.error("[auth] signup failed:", error);
    return { error: authFailureMessage(error, "Account creation failed.") };
  }

  redirect(onboardingRoute);
}


export async function logout() {
  redirect("/auth/logout");
}
