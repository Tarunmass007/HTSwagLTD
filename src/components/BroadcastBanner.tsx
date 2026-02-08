import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const DISMISSED_KEY = 'htswag_broadcast_dismissed';

function getDismissedIds(): string[] {
  try {
    const s = localStorage.getItem(DISMISSED_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function addDismissedId(id: string) {
  try {
    const ids = getDismissedIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids));
    }
  } catch {
    // ignore
  }
}

export const BroadcastBanner: React.FC = () => {
  const [broadcast, setBroadcast] = useState<{ id: string; message: string } | null>(null);

  useEffect(() => {
    const fetchLatest = async () => {
      const { data } = await supabase
        .from('broadcasts')
        .select('id, message')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data?.message && !getDismissedIds().includes(data.id)) setBroadcast(data);
      else setBroadcast(null);
    };
    fetchLatest();

    const channel = supabase
      .channel('broadcasts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'broadcasts' }, () => {
        fetchLatest();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDismiss = () => {
    if (broadcast?.id) addDismissedId(broadcast.id);
    setBroadcast(null);
  };

  if (!broadcast?.message) return null;

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
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-white/10 transition-colors z-10"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
};
