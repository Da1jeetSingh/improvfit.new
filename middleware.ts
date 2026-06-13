import { type NextRequest, NextResponse } from "next/server";

import { isLoginRoute, isProtectedRoute, isSignupRoute } from "@/lib/auth";
import {
  applySessionCookies,
  updateSession,
} from "@/lib/supabase/middleware";

function redirectWithSession(
  url: URL,
  supabaseResponse: NextResponse,
) {
  return applySessionCookies(NextResponse.redirect(url), supabaseResponse);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let sessionResult;

  try {
    sessionResult = await updateSession(request);
  } catch {
    if (isProtectedRoute(pathname)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  const { supabaseResponse, user } = sessionResult;

  if (!user && isProtectedRoute(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return redirectWithSession(loginUrl, supabaseResponse);
  }

  if (user && isLoginRoute(pathname)) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return redirectWithSession(dashboardUrl, supabaseResponse);
  }

  if (user && isSignupRoute(pathname)) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return redirectWithSession(dashboardUrl, supabaseResponse);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
