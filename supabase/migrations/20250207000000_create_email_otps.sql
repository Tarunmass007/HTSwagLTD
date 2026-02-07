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

-- Allow service role full access (used by API routes)
-- RLS: Only service role can access; anon has no access
ALTER TABLE email_otps ENABLE ROW LEVEL SECURITY;

-- No policies for anon - API uses service role which bypasses RLS
-- Service role key bypasses RLS by default
