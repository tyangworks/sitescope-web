# Phase 4 Database Migration

Status: generated and locally reviewed; not executed against production.

## Files

- `supabase/migrations/202609020001_add_report_ownership.sql`
- `supabase/migrations/202609020002_lock_down_report_access.sql`

## Additive Migration

The first migration adds nullable `user_id` and `anonymous_token_hash`, a UUID
foreign key to `auth.users`, ownership exclusivity and SHA-256 format checks,
and indexes for user history and anonymous proof lookup. It does not backfill or
assign legacy rows and does not change policies.

Before applying, inspect the live column and constraint definitions. Stop if an
existing column with either name has an incompatible type or meaning.

## Lockdown Migration

The second migration enables and forces RLS, drops the known broad public SELECT
policy, and revokes all `reports` table privileges from `anon` and
`authenticated`. No replacement direct-read policy is intentional: report
projection is enforced in the Web BFF using the server-only service role.

Before applying, list all live policies and grants. Stop if undocumented
policies or external direct-table consumers are found.

## Exact Production Order

1. Confirm a recent Supabase backup and record existing report policies/grants.
2. Confirm required Vercel variables by name: `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and
   `ANALYSIS_API_URL` or `NEXT_PUBLIC_API_URL`.
3. Apply `202609020001_add_report_ownership.sql` only.
4. Verify existing production remains functional; columns are nullable.
5. Deploy the approved SiteScope Web Phase 4 commit.
6. Run non-destructive BFF smoke tests for a new anonymous audit, preview,
   authenticated claim, owner history, cross-user denial, and known paid owner.
7. Confirm browser network responses omit `fix_plans` for Anonymous and Free.
8. Apply `202609020002_lock_down_report_access.sql`.
9. Verify direct Supabase anon/auth report SELECT is denied while BFF reads work.
10. Monitor Web errors before declaring migration complete.

## Rollback Strategy

Before RLS lockdown, roll back the Web deployment if needed; additive nullable
columns and indexes can remain safely in place.

After RLS lockdown, prefer rolling the Web BFF forward or reverting only the
lockdown transaction from a reviewed copy of the previously recorded policies
and grants. Restoring `USING (true)` recreates the original data exposure and is
not an acceptable routine rollback. Do not drop ownership columns while reports
may contain new ownership data.

## Safety Review

The migrations contain no table drop, column drop, row delete, data backfill,
full-table update, public grant, `USING (true)`, or `WITH CHECK (true)`. The
second migration intentionally revokes client grants. Service-role values are
not present in SQL.

## Known Dependency

Crawler creates a row before Web attaches ownership. During that short interval,
the row is unreachable to browser roles once lockdown is active. A failed
ownership update returns a BFF error and does not disclose the report ID as a
usable report response.
