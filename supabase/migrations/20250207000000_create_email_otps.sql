-- Email OTP verification table for sign-up flow
-- Used by Resend API to store and verify OTPs before account creation

CREATE TABLE IF NOT EXISTS email_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  otp text NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Index for fast lookup by email
CREATE INDEX IF NOT EXISTS idx_email_otps_email ON email_otps(email);
CREATE INDEX IF NOT EXISTS idx_email_otps_expires ON email_otps(expires_at);

-- RLS: Service role (used by API) bypasses RLS. Add policy for service_role to be explicit.
ALTER TABLE email_otps ENABLE ROW LEVEL SECURITY;

-- Service role gets full access (API routes use service_role key)
CREATE POLICY "Service role full access to email_otps"
  ON email_otps FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
