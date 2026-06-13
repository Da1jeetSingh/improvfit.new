import { type NextRequest, NextResponse } from "next/server";

import {
  clearSupabaseAuthCookies,
  createRouteHandlerClient,
} from "@/lib/supabase/route-handler";

async function signOut(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  const supabase = createRouteHandlerClient(request, response);

  await supabase.auth.signOut({ scope: "global" });
  clearSupabaseAuthCookies(request, response);

  return response;
}

export async function POST(request: NextRequest) {
  return signOut(request);
}

export async function GET(request: NextRequest) {
  return signOut(request);
}
