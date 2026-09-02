## SiteScope System Context

SiteScope is ONE integrated product composed of sitescope-web and
sitescope-crawler. Never treat them as independent products.

This repository owns the SiteScope web application and SaaS business concerns:
UI, authentication, report access control, Stripe billing and entitlements,
contact forms, Resend delivery, SEO/content, and Web/BFF API routes.

The analysis runtime remains in `C:\dev\sitescope-crawler`. Do not move,
rename, merge, or reorganize either repository. Coordinate API contract changes
across both repositories and preserve the existing top-level structure.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
