# SiteScope Report Access Model

SiteScope is one integrated product composed of `sitescope-web` and
`sitescope-crawler`. This document describes the local Phase 4 implementation.
No production database or deployment change has been made.

## Current Architecture Before Phase 4

The browser used the Supabase anonymous client to select complete `reports`
rows. Report detail used `select("*")`, history selected every report, and the
React page blurred fields after they had already reached browser memory. Email
unlock was transient React state. A report UUID was effectively sufficient to
download all stored fields while the public RLS policy used `USING (true)`.

## Target Architecture

The browser calls SiteScope Web Route Handlers. The Web BFF verifies a Supabase
access token or an HttpOnly anonymous proof, reads with the server-only service
role, determines the effective access level, and returns a strict projection.
Crawler remains responsible for analysis and initial persistence.

```text
Browser -> SiteScope Web BFF -> authorization -> Supabase -> projection -> Browser
                         |
                         +-> Crawler POST /api/analyze
```

Raw database rows are never public API response types.

## Security Problem Addressed

- CSS blur is not authorization.
- A UUID is an identifier, not an ownership credential.
- Authentication alone does not imply payment.
- RLS cannot safely expose an entire mixed Free/Pro row to a Free user.
- Client state, URL parameters, local storage, and Stripe success-page presence
  are not entitlement sources.

## Access Levels

### Anonymous

An anonymous owner receives public site metadata, score, summary, screenshot,
at most three issues, and at most two content suggestions. The response omits
fix plans, code snippets, ownership fields, payment fields, and internal data.

### Authenticated Free

The authenticated owner receives every current Free issue and content
suggestion and sees the report in private history. The response omits fix plans
and other Pro-only implementation material. Another account receives a 404-style
denial and cannot infer whether the report exists.

### Paid Pro

An owner whose report has persisted `is_paid = true` receives full issues,
suggestions, fix plans, implementation steps, and generated code snippets. This
is report-specific. Phase 7 will harden Stripe event and credit transactions;
Phase 4 consumes the existing persisted payment marker only.

## Ownership Model

`reports.user_id` identifies an authenticated owner. An anonymous report stores
`reports.anonymous_token_hash`; the plaintext random token exists only in a
30-day HttpOnly, SameSite=Lax cookie. A constraint prevents a report from having
both ownership forms. Claiming changes anonymous ownership to authenticated
ownership and removes the hash.

The current MVP cookie intentionally continues one anonymous report at a time.
Starting another anonymous audit replaces the cookie. Complex anonymous history
is not implemented.

## Analysis And Cache Handling

Audit forms call Web `POST /api/analyze`. Web forwards the normalized URL to the
Crawler but does not forward Crawler's report body to the browser. For a fresh
row, Web conditionally attaches the authenticated user or anonymous token hash.
For a Crawler cache hit, Web clones the measured report content into a new
unpaid row with new ownership. This prevents visitors from sharing one cached
row, token, or paid state.

## Claim Flow

1. A signed-in browser calls `POST /api/reports/[id]/claim`.
2. Web validates the Supabase bearer token server-side.
3. Web hashes the HttpOnly cookie and compares it with the stored association.
4. A conditional update assigns `user_id` only if the report is still unowned
   and the proof still matches.
5. Repeated calls by the same owner succeed; another owner receives conflict.
6. Web clears the anonymous cookie after a successful or idempotent claim.

No client-provided user ID or access flag participates in this decision.

## Canonical Read APIs

- `GET /api/reports/[id]`: authorized, projected report detail.
- `POST /api/reports/[id]/claim`: authenticated anonymous-to-user claim.
- `GET /api/reports`: metadata for `auth.uid()`-equivalent verified user only.
- `GET /api/reports/public`: limited metadata for legacy unowned social proof.

All private responses use `Cache-Control: private, no-store`.

## Paid Entitlement

`getReportAccessLevel()` derives Pro only from persisted `reports.is_paid` plus
verified ownership. Query strings such as `isPaid=true`, local state, and success
redirects cannot elevate access. Existing payment and credit writers remain a
temporary Phase 7 dependency and are not treated as client authority.

## Legacy Email Unlock

The browser-side insert and transient email unlock state have been removed from
the report page. The replacement CTA uses proper sign-in and report claim. The
`email_unlocks` table and old backend route remain until later caller/deprecation
review; they no longer grant report authorization.

## Legacy Report Handling

- Legacy rows with both owner fields null receive the anonymous projection,
  even when `is_paid` is true.
- They are not automatically assigned to a user and cannot be claimed without
  proof.
- Future anonymous rows require the matching token hash.
- Future authenticated rows require the matching verified user.

This intentionally favors confidentiality over unrestricted legacy links.

## Migration Plan

1. Apply the additive ownership migration.
2. Deploy the Web BFF and BFF-based UI after explicit production approval.
3. Verify analysis, anonymous viewing, login claim, history, and paid reads.
4. Apply the RLS lockdown migration.
5. Verify anonymous clients cannot directly select `reports`.

Detailed sequencing and rollback guidance are in
`docs/PHASE4_DATABASE_MIGRATION.md`.
