import type { RawReportDatabaseRow } from "./types";
export function isPublicReport(report: Pick<RawReportDatabaseRow, "is_public" | "user_id" | "anonymous_token_hash">) {
  return report.is_public === true || (!report.user_id && !report.anonymous_token_hash);
}
export function ownsReport(report: Pick<RawReportDatabaseRow, "user_id" | "anonymous_token_hash">, userId: string | null, tokenHash: string | null) {
  return report.user_id ? report.user_id === userId : Boolean(report.anonymous_token_hash && report.anonymous_token_hash === tokenHash);
}
export function purchaseDecision(report: RawReportDatabaseRow, userId: string | null, tokenHash: string | null) {
  if (ownsReport(report, userId, tokenHash)) return "owned";
  if (!isPublicReport(report)) return "denied";
  return userId ? "copy" : "login";
}
