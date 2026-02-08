import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'tarunmass932007@gmail.com';

type Res = { status: (n: number) => Res; json: (o: object) => void };

export default async function handler(
  req: { method?: string; headers?: { authorization?: string }; body?: { id?: string } | string },
  res: Res
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body: { id?: string } | undefined;
    if (typeof req.body === 'string') {
      try {
        body = JSON.parse(req.body);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    } else {
      body = req.body;
    }

    const { id } = body || {};
    if (!id) {
      return res.status(400).json({ error: 'Broadcast id is required' });
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
    const { error } = await supabase.from('broadcasts').update({ active: false }).eq('id', id);

    if (error) {
      console.error('Cancel broadcast error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Cancel broadcast error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
