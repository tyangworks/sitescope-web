# Production Rollout Record

Status: Web and crawler rollout complete. Migration 1 is applied. Migration 2
has not been executed and is not yet ready for approval.

## Crawler Release

- Previous production commit: `65fdd904339580b2b9774176068c19db499f0257`
- Active release commit: `26f27c5ba7e63ef11668ca306923d1116bbb3e15`
- Active release directory:
  `/home/admin/releases/sitescope-crawler/26f27c5ba7e63ef11668ca306923d1116bbb3e15`
- Rollback source: `/home/admin/sitescope-crawler`
- Process: PM2 `sitescope-backend`, TCP 4000
- Public path: Cloudflare Tunnel to `127.0.0.1:4000`

The release passed `npm ci`, syntax/tests, a temporary-port check, local
health/version checks, public health/version checks, and production-origin CORS
checks. The first PM2 reload retained the old script path; it was rolled back.
The successful activation explicitly recreated the process from the immutable
release and saved the process list.

PM2 boot support is installed and enabled. A cold-boot recovery test remains a
separate maintenance-window task; no reboot was performed during this rollout.

## Database Sequence

1. Record live `reports` columns, policies, grants, row count, and backup status.
2. Apply only `202609020001_add_report_ownership.sql`.
3. Verify old Web report reads and a controlled crawler insert.
4. Deploy and validate the new Web in Preview.
5. Promote the validated Web while retaining the prior Vercel deployment.
6. Run production acceptance tests.
7. Stop and request explicit approval for migration 2.

Migration 1 SHA-256:
`76ED845D9CF00ED83C3EAAF5A58683DDDC5596217C70A5715A8DCCE3C0EA724E`

Migration 1 was applied to the production `sitescope` Supabase project on
2026-09-02 after the operator explicitly accepted proceeding without a platform
backup. The Free plan reported no backups. Preflight recorded 29 report rows,
the existing broad public policies, and direct `anon`/`authenticated` table
grants. Postflight confirmed the same 29 rows, nullable `user_id` and
`anonymous_token_hash` columns, and unchanged legacy access policies.

Migration 2 remains unapplied and requires a separate explicit approval after
the new Web BFF passes production acceptance.

## Web Release

The stabilization branch is `stabilize/sitescope`; it was not merged to `main`.
The final Web release is commit
`9873194ab078a4ec83e371c676c8118bf49757ba`.

- Validated Preview deployment: `Hfg69VcGoZ4ihdZuehUxQbV8YkPw`
- Preview URL:
  `https://sitescope-8l4oeukqi-tyangworks-2587s-projects.vercel.app`
- Active production deployment: `1MrkA2TTdWe3KgvNfSgDLWGabc5d`
- Production deployment URL:
  `https://sitescope-l1gj03inl-tyangworks-2587s-projects.vercel.app`
- Production domain: `https://www.sitescope.fyi`
- Immediate rollback deployment: `HaZrZLfYjRw5vj3etBGfPqyXSBgQ`
- Immediate rollback commit:
  `0314cf497653df5272ee5eea3cf84978684a293e`
- Pre-stabilization rollback deployment: `7cfBjy5QzsC2JosYdHQpxGyihL4x`
- Pre-stabilization rollback commit:
  `44664d66da0cedd43698127cad09a478b80e018d`

The correct Vercel project is `sitescope-web`. A second project named
`sitescope` is connected to the same repository but its stabilization Preview
builds fail; it is not part of this rollout. Required server-only billing,
Supabase service-role, Resend/contact, and admin variable names were added to
the `sitescope-web` project for Production and Preview without exposing values.
The branch must be redeployed after this environment update.

Supabase Auth URL configuration was corrected on 2026-09-03:

- Site URL: `https://www.sitescope.fyi`
- Allowed production callbacks: `https://www.sitescope.fyi/**` and
  `https://sitescope.fyi/**`
- Allowed Preview callbacks:
  `https://*-tyangworks-2587s-projects.vercel.app/**`
- Allowed local callback: `http://localhost:3000/**`

Preview OAuth then returned to `/reports` on the requesting Preview deployment,
and the authenticated session survived a full refresh. The report and Pro Audit
pages now call the same-origin Web BFF for checkout and credit redemption rather
than the crawler's duplicated business endpoints.

The previous Stripe test Price was CAD 9.00. A replacement one-time USD 9.00
test Price was created under the existing test product, and `STRIPE_PRICE_ID`
was updated for Production and Preview. Production successfully opened Stripe
Checkout Sandbox at USD 9.00. No payment was submitted.

## Production Acceptance

Passed on 2026-09-03:

- `www.sitescope.fyi` resolves to the final production deployment.
- Homepage, content, services, contact, Pro Audit, crawler health, and crawler
  version endpoints return HTTP 200.
- Google OAuth returns to `/reports`; the session survives refresh.
- The configured admin sees the localized Delete Report control after the
  server identity check; an anonymous session does not.
- Anonymous report rendering contains a locked Pro placeholder and no rendered
  Pro fix-plan or code-snippet payload.
- Stripe Checkout uses a test session and displays USD 9.00.
- The report page has no horizontal overflow at a 390 px viewport.
- Browser console checks found no warnings or errors in the tested flows.

Pending before migration 2 can be called ready:

- A fresh audit and anonymous-to-authenticated claim could not be exercised
  because the production daily free-audit limit had already been reached.
- An actual admin deletion was not attempted because no disposable production
  report was available; no production data was deleted.
- Microsoft OAuth and Magic Link still require controlled manual acceptance.
- Cross-user report isolation is covered locally but still needs a controlled
  production account-pair check.

## Known Operational Risks

- PM2 cold-boot recovery is enabled but not yet proven by an actual reboot.
- Production credential rotation remains recommended security hardening.
- Dependency audits currently report unresolved findings; automated force fixes
  are intentionally excluded from this rollout.
- Migration 2 remains the step that closes direct database report access and is
  forbidden until the remaining controlled acceptance checks above pass.
