import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const ADMIN_EMAIL = 'tarunmass932007@gmail.com';
const resend = new Resend(process.env.RESEND_API_KEY);

type Res = { status: (n: number) => Res; json: (o: object) => void };

export default async function handler(
  req: { method?: string; headers?: { authorization?: string }; body?: { orderId?: string; status?: string; shipping_stage?: string } | string },
  res: Res
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body: { orderId?: string; status?: string; shipping_stage?: string } | undefined;
    if (typeof req.body === 'string') {
      try {
        body = JSON.parse(req.body);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    } else {
      body = req.body;
    }

    const { orderId, status, shipping_stage } = body || {};
    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    const authHeader = req.headers?.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: 'Server not configured' });
    }

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey || '');
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(authHeader.replace('Bearer ', ''));

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: order } = await supabase.from('orders').select('shipping_address, total_amount').eq('id', orderId).single();
    const customerEmail = (order?.shipping_address as { email?: string })?.email;

    const updates: Record<string, string> = {};
    if (status) updates.status = status;
    if (shipping_stage) updates.shipping_stage = shipping_stage;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Nothing to update' });
    }

    const { error } = await supabase.from('orders').update(updates).eq('id', orderId);

    if (error) {
      console.error('Admin update order error:', error);
      return res.status(500).json({ error: error.message });
    }

    // Send shipping update email to customer
    if (customerEmail && process.env.RESEND_API_KEY && (status || shipping_stage)) {
      const stageLabel = shipping_stage === 'ordered' ? 'Order Placed' : shipping_stage === 'preparing' ? 'Being Prepared' : shipping_stage === 'shipped' ? 'Shipped' : shipping_stage === 'delivered' ? 'Delivered' : status || '';
      const orderShort = `#${orderId.replace(/-/g, '').toUpperCase().slice(0, 8)}`;
      resend.emails.send({
        from: 'HTS Swag <orders@htswag.net>',
        to: [customerEmail.trim().toLowerCase()],
        subject: `Order ${orderShort} update — HTS Swag`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
            <h1 style="color:#181d25;">HTS <span style="color:#f55266;">SWAG</span></h1>
            <h2 style="color:#181d25;">Order Update</h2>
            <p style="color:#4e5562;">Your order ${orderShort} has been updated.</p>
            <p style="color:#181d25;font-weight:600;">Status: ${stageLabel || status}</p>
            <a href="https://htswag.net/orders" style="display:inline-block;padding:12px 24px;background:#f55266;color:white;text-decoration:none;border-radius:8px;font-weight:600;margin-top:16px;">View your orders</a>
            <p style="color:#6c727f;font-size:12px;margin-top:24px;">© ${new Date().getFullYear()} HTS Swag</p>
          </div>
        `,
      }).catch((e) => console.warn('Shipping update email:', e));
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Admin update order error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
