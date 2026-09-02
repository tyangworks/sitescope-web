import "server-only";

import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

import {
  getSupabaseServerConfig,
  supabaseServiceRoleEnvMessage,
} from "@/lib/serverEnv";
import {
  ANONYMOUS_REPORT_COOKIE,
  hashAnonymousReportToken,
} from "./anonymousToken";

export class ReportServerConfigurationError extends Error {}

export function createReportServiceClient(): SupabaseClient {
  const { url, serviceRoleKey } = getSupabaseServerConfig();
  if (!url || !serviceRoleKey) {
    throw new ReportServerConfigurationError(supabaseServiceRoleEnvMessage);
  }
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function getRequestUser(request: Request): Promise<User | null> {
  const authorization = request.headers.get("authorization") || "";
  if (!authorization.startsWith("Bearer ")) return null;

  const token = authorization.slice("Bearer ".length).trim();
  if (!token) return null;

  const { url, anonKey } = getSupabaseServerConfig();
  if (!url || !anonKey) return null;

  const authClient = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await authClient.auth.getUser(token);
  return error ? null : data.user;
}

export function getAnonymousTokenHash(request: NextRequest): string | null {
  const token = request.cookies.get(ANONYMOUS_REPORT_COOKIE)?.value;
  return token ? hashAnonymousReportToken(token) : null;
}

export function reportError(
  status: number,
  code: string,
  message: string,
  retryable = false,
) {
  return Response.json({ error: message, code, retryable }, { status });
}
