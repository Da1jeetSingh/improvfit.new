import { createClient } from "@/lib/supabase/server";

export const protectedRoutes = [
  "/dashboard",
  "/weekly",
  "/stats",
  "/milestones",
  "/profile",
  "/training",
  "/matches",
  "/goals",
] as const;

export const loginRoute = "/login" as const;
export const signupRoute = "/signup" as const;
export const homeRoute = "/" as const;
export const dashboardRoute = "/dashboard" as const;

export const authRoutes = [loginRoute, signupRoute] as const;

export function isProtectedRoute(pathname: string) {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
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

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("[auth] getSession validation failed:", error.message);
    await supabase.auth.signOut();
    return null;
  }

  if (!user) {
    return null;
  }

  return { user };
}
