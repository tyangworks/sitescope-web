# Phase 4 Test Plan

## Automated Local Coverage

`npm run test:authorization` verifies:

- opaque anonymous tokens and hashed storage representation
- matching and non-matching anonymous ownership
- maximum Top 3 anonymous issues
- omission of Pro and raw fields from Anonymous and Free projections
- own-user Free access and cross-user denial
- persisted paid-owner Pro access
- inability of untrusted client flags to elevate access
- valid, invalid, idempotent, and conflicting claim decisions
- safe legacy fallback
- history projection field minimization and user-scoped query
- absence of broad true predicates in the lockdown migration

`npx tsc --noEmit --incremental false`, `npm run lint`, and `npm run build`
cover static integration and production compilation.

## Pending Supabase Integration Tests

A local Supabase instance is not configured in this repository. Before
production migration, test the migrations in a disposable Supabase branch or
staging project:

1. Anon direct `reports` SELECT is denied after lockdown.
2. Authenticated direct `reports` SELECT is denied after lockdown.
3. Service-role BFF reads continue to work.
4. The ownership foreign key accepts a real Auth user UUID.
5. Duplicate anonymous token hashes are rejected.
6. A row cannot contain both ownership forms.
7. Claim conditional update cannot steal an owned row under concurrency.
8. User A history excludes User B reports.

## Browser Scenarios

1. Anonymous audit receives a cookie and a Top 3 preview only.
2. Copying only the new report URL to another clean browser returns not found.
3. Signing in from the owning browser claims the report and survives refresh.
4. Authenticated Free receives all Free issues but no `fix_plans` response key.
5. Paid owner receives Pro data after persisted entitlement is present.
6. `?isPaid=true`, `?access=pro`, and forged user IDs do not change responses.
7. `/reports` requires authentication and lists only owned metadata.
8. Starting a second anonymous audit replaces the one-report continuation cookie.

Stripe writes, Auth callback cookie persistence, and transactional credit
redemption remain Phase 5/7 test scope. Do not weaken Phase 4 authorization to
work around those known dependencies.
