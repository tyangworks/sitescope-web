# Search growth checklist

No Search Console data was accessed or fabricated. Use the verified https://www.sitescope.fyi property (or the containing domain property).

1. Open Performance > Search results. Enable clicks, impressions, average CTR and average position. Compare the last 28 days with the prior period; consider seasonality and low sample sizes.
2. Queries: review brand/non-brand and audit intent separately. Low impressions suggest discovery/relevance issues; high impressions with low CTR warrant reviewing intent and displayed snippets. Average position is aggregated, not a fixed ranking.
3. Pages: filter the five audit landing pages and content cluster. Compare queries per page before splitting or consolidating content.
4. Indexing > Pages: review indexed and excluded URLs. Private report/auth URLs should be excluded by noindex. Investigate unintended noindex, redirects, duplicate canonical choices, crawled-not-indexed and errors on public pages.
5. Sitemaps: submit https://www.sitescope.fyi/sitemap.xml after deployment. It intentionally excludes private routes. Do not submit customer report URLs.
6. URL Inspection: inspect a landing page, check selected canonical and crawl/index status, run live inspection where needed, request indexing after meaningful fixes. Requests do not guarantee indexing.
7. Core Web Vitals: inspect field data by device when sufficient traffic exists. Local lab timing is not field LCP/INP/CLS.
8. Join acquisition evidence with aggregate audit-start, completion and qualified lead events. Do not send report contents or customer URLs to analytics.
9. Record date, page, change and expected outcome. Recheck after an appropriate crawl/traffic window rather than making daily speculative edits.

AI referrals: inspect known referral sources in existing analytics; missing referrer data and mentions without clicks limit attribution. No live AI citation tracker is implemented.
