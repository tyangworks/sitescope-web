import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const ANONYMOUS_REPORT_COOKIE = "sitescope_anonymous_report";
export const ANONYMOUS_REPORT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function createAnonymousReportToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashAnonymousReportToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function anonymousTokenMatchesHash(token: string, expectedHash: string): boolean {
  const actual = Buffer.from(hashAnonymousReportToken(token), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
