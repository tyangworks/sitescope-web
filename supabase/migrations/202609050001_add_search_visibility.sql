-- Additive only. Apply before deploying the crawler that writes this column.
-- This migration does not change grants, RLS, existing rows, or ownership.
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS search_visibility jsonb;
