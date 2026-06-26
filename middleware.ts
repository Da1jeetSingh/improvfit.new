import { type NextRequest, NextResponse } from "next/server";

import { isAdminRoute, isFounderEmail } from "@/lib/admin/access";
import {
  dashboardRoute,
  isAuthRoute,
  isHomeRoute,
  isOnboardingRoute,
  isProtectedRoute,
  onboardingRoute,
  sanitizeNextPath,
} from "@/lib/auth";
import {
  applySessionCookies,
  updateSession,
} from "@/lib/supabase/middleware";

function redirectWithSession(url: URL, supabaseResponse: NextResponse) {
  return applySessionCookies(NextResponse.redirect(url), supabaseResponse);
}

async function isOnboardingComplete(
  request: NextRequest,
  userId: string,
): Promise<boolean> {
  const { createServerClient } = await import("@supabase/ssr");
  const { getSupabaseEnv } = await import("@/lib/supabase/env");
  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll() {},
    },
  });

  const { data, error } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return Boolean(data.onboarding_completed);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let sessionResult;

  try {
    sessionResult = await updateSession(request);
  } catch {
    if (
      isProtectedRoute(pathname) ||
      isOnboardingRoute(pathname) ||
      isAdminRoute(pathname)
    ) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  const { supabaseResponse, user } = sessionResult;

  if (user) {
    const onboardingComplete = await isOnboardingComplete(request, user.id);

    if (isAdminRoute(pathname) && !isFounderEmail(user.email)) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = dashboardRoute;
      dashboardUrl.search = "";
      return redirectWithSession(dashboardUrl, supabaseResponse);
    }

    if (!onboardingComplete && isProtectedRoute(pathname)) {
      const onboardingUrl = request.nextUrl.clone();
      onboardingUrl.pathname = onboardingRoute;
      onboardingUrl.search = "";
      return redirectWithSession(onboardingUrl, supabaseResponse);
    }

    if (onboardingComplete && isOnboardingRoute(pathname)) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = dashboardRoute;
      dashboardUrl.search = "";
      return redirectWithSession(dashboardUrl, supabaseResponse);
    }

    if (isAuthRoute(pathname) || isHomeRoute(pathname)) {
      const next = sanitizeNextPath(request.nextUrl.searchParams.get("next"));
      const destination = request.nextUrl.clone();
      destination.pathname = isAuthRoute(pathname)
        ? onboardingComplete
          ? next
          : onboardingRoute
        : onboardingComplete
          ? dashboardRoute
          : onboardingRoute;
      destination.search = "";
      return redirectWithSession(destination, supabaseResponse);
    }

    return supabaseResponse;
  }

  if (
    isProtectedRoute(pathname) ||
    isOnboardingRoute(pathname) ||
    isAdminRoute(pathname)
  ) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return redirectWithSession(loginUrl, supabaseResponse);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
