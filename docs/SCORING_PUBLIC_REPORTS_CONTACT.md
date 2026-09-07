# Scoring, Public Reports and Contact Reliability

Date: 2026-09-06. Status: deployed to production after validation.

## Scoring

Crawler readiness-v3 ignores AI overall scores and the former 70-point fallback.
Search visibility combines measured SEO (80%) and GEO (20%). Overall nominal
weights are search 40, content 30, conversion 20 and performance 10. Unmeasured
categories are excluded and remaining weights normalized. Performance is currently
unmeasured for this aggregate. Explicit noindex/none caps the overall score at 60.
The formula is domain-independent, not a promise of traffic or actual conversion.
It is intentionally calibrated below a perfect score when only one page is
observed: missing real-user performance, site-wide coverage and real conversion
data apply a 10-point confidence adjustment in the normal case.
Existing stored scores are not rewritten; a fresh analysis is required. The exact
reason for the operator's historical 70-point report has not been established.
Production crawler commit `afce575` now emits v3. A fresh example.com acceptance
audit returned score 34 from measured score 44, with the expected 10-point
calibration penalty.

## Publication and Purchases

Homepage audits offer an unchecked public-preview consent checkbox. Existing
owned/private reports are not automatically published. Legacy unowned reports keep
their safe anonymous fallback. Public pages expose sanitized Free previews only.
The gallery fetches three reports at a time with previous/next controls; new inserts
can shift offset pages. It does not expose a global private report history.

Another reader signs in to purchase a private snapshot of a public report.
A unique buyer/source index prevents duplicate snapshots. The source author's paid
state never grants Pro access to another reader. Existing owned-report purchase
and configured admin access remain supported. Credit redemption uses authenticated
identity and an atomic service-role RPC, not a browser-supplied email. Deprecated
crawler checkout/credit POST endpoints return JSON 410 directing callers to Web BFF.
Existing webhook/finalization paths remain unchanged and require regression checks.

## Contact

The database remains the lead system of record. Notification delivery has an
eight-second timeout; HTTP/network failures cannot turn a saved lead into a failed
submission. The UI retains a receipt ID and displays one coherent saved/delivery
state. In-flight submissions are guarded. HTML errors preserve entered form data.
There is no background resend worker or cross-request idempotency guarantee.

Read-only Vercel inspection found no contact requests and no error/fatal logs in
the available last-hour window. The historical user-reported page crash was not
reproduced and cannot be attributed conclusively from those logs.

## Validation and Limits

- Web authorization/helper/source tests: 44 passed.
- Crawler tests: 13 passed, plus syntax check.
- Web lint: passed with no warnings; production build and its TypeScript check
  passed. Both repositories pass git diff --check; API contract hashes match.
- Local browser fixtures at 390px and 1440px: three/three/one gallery paging,
  previous navigation, delivered/saved-without-email/HTML-error form states passed.
- Fixtures intercept API traffic; they do not prove production DB or mail delivery.
- Database RPC execution, concurrent redemption, real Supabase policy integration
  and end-to-end Stripe TEST webhook/private-copy fulfillment remain pending.
- No production data, credentials, payments or service state changed in this task.

## Release Gates and Sequence

1. Operator reviews and approves
   `supabase/migrations/202609060001_public_report_previews.sql`. Record current
   schema/policies and recoverability before application. It adds two columns,
   indexes and a restricted transactional function; no mass data rewrite or table
   removal. It does not publish historical owned reports.
2. Apply that migration, then validate its RPC and buyer/source conflict behavior
   against disposable test fixtures with appropriate operator authorization.
3. Build coordinated explicit-SHA Web/crawler releases. Validate Preview checkout,
   source-versus-buyer authorization, contact persistence and scoring before rollout.
4. Deploy compatible Web and crawler, retaining the previous deployment/release.
   Verify BFF report access, history, claims, public projection and admin maintenance.
5. Obtain EXPLICIT approval for the previously pending
   `202609020002_lock_down_report_access.sql` before executing it. Existing raw
   database grants/policies remain a potential paywall bypass until lockdown.
   Do not claim end-to-end Pro confidentiality before this is verified.
6. Verify anonymous/authenticated raw-table denial and safe BFF public previews;
   run controlled production smoke tests. No live Stripe charges are needed.

## Rollback

Before RLS lockdown, revert Web/crawler to recorded previous releases if validation
fails; leave additive columns/indexes in place. Preserve leads, purchased snapshots
and credit records. Do not reverse credit state automatically. After lockdown,
roll back only to a verified BFF-compatible release, never restore broad raw-table
grants as a convenience. SQL changes require a reviewed forward repair if needed.
