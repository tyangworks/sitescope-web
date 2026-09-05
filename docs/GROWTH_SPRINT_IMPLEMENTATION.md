# Growth sprint implementation

Status: local implementation; production deployment and migration NOT performed.

## Runtime changes
Crawler adds deterministic Search Visibility v1 and targeted single-page extraction. JSON is parsed without removing URL slashes. Cached reports require v1 readiness. Web sanitizes readiness with an explicit numeric allowlist and preserves Free/Pro/admin ownership boundaries. Full raw data is never added to browser payloads.

Migration: supabase/migrations/202609050001_add_search_visibility.sql. Additive nullable JSONB only. No DROP, DELETE, UPDATE, policy or grant changes. New BFF cache SELECT and crawler inserts require this column; do not deploy before migration. Test on a staging database first. Deployment sequence after approval: additive migration, crawler health/contract smoke test, Web Preview validation, Web promotion, ownership/Pro acceptance. Rollback code only; leave column intact.

## Marketing and technical SEO
Shared responsive navigation, bilingual growth hero and four areas. Five curated landing pages, four bilingual GEO articles, upgraded existing growth articles, fictional /sample-report. Metadata canonicals use www.sitescope.fyi; explicit public sitemap; private route noindex metadata plus response headers. Organization/WebSite/WebApplication and Article/Breadcrumb JSON-LD use real names and no ratings. FAQ sections are visible; no FAQ rich-result guarantee. No new framework/animation dependency.

## Analytics
No analytics SDK/container initialization was found in active source. Adapter forwards events only when existing window.posthog or window.dataLayer exists; otherwise it does nothing. No external platform was provisioned. Events: homepage_viewed, audit_started, audit_completed, report_viewed, signup_started, signup_completed, pro_upgrade_clicked, checkout_started, checkout_completed, service_clicked, service_lead_submitted, sample_report_viewed, geo_landing_viewed, content_audit_cta_clicked.
Events contain only fixed event names. Signup completion means a successful authentication callback, including returning users. Checkout completion fires only after existing server verification succeeds and a same-tab checkout marker exists; it is not a revenue ledger or webhook replacement. Closing success early can lose analytics, not payment entitlement. Confirm consent requirements and delivery in operator analytics before relying on funnels. No customer URL/email/report ID/query string is explicitly sent.

## Scope limits
GEO score is not a ranking or citation probability. Six equally weighted dimensions summarize boolean signals. Paragraph length, link presence and word count are proxies; there is no quality/authority verification or cross-page crawl. Performance is qualitative unless measured data is supplied; no field CWV result is fabricated. Old reports have no readiness score until rerun. Chinese language uses existing browser preference; separate language URLs are deferred.

## Validation record
Production-build local browser run: 390px LCP snapshot 432ms, 768px 140ms, 1440px 148ms; observed initial CLS 0. These are unthrottled local snapshots with fixture API responses, not Lighthouse scores, complete-session CLS, or field Core Web Vitals. Public internal-link checks also passed. Crawler suite: 11/11.
Local checks: Web lint 0 errors/0 warnings, TypeScript and production build passed; 39 Web tests passed. Browser fixtures passed at 390/768/1440 widths across 11 public routes with valid canonicals, no overflow, no page exceptions, Chinese switching, menu interaction, mock audit-to-report navigation, normal-user delete absence, noindex on login and unknown-route 404. This is UI/contract fixture evidence, not live database integration or production field performance. No Lighthouse/CrUX performance score is claimed. Existing system fonts avoid a new font download; no heavy library was added.

See terminal validation and tests/growth-sprint.test.ts, tests/browser-growth.mjs. Browser tests use intercepted fixtures and never submit audits/payments/leads to production. Real staging Supabase migration and end-to-end live AI/persistence remain a release gate. Production RLS lockdown from earlier phases remains a separate operator-approved action; BFF projection tests do not prove direct database RLS has been applied.
