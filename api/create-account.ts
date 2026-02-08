import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

type Res = { status: (n: number) => Res; json: (o: object) => void };

export default async function handler(
  req: { method?: string; body?: { email?: string; password?: string; otp?: string } | string },
  res: Res
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body: { email?: string; password?: string; otp?: string } | undefined;
    if (typeof req.body === 'string') {
      try {
        body = JSON.parse(req.body) as { email?: string; password?: string; otp?: string };
      } catch {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    } else {
      body = req.body;
    }
    const { email, password, otp } = body || {};
    if (!email || !password || !otp || typeof email !== 'string' || typeof password !== 'string' || typeof otp !== 'string') {
      return res.status(400).json({ error: 'Email, password, and OTP are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedOtp = otp.trim();

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: 'Service not configured' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 0. Check if user already exists (don't use OTP for existing users)
    const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 500 });
    const existingUser = listData?.users?.find((u) => u.email?.toLowerCase() === trimmedEmail);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists. Please sign in.' });
    }

    // 1. Verify OTP (only place that marks OTP as used for new signups)
    const { data: records, error: fetchError } = await supabase
      .from('email_otps')
      .select('id, used, expires_at')
      .eq('email', trimmedEmail)
      .eq('otp', trimmedOtp)
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error('Supabase OTP error:', fetchError);
      return res.status(500).json({ error: 'Verification failed' });
    }

    if (!records || records.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    const record = records[0];
    if (record.used) {
      return res.status(400).json({ error: 'This code has already been used' });
    }

    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    // 2. Create user with email pre-confirmed (bypasses Supabase email verification)
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: trimmedEmail,
      password,
      email_confirm: true,
    });

    if (createError) {
      console.error('Create user error:', createError);
      if (createError.message?.includes('already been registered') || createError.message?.includes('already exists')) {
        return res.status(400).json({ error: 'An account with this email already exists. Please sign in.' });
      }
      return res.status(400).json({ error: createError.message || 'Failed to create account' });
    }

    // 3. Mark OTP as used
    await supabase.from('email_otps').update({ used: true }).eq('id', record.id);

    // 4. Send welcome email
    if (process.env.RESEND_API_KEY) {
      resend.emails.send({
        from: 'HTS Swag <noreply@htswag.net>',
        to: [trimmedEmail],
        subject: 'Welcome to HTS Swag!',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
            <h1 style="color:#181d25;">HTS <span style="color:#f55266;">SWAG</span></h1>
            <h2 style="color:#181d25;">Welcome to HTS Swag!</h2>
            <p style="color:#4e5562;">Your account has been created successfully. You can now sign in and start shopping.</p>
            <a href="https://htswag.net/login" style="display:inline-block;padding:12px 24px;background:#f55266;color:white;text-decoration:none;border-radius:8px;font-weight:600;margin-top:16px;">Sign in</a>
            <p style="color:#6c727f;font-size:12px;margin-top:24px;">© ${new Date().getFullYear()} HTS Swag</p>
          </div>
        `,
      }).catch((e) => console.warn('Welcome email:', e));
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Create account error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
