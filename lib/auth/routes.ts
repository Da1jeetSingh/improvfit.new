export const protectedRoutes = [
  "/dashboard",
  "/weekly",
  "/recap",
  "/stats",
  "/milestones",
  "/profile",
  "/settings",
  "/training",
  "/matches",
  "/goals",
] as const;

export const loginRoute = "/login" as const;
export const signupRoute = "/signup" as const;
export const forgotPasswordRoute = "/auth/forgot-password" as const;
export const updatePasswordRoute = "/auth/update-password" as const;
export const homeRoute = "/" as const;
export const dashboardRoute = "/dashboard" as const;
export const onboardingRoute = "/onboarding" as const;

export const authRoutes = [loginRoute, signupRoute] as const;

export function isProtectedRoute(pathname: string) {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isOnboardingRoute(pathname: string) {
  return pathname === onboardingRoute || pathname.startsWith(`${onboardingRoute}/`);
}

export function isLoginRoute(pathname: string) {
  return pathname === loginRoute || pathname.startsWith(`${loginRoute}/`);
}

export function isSignupRoute(pathname: string) {
  return pathname === signupRoute || pathname.startsWith(`${signupRoute}/`);
}

export function isAuthRoute(pathname: string) {
  return isLoginRoute(pathname) || isSignupRoute(pathname);
}

export function isHomeRoute(pathname: string) {
  return pathname === homeRoute;
}

export function sanitizeNextPath(next: string | null | undefined) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return dashboardRoute;
  }

  if (isAuthRoute(next) || next === homeRoute) {
    return dashboardRoute;
  }

  return next;
}
