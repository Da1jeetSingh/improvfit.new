import { createClient } from "@/lib/supabase/server";

import {
  authRoutes,
  dashboardRoute,
  forgotPasswordRoute,
  homeRoute,
  isAuthRoute,
  isHomeRoute,
  isLoginRoute,
  isOnboardingRoute,
  isProtectedRoute,
  isSignupRoute,
  loginRoute,
  onboardingRoute,
  protectedRoutes,
  sanitizeNextPath,
  signupRoute,
  updatePasswordRoute,
} from "@/lib/auth/routes";

export {
  authRoutes,
  dashboardRoute,
  forgotPasswordRoute,
  homeRoute,
  isAuthRoute,
  isHomeRoute,
  isLoginRoute,
  isOnboardingRoute,
  isProtectedRoute,
  isSignupRoute,
  loginRoute,
  onboardingRoute,
  protectedRoutes,
  sanitizeNextPath,
  signupRoute,
  updatePasswordRoute,
};

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("[auth] getSession validation failed:", error.message);
    return null;
  }

  if (!user) {
    return null;
  }

  return { user };
}

export async function getPostAuthDestination() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return loginRoute;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.onboarding_completed) {
    return onboardingRoute;
  }

  return dashboardRoute;
}
