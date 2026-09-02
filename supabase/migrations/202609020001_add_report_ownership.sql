-- Phase 4A: additive report ownership schema.
-- Apply before deploying the report BFF. This migration does not change access policies.

ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS user_id UUID NULL,
  ADD COLUMN IF NOT EXISTS anonymous_token_hash TEXT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'reports_user_id_fkey'
      AND conrelid = 'public.reports'::regclass
  ) THEN
    ALTER TABLE public.reports
      ADD CONSTRAINT reports_user_id_fkey
      FOREIGN KEY (user_id)
      REFERENCES auth.users(id)
      ON DELETE SET NULL;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'reports_owner_proof_exclusive'
      AND conrelid = 'public.reports'::regclass
  ) THEN
    ALTER TABLE public.reports
      ADD CONSTRAINT reports_owner_proof_exclusive
      CHECK (user_id IS NULL OR anonymous_token_hash IS NULL);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'reports_anonymous_token_hash_format'
      AND conrelid = 'public.reports'::regclass
  ) THEN
    ALTER TABLE public.reports
      ADD CONSTRAINT reports_anonymous_token_hash_format
      CHECK (
        anonymous_token_hash IS NULL
        OR anonymous_token_hash ~ '^[0-9a-f]{64}$'
      );
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_reports_user_created_at
  ON public.reports (user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_reports_anonymous_token_hash
  ON public.reports (anonymous_token_hash)
  WHERE anonymous_token_hash IS NOT NULL;
