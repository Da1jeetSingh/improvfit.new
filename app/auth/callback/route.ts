import { type NextRequest, NextResponse } from "next/server";

import { onboardingRoute, sanitizeNextPath } from "@/lib/auth/routes";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const next = sanitizeNextPath(searchParams.get("next") ?? onboardingRoute);
  const errorRedirect = new URL("/login?error=auth_callback_failed", request.url);

  if (!code) {
    return NextResponse.redirect(errorRedirect);
  }

  const redirectUrl = new URL(next, request.url);
  const response = NextResponse.redirect(redirectUrl);
  const supabase = createRouteHandlerClient(request, response);
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth] callback exchange failed:", error.message);
    return NextResponse.redirect(errorRedirect);
  }

  return response;
}
