import { createClient } from "@/lib/supabase/server";

export const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/matches",
  "/training",
  "/goals",
] as const;

export const authRoutes = ["/login", "/signup"] as const;

export function isProtectedRoute(pathname: string) {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isAuthRoute(pathname: string) {
  return authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return { user };
}
