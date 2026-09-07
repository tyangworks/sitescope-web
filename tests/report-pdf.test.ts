import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

test("PDF route uses the authorized Pro report projection and server-only renderer secret", () => {
  const route = source("../app/api/reports/[id]/pdf/route.ts");
  assert.match(route, /getAuthorizedProReport/);
  assert.match(route, /authorized\.projection/);
  assert.match(route, /process\.env\.PDF_RENDER_SECRET/);
  assert.doesNotMatch(route, /NEXT_PUBLIC_PDF_RENDER_SECRET/);
  assert.match(route, /application\/pdf/);
});

test("report UI exposes PDF download only for Pro reports and preserves sharing", () => {
  const page = source("../app/report/[id]/page.tsx");
  assert.match(page, /isPro && \(/);
  assert.match(page, /\/api\/reports\/\$\{encodeURIComponent\(reportId\)\}\/pdf/);
  assert.match(page, /navigator\.clipboard\.writeText/);
});
