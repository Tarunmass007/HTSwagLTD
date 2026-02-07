import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(
  req: { method?: string; body?: { email?: string; password?: string; otp?: string } | string },
  res: { status: (n: number) => unknown; json: (o: object) => void }
) {
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

    // 1. Verify OTP first
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
      if (createError.message?.includes('already been registered')) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }
      return res.status(400).json({ error: createError.message || 'Failed to create account' });
    }

    // 3. Mark OTP as used
    await supabase.from('email_otps').update({ used: true }).eq('id', record.id);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Create account error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
