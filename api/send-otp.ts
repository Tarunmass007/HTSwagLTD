import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req: { method?: string; body?: { email?: string } | string }, res: { status: (n: number) => unknown; json: (o: object) => void }) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }
    const { email } = body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: 'Email service not configured' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in Supabase
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      await supabase.from('email_otps').insert({
        email: trimmedEmail,
        otp,
        expires_at: expiresAt.toISOString(),
      });
    }

    // Send OTP via Resend
    const { error } = await resend.emails.send({
      from: 'HTS Swag <noreply@htswag.net>',
      to: [trimmedEmail],
      subject: 'Your verification code — HTS Swag',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td style="background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #181d25;">
            HTS <span style="color: #f55266;">SWAG</span>
          </h1>
        </div>
        <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #181d25;">
          Verify your email address
        </h2>
        <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #4e5562;">
          Use the verification code below to complete your account creation:
        </p>
        <div style="background: #f5f7fa; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #181d25;">${otp}</span>
        </div>
        <p style="margin: 0 0 8px; font-size: 13px; color: #6c727f;">
          This code expires in 10 minutes.
        </p>
        <p style="margin: 0; font-size: 13px; color: #6c727f;">
          If you didn't request this code, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e0e5eb; margin: 24px 0;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
          © ${new Date().getFullYear()} HTS Swag · Premium Merchandise & Gift Cards
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Send OTP error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
