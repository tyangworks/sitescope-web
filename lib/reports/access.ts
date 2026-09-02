import type { RawReportDatabaseRow, ReportAccessLevel } from "./types";

export type ReportAccessContext = {
  userId: string | null;
  anonymousTokenHash: string | null;
};

export function getReportAccessLevel(
  report: RawReportDatabaseRow,
  context: ReportAccessContext,
): ReportAccessLevel {
  if (report.user_id) {
    if (context.userId !== report.user_id) return "denied";
    return report.is_paid ? "pro" : "free";
  }

  if (report.anonymous_token_hash) {
    if (context.anonymousTokenHash !== report.anonymous_token_hash) {
      return "denied";
    }
    return report.is_paid ? "pro" : "anonymous";
  }

  // Legacy rows have no verifiable owner. Preserve a safe preview only.
  return "anonymous";
}

export type ClaimDecision = "claim" | "already_owned" | "denied" | "conflict";

export function getReportClaimDecision(
  report: RawReportDatabaseRow,
  userId: string,
  anonymousTokenHash: string | null,
): ClaimDecision {
  if (report.user_id === userId) return "already_owned";
  if (report.user_id) return "conflict";
  if (!report.anonymous_token_hash) return "denied";
  if (report.anonymous_token_hash !== anonymousTokenHash) return "denied";
  return "claim";
}
