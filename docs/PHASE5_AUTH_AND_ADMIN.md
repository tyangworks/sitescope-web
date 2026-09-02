# Phase 5 Auth And Admin Stabilization

SiteScope is one integrated product composed of `sitescope-web` and
`sitescope-crawler`.

## Session Architecture

The Web application uses `@supabase/ssr` for browser, Route Handler, and Proxy
clients. The root `proxy.ts` refreshes expiring sessions and copies refreshed
cookies to the response. OAuth and Magic Link callbacks exchange the supplied
code on the server and redirect only to a validated same-origin path.

Supported sign-in methods are Google, Microsoft (`azure`), and Magic Link.
Username/password authentication is intentionally not part of the product.

## Return And Claim Flow

Report sign-in links include a relative `next` path. After a successful callback,
the browser returns to that report. An authenticated report page can then call
the claim endpoint, which independently verifies the user session and anonymous
ownership cookie. Claims remain idempotent and cannot replace another owner.

## Logout

`POST /auth/signout` revokes the Supabase session and returns a private,
non-cacheable redirect. The reports page uses this server endpoint rather than
clearing local client state.

## Admin Authorization

The Delete Report control is shown only when `GET /api/auth/me` returns
`isAdmin: true`. This display check is not the authorization boundary.

`DELETE /api/admin/reports/[id]` independently:

1. verifies the Supabase session server-side;
2. compares the verified account email with server-only `ADMIN_EMAIL`;
3. rejects unauthenticated or non-admin requests;
4. performs report-related cleanup with the service-role client;
5. returns a JSON response.

Browser-provided email, local storage, query flags, and the former crawler
`ADMIN_KEY` route do not grant admin access.

## Production Requirements

Vercel must define these names for Preview and Production as appropriate:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `ANALYSIS_API_URL` or `NEXT_PUBLIC_API_URL`

Supabase Auth redirect configuration must allow the production callback and the
specific approved Preview callback. Avoid an unnecessarily broad wildcard.

## Validation

Local tests cover return-path validation, callback/session source usage,
server-side admin identity, admin route authorization, report claim behavior,
and cross-user report denial. OAuth provider completion and cookie persistence
must also be exercised in the deployed Preview because they depend on external
provider and Supabase redirect configuration.
