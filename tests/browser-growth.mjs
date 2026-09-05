import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join } from "node:path";
// Reuse the integrated product's existing Playwright installation.
const require = createRequire(new URL("../../sitescope-crawler/package.json", import.meta.url));
const { chromium } = require("playwright");
const base = process.argv[2] || process.env.TEST_BASE_URL || "http://localhost:3105";
if (!/^http:\/\/localhost:\d+$/.test(base)) throw new Error("Local test server only");
const browser = await chromium.launch();
const checks = [];
const internalLinks = new Set();
try {
  for (const width of [390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, locale: "en-US" });
    const page = await context.newPage();
    await context.addInitScript(() => {
      window.__growthMetrics = { lcp: null, cls: 0 };
      new PerformanceObserver((list) => { for (const entry of list.getEntries()) window.__growthMetrics.lcp = entry.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__growthMetrics.cls += entry.value; }).observe({ type: "layout-shift", buffered: true });
    });
    let labMetrics;
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await context.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.origin !== base) return route.abort();
      if (url.pathname.startsWith("/api/")) {
        const data = url.pathname === "/api/auth/me" ? { authenticated: false, isAdmin: false } : url.pathname === "/api/analyze" ? { success: true, id: "fixture" } : url.pathname === "/api/reports/fixture" ? { id: "fixture", url: "https://example.test", created_at: "2026-09-05", score: 60, summary: "Fictional test report", screenshot_url: "", access_level: "free", seo_issues: [{ category: "GEO", issue: "Entity clarity", impact: "Medium", fix: "Review public identity" }], content_suggestions: [] } : { reports: [] };
        return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(data) });
      }
      return route.continue();
    });
    for (const path of ["/", "/free-website-audit", "/website-seo-audit", "/ai-visibility-audit", "/geo-audit", "/website-conversion-audit", "/sample-report", "/content/what-is-geo", "/content/seo-vs-geo", "/content/improve-ai-search-visibility", "/content/why-ai-search-may-not-cite-your-website"]) {
      const response = await page.goto(base + path);
      assert.equal(response.status(), 200, path);
      await page.locator("h1").waitFor();
      assert.ok(await page.locator("h1").innerText());
      assert.equal(new URL(await page.locator('link[rel="canonical"]').getAttribute("href")).href, `https://www.sitescope.fyi${path}`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width} overflow ${path}`);
      for (const href of await page.locator('a[href^="/"]').evaluateAll((links) => links.map((link) => link.getAttribute("href").split(/[?#]/)[0] || "/"))) internalLinks.add(href);
      if (path === "/") {
        await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        labMetrics = await page.evaluate(() => window.__growthMetrics);
      }
    }
    await page.goto(base);
    if (width < 1280) await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("button", { name: "中", exact: true }).filter({ visible: true }).click();
    await page.getByRole("heading", { level: 1 }).filter({ hasText: "增长" }).waitFor();
    await page.locator('button[aria-pressed="true"]').filter({ hasText: "中", visible: true }).waitFor();
    if (width < 1280) await page.getByRole("button", { name: "Close navigation" }).click();
    await page.screenshot({ path: join(tmpdir(), `sitescope-growth-${width}.png`), fullPage: false });
    await page.locator('input[inputmode="url"]').fill("example.com");
    await page.locator("form").getByRole("button").click();
    await page.waitForURL("**/report/fixture");
    await page.getByText("Fictional test report").waitFor();
    assert.equal(await page.getByRole("button", { name: "删除报告" }).count(), 0);
    assert.ok(await page.getByText("搜索可见性", { exact: true }).isVisible());
    assert.deepEqual(errors, []);
    const missing = await page.goto(base + "/this-page-does-not-exist");
    assert.equal(missing.status(), 404);
    await page.goto(base + "/login");
    assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
    checks.push({ width, pages: 11, auditFlow: "fixture PASS", consoleErrors: errors.length, localLab: labMetrics });
    await context.close();
  }
  const context = await browser.newContext();
  for (const path of internalLinks) {
    if (/^\/(api|auth|report)\b/.test(path)) continue;
    const response = await context.request.get(base + path);
    assert.ok(response.status() < 400, `Broken internal link: ${path} (${response.status()})`);
  }
  await context.close();
  console.log(JSON.stringify({ checks, screenshots: [390, 768, 1440].map((width) => join(tmpdir(), `sitescope-growth-${width}.png`)) }));
} finally { await browser.close(); }
