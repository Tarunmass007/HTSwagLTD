-- ============================================
-- HTS SWAG - Complete Supabase Setup SQL
-- ============================================
-- HOW TO RUN: Supabase Dashboard → SQL Editor → New Query → Paste this → Run
-- Safe to run multiple times - no "already exists" or "policy already exists" errors
-- ============================================

-- ============================================
-- 1. BROADCASTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.broadcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'broadcasts' AND column_name = 'active'
  ) THEN
    ALTER TABLE public.broadcasts ADD COLUMN active boolean DEFAULT true;
  END IF;
END $$;

ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;

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

-- ============================================
-- 2. SHIPPING_STAGE ON ORDERS (for progress bar)
-- ============================================
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_stage text DEFAULT 'ordered';
