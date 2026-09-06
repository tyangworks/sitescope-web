# Growth sprint production rollout

Date: 2026-09-05. Operator explicitly authorized production deployment and controlled testing. No main-branch merge, credential rotation, live charge, report deletion, DNS change, or RLS lockdown was performed.

## Releases
| Component | Previous / rollback | Active |
| --- | --- | --- |
| Web commit | 75f7c5cd2781cc2016e6fa65180b420bf9d4749e | 3809bc82e7f2f8ec78da2d5b64e0ca47d6e27549 |
| Vercel production | JBVQvXtHv91Yii7LPEJ48Yx6udwB | 7DVLaH62ErScFaVCJNtoSpMNjQk4 |
| Crawler | a701006 | c7fabaa297cf2d6cc578e99bb8418a462c8c20fd |

Correct Vercel project: sitescope-web, team tyangworks-2587s-projects. Public URL: https://www.sitescope.fyi.
Final Preview: https://sitescope-g18p4wgiz-tyangworks-2587s-projects.vercel.app (DYJPRGcmoNnTT8pKqyazAEmy4NYZ).
Production build URL: https://sitescope-4n17b1hpa-tyangworks-2587s-projects.vercel.app.
Promotion rebuilt with Production configuration and reached Ready; it did not merge to main.

Crawler release: /home/admin/releases/sitescope-crawler/c7fabaa297cf2d6cc578e99bb8418a462c8c20fd. Source was archived from the explicit clean Git commit, transferred, and installed with npm ci from the committed lockfile. Existing shared .env was symlinked without changing values. Server npm test: 11/11, syntax check passed, npm ci audit reported zero vulnerabilities. Temporary port 4001 returned expected version before activation. Temporary PM2 process removed. Active sitescope-backend cwd/script verified against the new release, zero restarts observed, NODE_ENV production. PM2 save completed and pm2-admin remains enabled. Current release symlink updated. Port 4000 and Cloudflare Tunnel routing unchanged. Public health/version return 200 JSON with target SHA; both www and apex CORS origins verified.

## Database
Applied only supabase/migrations/202609050001_add_search_visibility.sql through the existing Supabase dashboard project.
SHA256: 1FCF1638F004434C3D22875297D75E9E8A25FEB7720FB9D73F68959553EF931F.
Preflight: id UUID, user_id nullable UUID, anonymous_token_hash nullable text; new column absent.
Postflight: search_visibility JSONB nullable present.
No data rewrite, drop, grants, policies, or RLS changes. No new backup was created; operator authorized direct production iteration. Nullable additive change is backward-compatible. Leave the column intact on code rollback.

## Acceptance
- Local final application build and TypeScript passed; lint passed without errors or warnings. Web tests 40/40 including severity-ordered anonymous Top 3; crawler 11/11.
- Local browser fixtures: 390/768/1440, eleven public pages, Chinese menu, internal links, mock audit/report, private noindex, unknown URL 404.
- Production read-only browser checks: ten public routes at each of 390/768/1440, canonical URL equivalence, no horizontal overflow. Screenshots manually reviewed. Public routes had zero console errors. Anonymous history correctly returns 401; its browser resource error is an expected access rejection, not a successful authenticated-history test.
- Preview live anonymous analysis of example.com completed through crawler, AI, persistence, and report rendering.
- Production cached anonymous audit acceptance: ownership cookie HttpOnly/Secure/SameSite=Lax, three issues maximum, numeric readiness retained, no fix plans/code/implementation steps/ownership fields. Separate request without ownership cookie returned 404. Only status and field-presence assertions were logged, never cookie values.
- Production logged-in administrator generated a fresh Chinese SiteScope audit, saw SEO/GEO readiness, full Pro findings and steps, and admin-only Delete Report UI. No delete or payment was clicked. Normal-user authorization and delete rejection covered by local tests, not a second live OAuth account in this sprint.
- No live Stripe charge, contact submission, new OAuth sign-in, or destructive acceptance tests performed.

## Remaining limitations
- RLS lockdown migration #2 from earlier work remains separately pending. BFF authorization is verified but does not close any still-open direct database permissions; review and approve the original security rollout independently.
- AI-authored explanations and fix plans remain heuristic and require calibration/review. A real report recommended FAQ rich results and generic word-count targets too strongly, and supplied an illustrative snippet with placeholders. Deterministic GEO scores do not validate those narrative claims. Do not advertise all generated snippets as executable or guaranteed ranking/citation improvements. A follow-up should constrain narrative evidence, remove inapplicable FAQ recommendations, and validate snippets.
- Existing Pro report core-section heading still says Free Preview/Top 3 although entitled users see the full list; priority badges remain English in Chinese reports. These are presentation follow-ups, not entitlement leaks.
- Analytics adapter exists, but no active PostHog/GTM initialization was found. Vercel Analytics and Speed Insights are not enabled. Event delivery/field CWV are not claimed.
- English is the indexable server locale; Chinese is the existing browser preference model, without distinct hreflang URLs.
- Tests do not establish full-site crawl coverage, actual AI citations, rankings, or real-user conversion lift.

## Rollback
Web: use Vercel Instant Rollback to JBVQvXtHv91Yii7LPEJ48Yx6udwB; verify domains and old behavior. Do not rebuild an arbitrary current branch as rollback.
Crawler: stop only sitescope-backend, start /home/admin/releases/sitescope-crawler/a701006/ecosystem.config.cjs with APP_COMMIT_SHA=a701006, reset the current symlink to that preserved release, verify local/public health/version, then pm2 save. Do not pull/reset the dirty legacy directory. Do not delete the previous release.
Database: retain nullable search_visibility; no rollback SQL needed.

## Next 30 days
Week 1: calibrate narrative quality, complete separately approved database security verification, submit sitemap and inspect landing URLs in Search Console.
Week 2: publish a worked SEO-vs-GEO example using owned/public demonstration data; distribute on existing LinkedIn/company channels with a relevant landing-page CTA.
Week 3: add a practical entity/schema guide with tested examples; answer relevant community questions without bulk promotion.
Week 4: use actual Search Console queries/CTR and consented analytics to improve two pages; avoid manufacturing traffic statistics or generating thin page variants.
