import { type NextRequest, NextResponse } from "next/server";

import {
  dashboardRoute,
  isAuthRoute,
  isHomeRoute,
  isProtectedRoute,
  sanitizeNextPath,
} from "@/lib/auth";
import {
  applySessionCookies,
  updateSession,
} from "@/lib/supabase/middleware";

function redirectWithSession(url: URL, supabaseResponse: NextResponse) {
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

  if (user) {
    if (isAuthRoute(pathname) || isHomeRoute(pathname)) {
      const next = sanitizeNextPath(request.nextUrl.searchParams.get("next"));
      const destination = request.nextUrl.clone();
      destination.pathname = isAuthRoute(pathname) ? next : dashboardRoute;
      destination.search = "";
      return redirectWithSession(destination, supabaseResponse);
    }

    return supabaseResponse;
  }

  if (isProtectedRoute(pathname)) {
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
