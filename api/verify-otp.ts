import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

type Res = { status: (n: number) => Res; json: (o: object) => void };

export default async function handler(req: { method?: string; body?: { email?: string; otp?: string } | string }, res: Res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body: { email?: string; otp?: string } | undefined;
    if (typeof req.body === 'string') {
      try {
        body = JSON.parse(req.body) as { email?: string; otp?: string };
      } catch {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    } else {
      body = req.body;
    }
    const { email, otp } = body || {};
    if (!email || !otp || typeof email !== 'string' || typeof otp !== 'string') {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedOtp = otp.trim();

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: 'Service not configured' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: records, error: fetchError } = await supabase
      .from('email_otps')
      .select('id, used, expires_at')
      .eq('email', trimmedEmail)
      .eq('otp', trimmedOtp)
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error('Supabase error:', fetchError);
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

    // Mark OTP as used
    await supabase.from('email_otps').update({ used: true }).eq('id', record.id);

    // If user already exists with unconfirmed email, confirm it now (fixes "Email not confirmed" for old signups)
    let userExists = false;
    const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 500 });
    const existingUser = listData?.users?.find((u) => u.email?.toLowerCase() === trimmedEmail);
    if (existingUser && !existingUser.email_confirmed_at) {
      await supabase.auth.admin.updateUserById(existingUser.id, { email_confirm: true });
      userExists = true;
    }

    return res.status(200).json({ success: true, userExists });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
