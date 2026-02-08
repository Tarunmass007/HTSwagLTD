import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const BroadcastBanner: React.FC = () => {
  const [broadcast, setBroadcast] = useState<{ id: string; message: string } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchLatest = async () => {
      const { data } = await supabase
        .from('broadcasts')
        .select('id, message')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data?.message) setBroadcast(data);
    };
    fetchLatest();

    const sub = supabase
      .channel('broadcasts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'broadcasts' }, () => {
        fetchLatest();
      })
      .subscribe();

    return () => {
      sub.unsubscribe();
    };
  }, []);

  if (!broadcast?.message || dismissed) return null;

  return (
    <div className="relative overflow-hidden bg-[rgb(var(--color-foreground))] text-[rgb(var(--color-background))] py-2 text-xs md:text-sm font-medium">
      <div className="overflow-hidden">
        <div className="animate-marquee whitespace-nowrap inline-flex items-center gap-16">
          <span>{broadcast.message}</span>
          <span>{broadcast.message}</span>
          <span>{broadcast.message}</span>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-white/10 transition-colors z-10"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
};
