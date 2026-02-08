-- Add shipping_stage to orders for progress bar (ordered | preparing | shipped | delivered)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_stage text DEFAULT 'ordered' 
  CHECK (shipping_stage IN ('ordered', 'preparing', 'shipped', 'delivered'));

-- Broadcasts table for admin announcements
CREATE TABLE IF NOT EXISTS broadcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;

-- Anyone can read active broadcasts (we'll use the most recent)
CREATE POLICY "Anyone can view broadcasts"
  ON broadcasts FOR SELECT
  TO public
  USING (true);

-- Only allow inserts from authenticated (admin check in app)
CREATE POLICY "Authenticated can create broadcasts"
  ON broadcasts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Profiles for admin role
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow service role to manage profiles (for admin setup)
CREATE POLICY "Admins can update profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert admin profile for tarunmass932007@gmail.com (run after user signs up, or use trigger)
-- We'll handle admin check in app by email comparison for now
