import { NextRequest, NextResponse } from "next/server";

import { getReportClaimDecision } from "@/lib/reports/access";
import { ANONYMOUS_REPORT_COOKIE } from "@/lib/reports/anonymousToken";
import {
  createReportServiceClient,
  getAnonymousTokenHash,
  getRequestUser,
  reportError,
} from "@/lib/reports/server";
import type { RawReportDatabaseRow } from "@/lib/reports/types";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const user = await getRequestUser(request);
  if (!user) return reportError(401, "AUTH_REQUIRED", "Sign in to claim this report.");

  try {
    const supabase = createReportServiceClient();
    const { data, error } = await supabase.from("reports").select("*").eq("id", id).maybeSingle();
    if (error) return reportError(500, "REPORT_READ_FAILED", "Failed to load report.", true);
    if (!data) return reportError(404, "REPORT_NOT_FOUND", "Report not found.");

    const tokenHash = getAnonymousTokenHash(request);
    const decision = getReportClaimDecision(data as RawReportDatabaseRow, user.id, tokenHash);
    if (decision === "conflict") {
      return reportError(409, "REPORT_ALREADY_OWNED", "This report belongs to another account.");
    }
    if (decision === "denied") {
      return reportError(403, "INVALID_ANONYMOUS_PROOF", "This report cannot be claimed by this session.");
    }

    if (decision === "claim") {
      const { data: claimed, error: claimError } = await supabase
        .from("reports")
        .update({ user_id: user.id, anonymous_token_hash: null })
        .eq("id", id)
        .is("user_id", null)
        .eq("anonymous_token_hash", tokenHash)
        .select("id")
        .maybeSingle();
      if (claimError) return reportError(500, "CLAIM_FAILED", "Failed to claim report.", true);

      if (!claimed) {
        const { data: current } = await supabase
          .from("reports")
          .select("user_id")
          .eq("id", id)
          .maybeSingle();
        if (current?.user_id !== user.id) {
          return reportError(409, "CLAIM_CONFLICT", "Report ownership changed. Refresh and try again.");
        }
      }
    }

    const response = NextResponse.json({ success: true, reportId: id });
    response.cookies.delete(ANONYMOUS_REPORT_COOKIE);
    return response;
  } catch (error) {
    console.error("Report claim failed:", error);
    return reportError(500, "CLAIM_FAILED", "Failed to claim report.", true);
  }
}
