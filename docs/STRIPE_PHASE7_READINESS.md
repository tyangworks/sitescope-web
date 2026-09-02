# Stripe Phase 7 Readiness

The current rollout does not perform a live charge and does not complete the
Stripe hardening phase.

## Product Contract

- Product: SiteScope Pro Audit
- Displayed regular value: $29
- Launch price charged: $9 USD
- Payment type: one-time only
- No subscriptions, coupons, or promotion-code infrastructure

## Remaining Work

- Make Checkout creation canonical in the Web BFF.
- Use server-side `STRIPE_PRICE_ID`; never trust an amount from the browser.
- Bind Checkout metadata to a report and verified user when available.
- Create one redeemable Pro credit when Checkout starts without a report.
- Treat the verified Stripe webhook as the payment source of truth.
- Persist event/session/payment identifiers with uniqueness constraints.
- Make webhook handling idempotent under duplicate delivery.
- Make Pro credit redemption atomic through a database transaction or RPC.
- Make success/cancel pages observational; closing them must not lose payment.
- Derive report Pro access only from persisted entitlement.
- Exercise the complete flow in Stripe TEST MODE before any production charge.

## Current Dependency

Phase 4 authorization reads the persisted report payment marker. It does not
accept React state, local storage, URL flags, or success-page presence as proof.
The writer and credit paths still require Phase 7 review before live billing is
considered ready.
