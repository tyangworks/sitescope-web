import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { projectSearchVisibility, projectAnonymousReport, projectFreeReport } from "../lib/reports/projections.ts";
import type { RawReportDatabaseRow } from "../lib/reports/types.ts";
import { growthPages } from "../lib/growthPages.ts";
const source = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
test("anonymous Top 3 prioritizes severe findings without mutating stored order", () => {
  const raw = { seo_issues: [
    { issue: "optional signal", priority: "low", impact: "Low" },
    { issue: "blocked indexing", priority: "high", impact: "High" },
    { issue: "missing metadata", impact: "High" },
    { issue: "unclear structure", priority: "medium", impact: "Medium" },
  ] } as unknown as RawReportDatabaseRow;
  assert.deepEqual(projectAnonymousReport(raw).seo_issues.map((issue) => issue.issue), ["blocked indexing", "missing metadata", "unclear structure"]);
  assert.equal((raw.seo_issues as { issue: string }[])[0].issue, "optional signal");
});
test("readiness projection rejects invalid scores and strips nested paid data", () => {
  const score = { version: 1, scope: "single_page", seo_score: 50, geo_score: 60, categories: { entityClarity: 50, contentStructure: 50, evidenceTrust: 50, structuredData: 50, answerability: 50, topicalAuthority: 50, fix_plans: "SECRET" }, fix_plans: "SECRET", code_snippet: "SECRET" };
  assert.ok(projectSearchVisibility(score));
  assert.equal(projectSearchVisibility({ ...score, geo_score: NaN }), undefined);
  assert.equal(projectSearchVisibility({ ...score, version: 2 }), undefined);
  const raw = { id: "fixture", score: 50, search_visibility: score, seo_issues: Array.from({ length: 5 }, () => ({ issue: "GEO issue", category: "GEO", impact: "Medium", fix: "Review", evidence: "SECRET", code_snippet: "SECRET" })), fix_plans: [{ action: "SECRET" }] } as unknown as RawReportDatabaseRow;
  const preview = projectAnonymousReport(raw);
  assert.equal(preview.seo_issues.length, 3);
  assert.equal(preview.seo_issues[0].category, "GEO");
  assert.ok(!JSON.stringify(preview).includes("SECRET"));
  assert.ok(!JSON.stringify(projectFreeReport(raw)).includes("SECRET"));
});
test("curated landing intents are unique and have checks and FAQ", () => {
  assert.equal(growthPages.length, 5);
  assert.equal(new Set(growthPages.map((page) => page.slug)).size, 5);
  for (const page of growthPages) { assert.ok(page.checks.length >= 3); assert.ok(page.faq.length >= 2); assert.ok(page.zhDescription); }
});
test("private routes are noindex, sitemap is public-only and sample is fictional", () => {
  for (const route of ["report", "reports", "login", "auth", "success", "cancel"]) assert.match(source(`../app/${route}/layout.tsx`), /index: false/);
  assert.doesNotMatch(source("../app/sitemap.ts"), /"\/reports?"|"\/login"|"\/success"|"\/cancel"/);
  assert.match(source("../app/sample-report/SampleReport.tsx"), /Illustrative fictional data/);
  assert.doesNotMatch(source("../app/sample-report/SampleReport.tsx"), /supabase|\/api\/reports/);
  assert.doesNotMatch(source("../app/components/SiteHeader.tsx"), /href: "\/(seo|geo|ai-visibility)/);
});
