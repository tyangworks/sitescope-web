import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join } from "node:path";
const require = createRequire(new URL("../../sitescope-crawler/package.json", import.meta.url));
const { chromium } = require("playwright");
const base = "https://www.sitescope.fyi";
const browser = await chromium.launch();
const results = [];
try {
  const context = await browser.newContext();
  // This smoke suite must never submit audits, payments, leads, or deletion requests.
  await context.route("**/*", (route) => ["GET", "HEAD", "OPTIONS"].includes(route.request().method()) ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push({ message: error.message, path: "pageerror" }));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push({ message: message.text(), path: new URL(message.location().url || base).pathname });
  });
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/geo-audit", "/ai-visibility-audit", "/website-seo-audit", "/free-website-audit", "/website-conversion-audit", "/sample-report", "/content", "/content/what-is-geo", "/services"]) {
      const response = await page.goto(base + path);
      assert.equal(response.status(), 200, path);
      await page.locator("h1").waitFor();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: overflow ${path}`);
      assert.equal(new URL(await page.locator('link[rel="canonical"]').getAttribute("href")).href, new URL(base + path).href);
    }
    await page.goto(base);
    await page.screenshot({ path: join(tmpdir(), `sitescope-production-growth-${width}.png`) });
    results.push({ width, publicRoutes: 10, overflow: false });
  }
  assert.deepEqual(errors, []);
  const publicConsoleErrors = errors.length;
  for (const path of ["/login", "/reports", "/success", "/cancel"]) {
    await page.goto(base + path);
    assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
  }
  const sitemap = await context.request.get(base + "/sitemap.xml");
  assert.equal(sitemap.status(), 200);
  assert.doesNotMatch(await sitemap.text(), /<loc>[^<]*\/(reports?|login|success|cancel)(\/|<)/);
  const history = await context.request.get(base + "/api/reports");
  assert.equal(history.status(), 401);
  const health = await context.request.get("https://api.sitescope.fyi/health");
  assert.equal(health.status(), 200);
  const version = await context.request.get("https://api.sitescope.fyi/version");
  const metadata = await version.json();
  assert.equal(metadata.commit, "c7fabaa297cf2d6cc578e99bb8418a462c8c20fd");
  const unexpected = errors.filter((error) => !(error.path === "/api/reports" && /401/.test(error.message)));
  assert.deepEqual(unexpected, []);
  console.log(JSON.stringify({ results, publicConsoleErrors, expectedAnonymousHistoryRejections: errors.length, anonymousHistory: history.status(), version: metadata }));
} finally { await browser.close(); }
