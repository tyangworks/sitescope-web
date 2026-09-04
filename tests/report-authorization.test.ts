import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  getReportAccessLevel,
  getReportClaimDecision,
} from "../lib/reports/access.ts";
import {
  createAnonymousReportToken,
  hashAnonymousReportToken,
} from "../lib/reports/anonymousToken.ts";
import {
  projectAnonymousReport,
  projectFreeReport,
  projectProReport,
  projectReportHistoryItem,
} from "../lib/reports/projections.ts";
import type { RawReportDatabaseRow } from "../lib/reports/types.ts";

function report(overrides: Partial<RawReportDatabaseRow> = {}): RawReportDatabaseRow {
  return {
    id: "report-a",
    url: "https://example.com/",
    created_at: "2026-09-02T00:00:00.000Z",
    updated_at: "2026-09-02T00:00:00.000Z",
    score: 72,
    summary: "Public summary",
    screenshot_url: "https://example.test/screenshot.jpg",
    is_paid: false,
    user_id: null,
    anonymous_token_hash: null,
    seo_issues: [
      { issue: "One", impact: "High", fix: "Fix one", private: "secret" },
      { issue: "Two", impact: "Medium", fix: "Fix two" },
      { issue: "Three", impact: "Low", fix: "Fix three" },
      { issue: "Four", impact: "High", fix: "Fix four" },
    ],
    content_suggestions: [
      { area: "Copy", suggestion: "Improve copy", debug: "secret" },
      { area: "CTA", suggestion: "Improve CTA" },
      { area: "SEO", suggestion: "Improve SEO" },
    ],
    fix_plans: [
      {
        step: 1,
        action: "Change markup",
        code_snippet: "<main />",
        priority: "high",
        category: "Technical",
        rationale: "The markup blocks clear interpretation.",
        implementation_steps: ["Update the semantic structure"],
        expected_outcome: "Clearer machine and user understanding.",
        internal_prompt: "secret",
      },
    ],
    ...overrides,
  };
}

test("anonymous token is opaque and only its hash is stable", () => {
  const token = createAnonymousReportToken();
  assert.ok(token.length >= 40);
  assert.equal(hashAnonymousReportToken(token).length, 64);
  assert.notEqual(token, hashAnonymousReportToken(token));
});

test("anonymous owner receives anonymous access to an unpaid report", () => {
  const tokenHash = hashAnonymousReportToken("owner-token");
  assert.equal(
    getReportAccessLevel(report({ anonymous_token_hash: tokenHash }), {
      userId: null,
      anonymousTokenHash: tokenHash,
    }),
    "anonymous",
  );
});

test("a different anonymous owner is denied", () => {
  assert.equal(
    getReportAccessLevel(report({ anonymous_token_hash: "owner-hash" }), {
      userId: null,
      anonymousTokenHash: "other-hash",
    }),
    "denied",
  );
});

test("anonymous projection contains at most three issues and two suggestions", () => {
  const projected = projectAnonymousReport(report());
  assert.equal(projected.seo_issues.length, 3);
  assert.equal(projected.content_suggestions.length, 2);
});

test("anonymous and free projections omit Pro fields and raw fields", () => {
  for (const projected of [projectAnonymousReport(report()), projectFreeReport(report())]) {
    assert.equal("fix_plans" in projected, false);
    assert.equal("is_paid" in projected, false);
    assert.equal("user_id" in projected, false);
    assert.equal("anonymous_token_hash" in projected, false);
    assert.equal("private" in projected.seo_issues[0], false);
  }
});

test("authenticated owner receives free access", () => {
  assert.equal(
    getReportAccessLevel(report({ user_id: "user-a" }), {
      userId: "user-a",
      anonymousTokenHash: null,
    }),
    "free",
  );
});

test("authenticated user cannot access another user's report", () => {
  assert.equal(
    getReportAccessLevel(report({ user_id: "user-a" }), {
      userId: "user-b",
      anonymousTokenHash: null,
    }),
    "denied",
  );
});

test("paid owner receives Pro content", () => {
  const raw = report({ user_id: "user-a", is_paid: true });
  assert.equal(
    getReportAccessLevel(raw, { userId: "user-a", anonymousTokenHash: null }),
    "pro",
  );
  assert.equal(projectProReport(raw).fix_plans[0].code_snippet, "<main />");
});

test("free projections strip detailed SEO and GEO evidence", () => {
  const raw = report({
    seo_issues: [{
      issue: "Missing structured data",
      impact: "High",
      fix: "Add Organization schema",
      category: "GEO",
      priority: "high",
      evidence: "No JSON-LD detected",
      why_it_matters: "AI engines need explicit entity context",
      recommendation: "Add verified Organization JSON-LD",
    }],
  });
  const free = projectFreeReport(raw);
  const pro = projectProReport(raw);
  assert.equal("evidence" in free.seo_issues[0], false);
  assert.equal(pro.seo_issues[0].category, "GEO");
  assert.equal(pro.seo_issues[0].evidence, "No JSON-LD detected");
});

test("paid anonymous owner receives report-specific Pro access", () => {
  assert.equal(
    getReportAccessLevel(
      report({ anonymous_token_hash: "owner-hash", is_paid: true }),
      { userId: null, anonymousTokenHash: "owner-hash" },
    ),
    "pro",
  );
});

test("free owner cannot elevate access through unrelated client input", () => {
  const raw = report({ user_id: "user-a", is_paid: false });
  const untrustedQuery = { isPaid: "true", access: "pro", userId: "user-a" };
  assert.equal(untrustedQuery.access, "pro");
  assert.equal(
    getReportAccessLevel(raw, { userId: "user-a", anonymousTokenHash: null }),
    "free",
  );
});

test("claim requires matching anonymous proof", () => {
  const raw = report({ anonymous_token_hash: "owner-hash" });
  assert.equal(getReportClaimDecision(raw, "user-a", "owner-hash"), "claim");
  assert.equal(getReportClaimDecision(raw, "user-a", "other-hash"), "denied");
});

test("claim is idempotent for the same owner", () => {
  assert.equal(
    getReportClaimDecision(report({ user_id: "user-a" }), "user-a", null),
    "already_owned",
  );
});

test("an owned report cannot be stolen", () => {
  assert.equal(
    getReportClaimDecision(report({ user_id: "user-a" }), "user-b", null),
    "conflict",
  );
});

test("legacy unknown-owner reports always receive the safe fallback", () => {
  for (const is_paid of [false, true]) {
    assert.equal(
      getReportAccessLevel(report({ user_id: null, anonymous_token_hash: null, is_paid }), {
        userId: "any-user",
        anonymousTokenHash: "any-token",
      }),
      "anonymous",
    );
  }
});

test("history projection contains no report body or ownership data", () => {
  const item = projectReportHistoryItem(report({ user_id: "user-a" }));
  assert.equal("seo_issues" in item, false);
  assert.equal("fix_plans" in item, false);
  assert.equal("user_id" in item, false);
});

test("RLS lockdown migration removes public report reads", () => {
  const sql = readFileSync(
    new URL(
      "../supabase/migrations/202609020002_lock_down_report_access.sql",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(sql, /DROP POLICY IF EXISTS "Public can read reports"/);
  assert.match(sql, /REVOKE ALL ON TABLE public\.reports FROM anon/);
  assert.doesNotMatch(sql, /USING\s*\(\s*true\s*\)/i);
  assert.doesNotMatch(sql, /WITH CHECK\s*\(\s*true\s*\)/i);
});

test("history API scopes its query to the authenticated user", () => {
  const source = readFileSync(
    new URL("../app/api/reports/route.ts", import.meta.url),
    "utf8",
  );
  assert.match(source, /\.eq\("user_id", user\.id\)/);
  assert.doesNotMatch(source, /seo_issues|fix_plans|anonymous_token_hash/);
});

test("active browser pages contain no direct reports-table reads", () => {
  const browserFiles = [
    "../app/page.tsx",
    "../app/reports/page.tsx",
    "../app/report/[id]/page.tsx",
    "../app/content/[slug]/AuditUrlForm.tsx",
  ];
  for (const file of browserFiles) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");
    assert.doesNotMatch(source, /\.from\(["']reports["']\)/);
    assert.doesNotMatch(source, /\.select\(["']\*["']\)/);
  }
});

test("claim route uses a conditional ownership update", () => {
  const source = readFileSync(
    new URL("../app/api/reports/[id]/claim/route.ts", import.meta.url),
    "utf8",
  );
  assert.match(source, /\.is\("user_id", null\)/);
  assert.match(source, /\.eq\("anonymous_token_hash", tokenHash\)/);
  assert.doesNotMatch(source, /searchParams|userId\s*=/);
});

test("ownership migrations contain no destructive data operations or public grants", () => {
  for (const name of [
    "202609020001_add_report_ownership.sql",
    "202609020002_lock_down_report_access.sql",
  ]) {
    const sql = readFileSync(
      new URL(`../supabase/migrations/${name}`, import.meta.url),
      "utf8",
    );
    assert.doesNotMatch(sql, /DROP\s+(TABLE|COLUMN)/i);
    assert.doesNotMatch(sql, /DELETE\s+FROM/i);
    assert.doesNotMatch(sql, /UPDATE\s+public\.reports/i);
    assert.doesNotMatch(sql, /GRANT\s+/i);
    assert.doesNotMatch(sql, /USING\s*\(\s*true\s*\)/i);
    assert.doesNotMatch(sql, /WITH CHECK\s*\(\s*true\s*\)/i);
  }
});

test("analysis BFF grants rate-limit bypass only after server-side admin verification", () => {
  const source = readFileSync(
    new URL("../app/api/analyze/route.ts", import.meta.url),
    "utf8",
  );
  assert.match(source, /request\.headers\.get\("x-forwarded-for"\)/);
  assert.match(source, /isAdminUser\(user\)/);
  assert.match(source, /process\.env\.ANALYSIS_ADMIN_KEY/);
  assert.match(source, /upstreamHeaders\["x-admin-key"\]/);
  assert.doesNotMatch(source, /request\.headers\.get\("x-admin-key"\)/);
  assert.doesNotMatch(source, /isPaid|access=pro/);
});
