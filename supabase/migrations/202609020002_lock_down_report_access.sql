-- Phase 4B: remove direct browser access to raw report rows.
-- Apply only after the SiteScope Web BFF and BFF-based report UI are deployed and verified.

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read reports" ON public.reports;

REVOKE ALL ON TABLE public.reports FROM anon;
REVOKE ALL ON TABLE public.reports FROM authenticated;

-- No anon/authenticated report policy is intentional. The Web BFF uses the
-- server-only service role and returns an explicit sanitized projection.
