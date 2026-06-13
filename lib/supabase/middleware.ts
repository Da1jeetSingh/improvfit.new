import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getSupabaseEnv } from "./env";

export type SessionUpdateResult = {
  supabaseResponse: NextResponse;
  user: Awaited<
    ReturnType<
      Awaited<ReturnType<typeof createServerClient>>["auth"]["getUser"]
    >
  >["data"]["user"];
};

export function applySessionCookies(
  response: NextResponse,
  supabaseResponse: NextResponse,
) {
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });

  return response;
}

export async function updateSession(
  request: NextRequest,
): Promise<SessionUpdateResult> {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        supabaseResponse = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("[auth] invalid or expired session:", error.message);
    await supabase.auth.signOut();
    return { supabaseResponse, user: null };
  }

  return { supabaseResponse, user };
}
