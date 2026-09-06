import assert from "node:assert/strict";
if (!process.argv.includes("--create-disposable-report")) throw new Error("Explicit opt-in required: creates one disposable report, no payment or deletion.");
const base = "https://www.sitescope.fyi";
const response = await fetch(base + "/api/analyze", {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://example.com/?sitescope-growth-check=20260905", language: "en" }),
});
assert.equal(response.status, 200, "Analysis request failed");
const result = await response.json();
assert.ok(result.success && result.id);
assert.ok(!("fix_plans" in result) && !("seo_issues" in result));
const cookie = response.headers.getSetCookie().find((value) => value.startsWith("sitescope_anonymous_report="));
assert.ok(cookie, "Anonymous ownership cookie missing");
assert.match(cookie, /HttpOnly/i);
assert.match(cookie, /Secure/i);
assert.match(cookie, /SameSite=lax/i);
const reportPath = `/api/reports/${result.id}`;
const owned = await fetch(base + reportPath, { headers: { Cookie: cookie.split(";")[0] } });
assert.equal(owned.status, 200);
const data = await owned.json();
assert.equal(data.access_level, "anonymous");
assert.ok(data.seo_issues.length <= 3);
const forbidden = new Set(["fix_plans", "code_snippet", "implementation_steps", "user_id", "anonymous_token_hash", "evidence", "why_it_matters"]);
function inspect(value) {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) { assert.ok(!forbidden.has(key), `Unexpected private field: ${key}`); inspect(child); }
}
inspect(data);
assert.equal(data.search_visibility.version, 1);
const stranger = await fetch(base + reportPath);
assert.ok([403, 404].includes(stranger.status), "Report ID alone must not grant access");
console.log(JSON.stringify({ audit: "PASS", reportId: result.id, cached: result.cached, ownershipCookie: "HttpOnly Secure SameSite=Lax", issues: data.seo_issues.length, proLeakage: false, readiness: true, strangerStatus: stranger.status }));
