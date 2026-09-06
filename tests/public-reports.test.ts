import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getReportAccessLevel } from "../lib/reports/access.ts";
import { purchaseDecision, isPublicReport } from "../lib/reports/publication.ts";
import { projectAnonymousReport } from "../lib/reports/projections.ts";
import type { RawReportDatabaseRow } from "../lib/reports/types.ts";
const published = { id: "public", user_id: "author", anonymous_token_hash: null, is_public: true, is_paid: true, fix_plans: [{ action: "secret" }], seo_issues: Array.from({ length: 8 }, () => ({ issue: "Problem", fix: "Free advice", evidence: "secret" })) } as unknown as RawReportDatabaseRow;
test("public author payment never grants visitors Pro or ownership", () => {
  for (const userId of [null, "visitor"]) {
    assert.equal(getReportAccessLevel(published, { userId, anonymousTokenHash: null }), "anonymous");
    assert.ok(!JSON.stringify(projectAnonymousReport(published)).includes("secret"));
  }
  assert.equal(getReportAccessLevel(published, { userId: "author", anonymousTokenHash: null }), "pro");
  assert.equal(purchaseDecision(published, null, null), "login");
  assert.equal(purchaseDecision(published, "visitor", null), "copy");
  assert.equal(purchaseDecision(published, "author", null), "owned");
});
test("private history stays private and purchased copies do not enter gallery", () => {
  const privateReport = { ...published, is_public: false };
  assert.equal(getReportAccessLevel(privateReport, { userId: "visitor", anonymousTokenHash: null }), "denied");
  assert.equal(purchaseDecision(privateReport, "visitor", null), "denied");
  assert.equal(isPublicReport(privateReport), false);
});
test("credit RPC is atomic, owner-scoped and unavailable to browser roles", () => {
  const sql = readFileSync(new URL("../supabase/migrations/202609060001_public_report_previews.sql", import.meta.url), "utf8");
  assert.match(sql, /FOR UPDATE SKIP LOCKED/);
  assert.match(sql, /user_id = p_user_id FOR UPDATE/);
  assert.match(sql, /FROM auth.users WHERE id = p_user_id/);
  assert.match(sql, /FROM PUBLIC, anon, authenticated/);
  assert.doesNotMatch(sql, /DROP TABLE|DROP COLUMN|USING\s*\(true\)/i);
  const route = readFileSync(new URL("../app/api/redeem-pro-credit/route.ts", import.meta.url), "utf8");
  assert.doesNotMatch(route, /body.email/);
  assert.match(route, /getRequestUser/);
});
