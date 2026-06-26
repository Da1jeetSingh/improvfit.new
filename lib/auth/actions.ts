"use server";

import { redirect } from "next/navigation";

import {
  dashboardRoute,
  loginRoute,
  onboardingRoute,
  sanitizeNextPath,
  updatePasswordRoute,
} from "@/lib/auth/routes";
import { mapLoginError, mapSignupError } from "@/lib/auth/errors";
import { getAuthCallbackUrl } from "@/lib/auth/site-url";
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
      return { error: mapLoginError(error) };
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
      options: {
        emailRedirectTo: getAuthCallbackUrl(onboardingRoute),
      },
    });

    if (error) {
      return { error: mapSignupError(error) };
    }

    if (data.user?.identities?.length === 0) {
      return {
        error:
          "An account with this email already exists. Log in instead, or reset your password.",
      };
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

export async function requestPasswordReset(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Email is required." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getAuthCallbackUrl(updatePasswordRoute),
    });

    if (error) {
      return { error: error.message };
    }
  } catch (error) {
    console.error("[auth] password reset request failed:", error);
    return {
      error: authFailureMessage(error, "Could not send reset email."),
    };
  }

  return {
    message:
      "If an account exists for that email, a password reset link is on its way.",
  };
}

export async function updatePassword(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!password || !confirmPassword) {
    return { error: "Both password fields are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        error: "Your reset link has expired. Request a new password reset.",
      };
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { error: error.message };
    }
  } catch (error) {
    console.error("[auth] password update failed:", error);
    return { error: authFailureMessage(error, "Could not update password.") };
  }

  redirect(dashboardRoute);
}

export async function logout() {
  redirect("/auth/logout");
}
