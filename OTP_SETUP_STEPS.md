# OTP Verification Setup Steps

Follow these steps so OTP verification works when creating an account.

---

## Step 1: Create the `email_otps` table in Supabase

1. Open **[Supabase Dashboard](https://app.supabase.com)** and select your project.
2. Go to **SQL Editor**.
3. Click **New query**.
4. Paste the SQL below and run it.

```sql
-- Create email_otps table
CREATE TABLE IF NOT EXISTS email_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  otp text NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_otps_email ON email_otps(email);
CREATE INDEX IF NOT EXISTS idx_email_otps_expires ON email_otps(expires_at);

ALTER TABLE email_otps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to email_otps"
  ON email_otps FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

5. Click **Run** (or press Ctrl+Enter).
6. You should see a success message.

---

## Step 2: Get the Supabase service role key

1. In Supabase Dashboard, go to **Settings** → **API**.
2. Under **Project API keys**, find **service_role** (not the anon key).
3. Click **Reveal** and copy the key.
4. Keep this key secret and never expose it in frontend code.

---

## Step 3: Add environment variables in Vercel

1. Open **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Select your project (`HTSwagLTD`).
3. Go to **Settings** → **Environment Variables**.
4. Add these variables:

| Name | Value | Environments |
|------|--------|--------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Your **service_role** key from Step 2 | Production, Preview |
| `SUPABASE_URL` | `https://emstyqskbykierteesss.supabase.co` (or your project URL) | Production, Preview |
| `RESEND_API_KEY` | Your Resend API key (`re_...`) | Production, Preview |

5. Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set (for the frontend).

---

## Step 4: Redeploy on Vercel

1. In Vercel, go to **Deployments**.
2. Open the **⋮** menu on the latest deployment.
3. Click **Redeploy**.
4. Wait for the build to finish.

---

## Step 5: Test OTP flow

1. Open your site (e.g. `https://htswag.net`).
2. Click **Sign up**.
3. Enter your email and click **Send verification code**.
4. Check your email for the 6‑digit code.
5. Enter the code and click **Verify code**.
6. Set a password and create the account.

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| "Service not configured" | Add `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_URL` in Vercel |
| "Invalid or expired verification code" | Ensure the `email_otps` table exists and the code is correct and not expired |
| OTP email not received | Check `RESEND_API_KEY` in Vercel and Resend domain (e.g. `htswag.net`) |
| "Verification failed" | Check Supabase logs and that the table was created correctly |

---

## Check that the table exists

In Supabase → **Table Editor**, you should see `email_otps` with columns: `id`, `email`, `otp`, `expires_at`, `used`, `created_at`.
