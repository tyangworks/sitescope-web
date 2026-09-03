# Production Rollout Record

Status: in progress. Migration 1 is applied. Migration 2 has not been executed.

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

The stabilization branch is `stabilize/sitescope`. The release must use an
explicit clean commit and must not be merged to `main` as part of this rollout.
Preview and production deployment identifiers, URLs, and rollback target are
recorded after Vercel supplies them.

The correct Vercel project is `sitescope-web`. A second project named
`sitescope` is connected to the same repository but its stabilization Preview
builds fail; it is not part of this rollout. Required server-only billing,
Supabase service-role, Resend/contact, and admin variable names were added to
the `sitescope-web` project for Production and Preview without exposing values.
The branch must be redeployed after this environment update.

## Known Operational Risks

- PM2 cold-boot recovery is enabled but not yet proven by an actual reboot.
- Production credential rotation remains recommended security hardening.
- Dependency audits currently report unresolved findings; automated force fixes
  are intentionally excluded from this rollout.
- Migration 2 remains the step that closes direct database report access and is
  forbidden until the BFF path passes production acceptance.
