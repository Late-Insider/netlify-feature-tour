BEGIN;

-- Ensure enums exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'subscriber_category'
  ) THEN
    CREATE TYPE subscriber_category AS ENUM (
      'newsletter',
      'podcast',
      'shop',
      'contact',
      'auction_waitlist_collector',
      'auction_waitlist_creator'
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'subscriber_status'
  ) THEN
    CREATE TYPE subscriber_status AS ENUM (
      'pending',
      'confirmed',
      'unsubscribed',
      'bounced'
    );
  END IF;
END$$;

-- Create table if it does not exist
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  category subscriber_category NOT NULL DEFAULT 'newsletter',
  status subscriber_status NOT NULL DEFAULT 'pending',
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add missing source column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'subscribers'
      AND column_name = 'source'
  ) THEN
    ALTER TABLE public.subscribers ADD COLUMN source TEXT;
  END IF;
END$$;

-- Helpful index
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);

-- Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Anonymous insert policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'subscribers'
      AND policyname = 'public_insert_subscribers'
  ) THEN
    CREATE POLICY "public_insert_subscribers"
    ON public.subscribers
    FOR INSERT
    TO anon
    WITH CHECK (true);
  END IF;
END$$;

-- Service role policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'subscribers'
      AND policyname = 'service_all_subscribers'
  ) THEN
    CREATE POLICY "service_all_subscribers"
    ON public.subscribers
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
  END IF;
END$$;

COMMIT;
