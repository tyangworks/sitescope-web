import { NextResponse } from "next/server";

import { sanitizeReturnPath } from "@/lib/auth/redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = sanitizeReturnPath(requestUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const response = NextResponse.redirect(new URL(next, requestUrl.origin));
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }
  }

  const errorUrl = new URL("/login", requestUrl.origin);
  errorUrl.searchParams.set("error", "auth_callback_failed");
  errorUrl.searchParams.set("next", next);
  const response = NextResponse.redirect(errorUrl);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
