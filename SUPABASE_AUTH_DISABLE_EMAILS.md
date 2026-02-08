# Disable Supabase Auth Emails

To prevent Supabase from sending any auth-related emails (confirmation, password reset, etc.):

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers** → **Email**
4. Turn **OFF** the following:
   - **Confirm email** – Disables email confirmation on signup
   - **Secure email change** – Disables confirmation when changing email
5. Under **Auth** → **Email Templates**, you can leave them as-is since they won't be sent if the above are disabled
6. For **Magic Link** and **Password Recovery**: If you use custom auth flows (like OTP), these may still send. To fully disable:
   - Ensure you're not using `signInWithOtp` or `resetPasswordForEmail` in your app
   - Your app uses custom OTP via `/api/send-otp` and `/api/verify-otp`, so Supabase auth emails are not used for signup

**Note:** Your app uses a custom OTP flow for signup, so Supabase's built-in confirmation emails are not triggered for new users. The main settings to disable are **Confirm email** and any automatic emails you see in the Email section.
