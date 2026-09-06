import type { NextRequest } from "next/server";
import { createReportServiceClient, getAnonymousTokenHash } from "./server";
import { purchaseDecision } from "./publication";
import type { RawReportDatabaseRow } from "./types";

export class PurchaseAccessError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function preparePurchaseReport(request: NextRequest, reportId: string, userId: string | null) {
  const db = createReportServiceClient();
  const { data, error } = await db.from("reports").select("*").eq("id", reportId).maybeSingle();
  if (error) throw new PurchaseAccessError("Unable to read report.", 500);
  if (!data) throw new PurchaseAccessError("Report not found.", 404);
  const report = data as RawReportDatabaseRow;
  const decision = purchaseDecision(report, userId, getAnonymousTokenHash(request));
  if (decision === "owned") {
    if (userId && !report.user_id) {
      const { data: claimed, error: claimError } = await db.from("reports").update({ user_id: userId, anonymous_token_hash: null })
        .eq("id", report.id).is("user_id", null).eq("anonymous_token_hash", report.anonymous_token_hash).select("*").maybeSingle();
      if (claimError || !claimed) throw new PurchaseAccessError("Please refresh to confirm report ownership.", 409);
      return claimed as RawReportDatabaseRow;
    }
    return report;
  }
  if (decision === "denied") throw new PurchaseAccessError("Report not found.", 404);
  if (decision === "login") throw new PurchaseAccessError("Sign in to purchase your own copy of this public report.", 401);
  // Purchase is bound to a private snapshot, never the public author's paid flag.
  const { error: cloneError } = await db.from("reports").upsert({
    user_id: userId, source_report_id: report.id, is_public: false, is_paid: false,
    url: report.url, score: report.score, summary: report.summary,
    screenshot_url: report.screenshot_url, seo_issues: report.seo_issues,
    content_suggestions: report.content_suggestions, fix_plans: report.fix_plans,
    search_visibility: report.search_visibility,
  }, { onConflict: "user_id,source_report_id", ignoreDuplicates: true });
  if (cloneError) throw new PurchaseAccessError("Could not prepare your report copy.", 500);
  const { data: copy, error: readError } = await db.from("reports").select("*")
    .eq("user_id", userId).eq("source_report_id", report.id).single();
  if (readError || !copy) throw new PurchaseAccessError("Could not read your report copy.", 500);
  return copy as RawReportDatabaseRow;
}
