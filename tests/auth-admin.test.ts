import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { isConfiguredAdminEmail } from "../lib/auth/admin.ts";
import { sanitizeReturnPath } from "../lib/auth/redirect.ts";

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

test("return paths allow same-site context and reject open redirects", () => {
  assert.equal(sanitizeReturnPath("/report/abc?tab=issues"), "/report/abc?tab=issues");
  assert.equal(sanitizeReturnPath("https://evil.example/report"), "/reports");
  assert.equal(sanitizeReturnPath("//evil.example/report"), "/reports");
  assert.equal(sanitizeReturnPath(null), "/reports");
});

test("admin identity requires an exact configured email", () => {
  assert.equal(
    isConfiguredAdminEmail("TYANG.WORKS@gmail.com", "tyang.works@gmail.com"),
    true,
  );
  assert.equal(
    isConfiguredAdminEmail("other@example.com", "tyang.works@gmail.com"),
    false,
  );
  assert.equal(isConfiguredAdminEmail("tyang.works@gmail.com", ""), false);
});

test("login supports OAuth and Magic Link without password auth", () => {
  const login = source("../app/login/page.tsx");
  assert.match(login, /signInWithOtp/);
  assert.match(login, /signInWithOAuth/);
  assert.match(login, /"google" \| "azure"/);
  assert.doesNotMatch(login, /signInWithPassword|type="password"/);
});

test("OAuth callback exchanges PKCE code and sanitizes return path", () => {
  const callback = source("../app/auth/callback/route.ts");
  assert.match(callback, /exchangeCodeForSession/);
  assert.match(callback, /sanitizeReturnPath/);
  assert.match(callback, /createSupabaseServerClient/);
});

test("session proxy refreshes validated users with getAll and setAll cookies", () => {
  const sessionProxy = source("../lib/supabase/proxy.ts");
  assert.match(sessionProxy, /cookies:\s*\{[\s\S]*getAll\(\)[\s\S]*setAll\(/);
  assert.match(sessionProxy, /supabase\.auth\.getUser\(\)/);
  assert.doesNotMatch(sessionProxy, /getSession\(/);
});

test("logout clears the server-side Supabase session", () => {
  const signout = source("../app/auth/signout/route.ts");
  assert.match(signout, /supabase\.auth\.signOut\(\)/);
  assert.match(signout, /status: 303/);
});

test("admin delete verifies server user and configured identity", () => {
  const route = source("../app/api/admin/reports/[id]/route.ts");
  const userCheck = route.indexOf("getRequestUser(request)");
  const adminCheck = route.indexOf("isAdminUser(user)");
  const serviceClient = route.indexOf("createReportServiceClient()");
  assert.ok(userCheck >= 0 && adminCheck > userCheck && serviceClient > adminCheck);
  assert.doesNotMatch(route, /x-admin-key|localStorage/);
});

test("report admin UI is driven by server identity and the Web BFF", () => {
  const reportPage = source("../app/report/[id]/page.tsx");
  assert.match(reportPage, /\/api\/auth\/me/);
  assert.match(reportPage, /\/api\/admin\/reports\//);
  assert.doesNotMatch(reportPage, /admin_key|x-admin-key/);
});

test("language state uses a stable server snapshot during hydration", () => {
  const i18n = source("../lib/i18n.ts");
  assert.match(i18n, /useSyncExternalStore/);
  assert.match(i18n, /getServerLanguage/);
  assert.doesNotMatch(i18n, /window\.location\.reload/);
});
