import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join } from "node:path";
const require = createRequire(new URL("../../sitescope-crawler/package.json", import.meta.url));
const { chromium } = require("playwright");
const base = "http://localhost:3106";
const browser = await chromium.launch();
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    await context.addInitScript(() => localStorage.setItem("language", "en"));
    let contactMode = "delivered";
    let posts = 0;
    await context.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.origin !== base) return route.abort();
      if (!url.pathname.startsWith("/api/")) return route.continue();
      if (url.pathname === "/api/contact") {
        posts++;
        if (contactMode === "html") return route.fulfill({ status: 502, contentType: "text/html", body: "<!DOCTYPE html><h1>Unavailable</h1>" });
        return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, id: "test-reference", emailSent: contactMode === "delivered" }) });
      }
      if (url.pathname === "/api/reports/public") {
        const page = Number(url.searchParams.get("page") || 0);
        return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ reports: Array.from({ length: page < 2 ? 3 : 1 }, (_, i) => ({ id: `${page}-${i}`, url: `https://example.com/report-${page}-${i}`, score: 80, screenshot_url: "" })), nextPage: page < 2 ? page + 1 : null }) });
      }
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ authenticated: false, isAdmin: false }) });
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base);
    const gallery = page.getByRole("region", { name: "Public audit reports" });
    await gallery.getByText("https://example.com/report-0-0", { exact: true }).waitFor();
    assert.equal(await gallery.locator('a[href^="/report/"]').count(), 3);
    await gallery.getByRole("button", { name: "Next reports" }).click();
    await gallery.getByText("https://example.com/report-1-0", { exact: true }).waitFor();
    assert.equal(await gallery.locator('a[href^="/report/"]').count(), 3);
    await gallery.getByRole("button", { name: "Next reports" }).click();
    await gallery.getByText("https://example.com/report-2-0", { exact: true }).waitFor();
    assert.ok(await gallery.getByRole("button", { name: "Next reports" }).isDisabled());
    await gallery.getByRole("button", { name: "Previous reports" }).click();
    await gallery.getByText("https://example.com/report-1-0", { exact: true }).waitFor();
    await gallery.screenshot({ path: join(tmpdir(), `sitescope-public-gallery-${width}.png`) });
    for (const mode of ["delivered", "unavailable", "html"]) {
      contactMode = mode;
      await page.goto(base + "/contact");
      await page.locator('input[type="email"]').fill("fixture@example.com");
      await page.getByPlaceholder("Your Company Name").fill("Test company");
      await page.locator("textarea").fill("This is an intercepted local form test.");
      await page.locator('button[type="submit"]').click();
      if (mode !== "html") {
        await page.getByRole("status").filter({ hasText: "test-reference" }).waitFor();
        assert.equal(await page.locator('input[type="email"]').inputValue(), "");
        if (mode === "unavailable") assert.match(await page.getByRole("status").filter({ hasText: "test-reference" }).innerText(), /do not resubmit/);
      } else {
        await page.getByText("Contact service is not available yet. Please try again after deployment.").waitFor();
        assert.equal(await page.locator('input[type="email"]').inputValue(), "fixture@example.com");
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    }
    assert.equal(posts, 3);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ width, gallery: "3/3/1 and back PASS", contact: "saved/delivered/provider-down/HTML-error PASS", pageErrors: 0 }));
    await context.close();
  }
} finally { await browser.close(); }
