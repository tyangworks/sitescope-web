import type { NextRequest } from "next/server";

import { refreshSupabaseSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const response = await refreshSupabaseSession(request);
  if (/^\/(report(?:\/|$)|reports(?:\/|$)|login(?:\/|$)|auth(?:\/|$)|success(?:\/|$)|cancel(?:\/|$)|api(?:\/|$))/.test(request.nextUrl.pathname)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
