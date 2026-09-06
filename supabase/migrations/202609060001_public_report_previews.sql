-- Additive publication and per-buyer snapshot support. No historical rows are published.
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS source_report_id uuid REFERENCES public.reports(id) ON DELETE SET NULL;
CREATE UNIQUE INDEX IF NOT EXISTS reports_buyer_source_unique ON public.reports(user_id, source_report_id);
CREATE INDEX IF NOT EXISTS reports_public_created_idx ON public.reports(created_at DESC, id DESC) WHERE is_public = true;

-- Only trusted Web BFF can redeem; email comes from the verified Auth user.
CREATE OR REPLACE FUNCTION public.redeem_owned_pro_credit(p_report_id uuid, p_user_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE credit public.pro_audit_credits%ROWTYPE; target public.reports%ROWTYPE; owner_email text;
BEGIN
  SELECT * INTO target FROM public.reports WHERE id = p_report_id AND user_id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Report ownership required'; END IF;
  IF target.is_paid THEN RETURN true; END IF;
  SELECT lower(email) INTO owner_email FROM auth.users WHERE id = p_user_id AND email_confirmed_at IS NOT NULL;
  IF owner_email IS NULL THEN RETURN false; END IF;
  SELECT * INTO credit FROM public.pro_audit_credits
    WHERE lower(email) = owner_email AND status = 'available'
    ORDER BY created_at, id LIMIT 1 FOR UPDATE SKIP LOCKED;
  IF NOT FOUND THEN RETURN false; END IF;
  UPDATE public.pro_audit_credits SET status = 'redeemed', redeemed_report_id = p_report_id, redeemed_at = now() WHERE id = credit.id;
  UPDATE public.reports SET is_paid = true WHERE id = p_report_id;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.redeem_owned_pro_credit(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_owned_pro_credit(uuid, uuid) TO service_role;
