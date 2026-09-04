import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

test("shared header contains every primary navigation destination", () => {
  const header = source("../app/components/SiteHeader.tsx");
  for (const destination of ["/", "/#pricing", "/content", "/services", "/reports"]) {
    assert.match(header, new RegExp(`href: \\"${destination.replace("/", "\\/")}\\"`));
  }
  assert.match(header, /t\.nav\.(analyze|pricing|content|services|history)/);
});

test("core pages use the shared header instead of page-specific navigation", () => {
  for (const page of [
    "../app/page.tsx",
    "../app/reports/page.tsx",
    "../app/contact/page.tsx",
    "../app/content/ContentIndexContent.tsx",
    "../app/content/[slug]/ContentArticleContent.tsx",
    "../app/services/ServicesContent.tsx",
  ]) {
    assert.match(source(page), /<SiteHeader \/>/, page);
  }
});

test("content, services, audit form, and footer have Chinese variants", () => {
  assert.match(source("../app/content/[slug]/contentData.zh.ts"), /为什么你的网站有流量却没有销量/);
  assert.match(source("../app/services/ServicesContent.tsx"), /网站建设与改版/);
  assert.match(source("../app/content/[slug]/AuditUrlForm.tsx"), /无需注册/);
  assert.match(source("../app/components/SiteFooter.tsx"), /支持我们继续提供免费 AI 网站审计/);
});
