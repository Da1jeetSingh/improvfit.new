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
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    if (data.session) {
      redirect(onboardingRoute);
    }
  } catch (error) {
    console.error("[auth] signup failed:", error);
    return { error: authFailureMessage(error, "Account creation failed.") };
  }

  return {
    message:
      "Account created. Check your email to confirm your address, then sign in.",
  };
}


export async function logout() {
  redirect("/auth/logout");
}
