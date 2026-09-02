# SiteScope Credential Rotation Required

SiteScope is one product composed of `sitescope-web` and `sitescope-crawler`.
The credentials below must be rotated by an operator because their values were
committed in crawler Git history or hardcoded in tracked source. Never paste old
or replacement values into this document, Git, tickets, or chat.

| Service | Environment variable | Why rotation is required | Operator action | Code remediation |
| --- | --- | --- | --- | --- |
| Google AI Studio / Gemini | `GEMINI_API_KEY` | A credential was present in tracked crawler `.env` history and tracked source. | Revoke the exposed key in Google AI Studio, create a replacement, and update the crawler deployment secret store and local untracked `.env`. | Complete locally: crawler tracked source now reads the environment variable. |
| Stripe | `STRIPE_SECRET_KEY` | The secret was present in tracked crawler `.env` history. | Roll the affected test/live secret in Stripe, then update every SiteScope runtime that uses it. Validate in Stripe test mode first. | Complete locally: runtime code reads the environment variable. |
| Stripe webhook | `STRIPE_WEBHOOK_SECRET` | The signing secret was present in tracked crawler `.env` history. | Roll the signing secret for the affected Stripe webhook endpoint and update the owning runtime secret store. | Complete locally: runtime code reads the environment variable. |
| Supabase | `SUPABASE_SERVICE_ROLE_KEY` | The privileged key was present in tracked crawler `.env` history. | Rotate the service-role/API key through the Supabase project settings using the least disruptive supported procedure, then update authorized server runtimes only. | Complete locally: runtime code reads the environment variable. |
| SiteScope administration | `ADMIN_KEY` | The administrator secret was present in tracked crawler `.env` history. | Generate a new high-entropy value and update the crawler deployment secret store and authorized operator setup. | Complete locally: runtime code reads the environment variable. |

## Verification Items

- `RESEND_API_KEY`: no committed value was found in the current tracked files.
  Verify provider and deployment audit logs; rotate if the key was reused or
  exposed elsewhere.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_ANON_KEY`: these are publishable
  client credentials, not service-role secrets. RLS still requires separate
  remediation in Phase 4.
- Confirm old credentials have been revoked after replacement values are active.
- Do not rewrite Git history during stabilization without explicit approval.
