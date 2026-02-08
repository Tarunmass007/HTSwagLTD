-- ============================================
-- HTS SWAG - Broadcasts Table (Idempotent)
-- Run this in Supabase SQL Editor - safe to run multiple times
-- ============================================

-- 1. Create broadcasts table (only if not exists)
CREATE TABLE IF NOT EXISTS public.broadcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- 2. Add active column if table already existed without it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'broadcasts' AND column_name = 'active'
  ) THEN
    ALTER TABLE public.broadcasts ADD COLUMN active boolean DEFAULT true;
  END IF;
END $$;

-- 3. Enable RLS
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies (avoids "policy already exists" error) then create
DROP POLICY IF EXISTS "Anyone can view broadcasts" ON public.broadcasts;
CREATE POLICY "Anyone can view broadcasts"
  ON public.broadcasts FOR SELECT
  TO public
  USING (active = true);

DROP POLICY IF EXISTS "Authenticated can create broadcasts" ON public.broadcasts;
CREATE POLICY "Authenticated can create broadcasts"
  ON public.broadcasts FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update broadcasts" ON public.broadcasts;
CREATE POLICY "Authenticated can update broadcasts"
  ON public.broadcasts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
