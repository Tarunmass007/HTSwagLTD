import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const HOURS_ABANDONED = 24;

type Res = { status: (n: number) => Res; json: (o: object) => void };

export default async function handler(req: { method?: string; headers?: { authorization?: string } }, res: Res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const auth = req.headers?.authorization;
  if (auth !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey || !process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: 'Not configured' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const cutoff = new Date(Date.now() - HOURS_ABANDONED * 60 * 60 * 1000).toISOString();

    const { data: cartItems } = await supabase
      .from('cart_items')
      .select('user_id, product:products(name, image_url), quantity')
      .lt('updated_at', cutoff);

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({ success: true, sent: 0 });
    }

    const userIds = [...new Set(cartItems.map((c) => c.user_id))];
    const { data: { users } } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const userEmails = new Map<string, string>();
    users?.forEach((u) => {
      if (u.email) userEmails.set(u.id, u.email);
    });

    let sent = 0;
    for (const userId of userIds) {
      const email = userEmails.get(userId);
      if (!email) continue;

      const userItems = cartItems.filter((c) => c.user_id === userId);
      const itemsList = userItems.map((i) => `${(i.product as { name?: string })?.name || 'Item'} × ${i.quantity}`).join(', ');

      const { error } = await resend.emails.send({
        from: 'HTS Swag <noreply@htswag.net>',
        to: [email],
        subject: 'You left items in your cart — HTS Swag',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
            <h1 style="color:#181d25;">HTS <span style="color:#f55266;">SWAG</span></h1>
            <h2 style="color:#181d25;">Your cart is waiting</h2>
            <p style="color:#4e5562;">You left items in your cart:</p>
            <p style="color:#181d25;font-weight:500;">${itemsList}</p>
            <a href="https://htswag.net/cart" style="display:inline-block;padding:12px 24px;background:#f55266;color:white;text-decoration:none;border-radius:8px;font-weight:600;margin-top:16px;">Complete your purchase</a>
            <p style="color:#6c727f;font-size:12px;margin-top:24px;">© ${new Date().getFullYear()} HTS Swag</p>
          </div>
        `,
      });

      if (!error) sent++;
    }

    return res.status(200).json({ success: true, sent });
  } catch (err) {
    console.error('Abandoned cart email error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
