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
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data?.message) setBroadcast(data);
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
    setDismissed(true);
  };

  if (!broadcast?.message || dismissed) return null;

  const words = broadcast.message.trim().split(/\s+/).filter(Boolean);
  const displayWords = words.length > 0 ? words : [broadcast.message];
  const WordChunk = ({ copyId }: { copyId: number }) => (
    <>
      {displayWords.map((word, i) => (
        <span key={`${copyId}-${i}`} className="inline-flex flex-shrink-0 items-center whitespace-nowrap mx-2">
          {word}
        </span>
      ))}
    </>
  );

  return (
    <div className="relative overflow-hidden bg-[rgb(var(--color-foreground))] text-[rgb(var(--color-background))] py-2 text-xs md:text-sm font-medium">
      <div className="overflow-hidden">
        <div className="animate-marquee inline-flex items-center flex-nowrap min-w-max">
          <WordChunk copyId={1} />
          <span className="flex-shrink-0 w-16 min-w-[4rem]" aria-hidden />
          <WordChunk copyId={2} />
          <span className="flex-shrink-0 w-16 min-w-[4rem]" aria-hidden />
          <WordChunk copyId={3} />
          <span className="flex-shrink-0 w-16 min-w-[4rem]" aria-hidden />
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
