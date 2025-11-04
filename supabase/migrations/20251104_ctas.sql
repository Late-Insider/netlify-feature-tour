-- Ensure crypto extension for UUID generation
create extension if not exists "pgcrypto";

-- Ensure subscriber enums exist with required values
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscriber_category') THEN
    CREATE TYPE public.subscriber_category AS ENUM (
      'newsletter',
      'shop',
      'podcast',
      'auction-collector',
      'auction_creator',
      'contact'
    );
  ELSE
    PERFORM 1 FROM pg_enum WHERE enumtypid = 'subscriber_category'::regtype AND enumlabel = 'newsletter';
    IF NOT FOUND THEN ALTER TYPE public.subscriber_category ADD VALUE 'newsletter'; END IF;
    PERFORM 1 FROM pg_enum WHERE enumtypid = 'subscriber_category'::regtype AND enumlabel = 'shop';
    IF NOT FOUND THEN ALTER TYPE public.subscriber_category ADD VALUE 'shop'; END IF;
    PERFORM 1 FROM pg_enum WHERE enumtypid = 'subscriber_category'::regtype AND enumlabel = 'podcast';
    IF NOT FOUND THEN ALTER TYPE public.subscriber_category ADD VALUE 'podcast'; END IF;
    PERFORM 1 FROM pg_enum WHERE enumtypid = 'subscriber_category'::regtype AND enumlabel = 'auction-collector';
    IF NOT FOUND THEN ALTER TYPE public.subscriber_category ADD VALUE 'auction-collector'; END IF;
    PERFORM 1 FROM pg_enum WHERE enumtypid = 'subscriber_category'::regtype AND enumlabel = 'auction_creator';
    IF NOT FOUND THEN ALTER TYPE public.subscriber_category ADD VALUE 'auction_creator'; END IF;
    PERFORM 1 FROM pg_enum WHERE enumtypid = 'subscriber_category'::regtype AND enumlabel = 'contact';
    IF NOT FOUND THEN ALTER TYPE public.subscriber_category ADD VALUE 'contact'; END IF;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscriber_status') THEN
    CREATE TYPE public.subscriber_status AS ENUM ('pending', 'confirmed', 'unsubscribed', 'bounced');
  ELSE
    PERFORM 1 FROM pg_enum WHERE enumtypid = 'subscriber_status'::regtype AND enumlabel = 'pending';
    IF NOT FOUND THEN ALTER TYPE public.subscriber_status ADD VALUE 'pending'; END IF;
    PERFORM 1 FROM pg_enum WHERE enumtypid = 'subscriber_status'::regtype AND enumlabel = 'confirmed';
    IF NOT FOUND THEN ALTER TYPE public.subscriber_status ADD VALUE 'confirmed'; END IF;
    PERFORM 1 FROM pg_enum WHERE enumtypid = 'subscriber_status'::regtype AND enumlabel = 'unsubscribed';
    IF NOT FOUND THEN ALTER TYPE public.subscriber_status ADD VALUE 'unsubscribed'; END IF;
    PERFORM 1 FROM pg_enum WHERE enumtypid = 'subscriber_status'::regtype AND enumlabel = 'bounced';
    IF NOT FOUND THEN ALTER TYPE public.subscriber_status ADD VALUE 'bounced'; END IF;
  END IF;
END$$;

-- Ensure subscribers table exists with expected columns
CREATE TABLE IF NOT EXISTS public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  category public.subscriber_category NOT NULL DEFAULT 'newsletter',
  status public.subscriber_status NOT NULL DEFAULT 'pending',
  source text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.subscribers
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT timezone('utc', now());

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'public_insert_subscribers' AND tablename = 'subscribers'
  ) THEN
    CREATE POLICY public_insert_subscribers
      ON public.subscribers
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'service_all_subscribers' AND tablename = 'subscribers'
  ) THEN
    CREATE POLICY service_all_subscribers
      ON public.subscribers
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;
END$$;

-- Ensure contact_messages table exists with appropriate defaults
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'contact_messages_insert_anon' AND tablename = 'contact_messages'
  ) THEN
    CREATE POLICY contact_messages_insert_anon
      ON public.contact_messages
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS contact_messages_email_idx ON public.contact_messages (email);
