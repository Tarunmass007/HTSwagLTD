import { createClient } from '@supabase/supabase-js';

export const config = { runtime: 'edge' as const };

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { email, otp } = await req.json();
    if (!email || !otp || typeof email !== 'string' || typeof otp !== 'string') {
      return new Response(JSON.stringify({ error: 'Email and OTP are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedOtp = otp.trim();

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: 'Service not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
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
      return new Response(JSON.stringify({ error: 'Verification failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!records || records.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid or expired verification code' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const record = records[0];
    if (record.used) {
      return new Response(JSON.stringify({ error: 'This code has already been used' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (new Date(record.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: 'Verification code has expired' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Mark as used
    await supabase.from('email_otps').update({ used: true }).eq('id', record.id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
